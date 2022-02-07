// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./TrainingGameContracts.sol";
import "./TrainingGameTimeKeeper.sol";
import "./TrainingGame721Receiver.sol";
import "./TrainingGameRewards.sol";

contract TrainingGame is Initializable, TrainingGame721Receiver, TrainingGameRewards, TrainingGameTimeKeeper {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    function initialize() external initializer {
        TrainingGameRewards.__TrainingGameRewards_init();
        TrainingGameTimeKeeper.__TrainingGameTimeKeeper_init();
    }

    function setTrainingSettings(
        uint256 _trainingFee,
        uint8 _baseChanceWizardBurned,
        uint8 _maxBurnReduction)
        external onlyAdminOrOwner
    {
        require(_baseChanceWizardBurned >= _maxBurnReduction, "Bad settings");

        trainingFee = _trainingFee;
        baseChanceWizardBurned = _baseChanceWizardBurned;
        maxBurnReduction = _maxBurnReduction;
    }

    function train(uint256 _tokenId) external override contractsAreSet whenNotPaused trainingRewardsSet onlyEOA {
        require(wnd.isWizard(_tokenId), "Not a wizard");
        require(canWizardPlay(_tokenId), "Wizard must cool down");
        require(!isWizardTraining(_tokenId), "Already training");

        address _owner = world.ownerOfTokenId(_tokenId);
        require(_owner == msg.sender, "Not owner of token");

        uint256 _trainingFee = _getTrainingFee(_tokenId);

        require(gp.balanceOf(msg.sender) >= _trainingFee, "Not enough GP");

        // Must actually be at the training grounds.
        require(world.locationOfToken(_tokenId) == Location.TRAINING_GROUNDS, "Not staked at TG");

        updateNextPlayTime(_tokenId, msg.sender);

        gp.burn(msg.sender, _trainingFee);

        bytes32 _requestId = randomizer.getRandomNumber();
        tokenIdToInfo[_tokenId].requestId = _requestId;

        emit TrainingStarted(_owner, _tokenId, _requestId);
    }

    function revealTrainingReward(uint256 _tokenId) external override contractsAreSet trainingRewardsSet {
        bytes32 _requestId = tokenIdToInfo[_tokenId].requestId;
        require(_requestId != 0, "Not training");
        require(randomizer.isRequestIDFulfilled(_requestId), "No random yet");

        address _owner = world.ownerOfTokenId(_tokenId);
        require(_owner == msg.sender || isAdmin(msg.sender), "Bad permissions");

        uint256 _randomness = randomizer.randomForRequestID(_requestId);

        _processReward(_tokenId, _owner, _randomness);
    }

    function _processReward(uint256 _tokenId, address _owner, uint256 _randomness) private {

        uint8 _wizardProficiency = trainingProficiency.proficiencyForWizard(_tokenId);

        uint8 _chanceWizardKilled = _chanceWizardDies(_wizardProficiency);

        uint256 _killResult = _randomness % 100;
        // TODO Only die if equipment not equipped.
        if(_killResult < _chanceWizardKilled) {
            // Get killed.
            graveyard.killWizard(_tokenId, _owner);
        } else {
            // TODO: Roll for taking damage
            // TODO: If taking damage, check if died and send to graveyard instead of getting rewards
            // TODO: Remove any equipment from damage or kill check if equipped
            
            // To the rewards!
            uint256 _newRandom = uint256(keccak256(abi.encode(_randomness, _tokenId)));

            _findAndSendRewards(_tokenId, _owner, _newRandom, _wizardProficiency);

            _incrementGamePlayed(_tokenId, _wizardProficiency);
        }

        // Clear so they can play again
        delete tokenIdToInfo[_tokenId].requestId;
    }

    function _incrementGamePlayed(uint256 _tokenId, uint8 _proficiencyCur) private {
        tokenIdToInfo[_tokenId].gamesPlayed++;
        // Not at the highest proficiency level and are that the number of games needed for the next proficiency
        if(_proficiencyCur < proficiencyToGamesPlayed.length - 1 && tokenIdToInfo[_tokenId].gamesPlayed == proficiencyToGamesPlayed[_proficiencyCur + 1]) {
            trainingProficiency.increaseProficiencyForWizard(_tokenId);
        }
    }

    function _getTrainingFee(uint256 _tokenId) private view returns(uint256) {
        if(_tokenId <= 15000 && tokenIdToInfo[_tokenId].gamesPlayed ==0) {
            return 0;
        }
        uint8 _wizardProficiency = trainingProficiency.proficiencyForWizard(_tokenId);
        return trainingFee - (_wizardProficiency * 1000 ether);
    }

    function setProficiencyToGamesPlayed(uint8[] calldata _proficiencyToGamesPlayed) external onlyAdminOrOwner {
        proficiencyToGamesPlayed = _proficiencyToGamesPlayed;
    }

    function _findAndSendRewards(uint256 _tokenId, address _owner, uint256 _random, uint8 _wizardProficiency) private {
        uint256 _rewardId = pickReward(_random);
        _random >>= 32; // shuffle seed for new random
        uint256 _gpAmt = pickGPReward(_random);

        uint256 _newRandom = uint256(keccak256(abi.encode(_random, _random)));
        uint16 _amount = pickAmount(_rewardId, _newRandom, _wizardProficiency);

        consumables.mint(_rewardId, _amount, _owner);
        if(_gpAmt > 0) {
            gp.mint(_owner, _gpAmt);
        }

        emit RewardMinted(_owner, _tokenId, _rewardId, _amount, _gpAmt);
    }

    function _chanceWizardDies(uint8 _wizardProficiency) private view returns(uint8) {
        uint8 _chanceWizardBurned = baseChanceWizardBurned;
        // Lower the % chance to be burned by 1% per proficiency level up to a max amount
        if(_wizardProficiency > maxBurnReduction) {
            _chanceWizardBurned -= maxBurnReduction;
        } else {
            _chanceWizardBurned -= _wizardProficiency;
        }
        return _chanceWizardBurned;
    }

    function isWizardTraining(uint256 _tokenId) public view override returns(bool) {
        return tokenIdToInfo[_tokenId].requestId != 0;
    }

}