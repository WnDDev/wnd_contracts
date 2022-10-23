// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./TrainingGameContracts.sol";
import "./TrainingGameTimeKeeper.sol";
import "./TrainingGameArmor.sol";
import "./TrainingGameRewards.sol";

contract TrainingGame is Initializable, TrainingGameRewards, TrainingGameArmor {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    function initialize() external initializer {
        TrainingGameRewards.__TrainingGameRewards_init();
        TrainingGameArmor.__TrainingGameArmor_init();
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

    function trainBatch(TrainingInfo[] calldata _tokensToTrain) external override contractsAreSet whenNotPaused trainingRewardsSet onlyEOA {
        uint256 len = _tokensToTrain.length;
        for (uint256 i = 0; i < len; i++) {
            TrainingInfo memory info = _tokensToTrain[i];
            _train(info.tokenId, info.isEquipped);
        }
    }

    function train(uint256 _tokenId, bool equipWizard) external override contractsAreSet whenNotPaused trainingRewardsSet onlyEOA {
        _train(_tokenId, equipWizard);
    }

    function _train(uint256 _tokenId, bool equipWizard) internal {
        require(wnd.isWizard(_tokenId), "Not a wizard");
        require(canWizardPlay(_tokenId), "Wizard must cool down");
        require(!isWizardTraining(_tokenId), "Already training");

        address _owner = world.ownerOfTokenId(_tokenId);
        require(_owner == msg.sender || isAdmin(msg.sender), "Not owner of token");

        uint256 _trainingFee = _getTrainingFee(_tokenId);

        require(gp.balanceOf(_owner) >= _trainingFee, "Not enough GP");

        // Must actually be at the training grounds.
        require(world.locationOfToken(_tokenId) == Location.TRAINING_GROUNDS, "Not staked at TG");
        if(equipWizard) {
            require(consumables.balanceOf(_owner, equipmentTokenId) > 0, "No armor to equip");
            equipArmor(_tokenId, _owner);
        }

        updateNextPlayTime(_tokenId, _owner);

        gp.burn(_owner, _trainingFee);

        if(tokenIdToInfo[_tokenId].gamesPlayed == 0
            && tokenIdToInfo[_tokenId].hp == 0)
        {
            tokenIdToInfo[_tokenId].hp = maxHPForToken(_tokenId);
        }

        bytes32 _requestId = randomizer.getRandomNumber();
        tokenIdToInfo[_tokenId].requestId = _requestId;

        emit TrainingStarted(_owner, _tokenId, _requestId);
    }

    function revealTrainingRewardBatch(uint256[] calldata _tokenIds) external override contractsAreSet trainingRewardsSet {
        uint256 len = _tokenIds.length;
        require(len > 0, "No wizards selected");
        for (uint256 i = 0; i < len; i++) {
            _revealTraining(_tokenIds[i]);   
        }
    }

    function revealTrainingReward(uint256 _tokenId) external override contractsAreSet trainingRewardsSet {
        _revealTraining(_tokenId);
    }

    function _revealTraining(uint256 _tokenId) internal {
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

        bool _wasWizardKilled;

        uint256 _killResult = _randomness % 100;
        bool wouldDie = _killResult < _chanceWizardKilled;
        if(wouldDie && !hasArmor(_tokenId)) {
            // Get killed.
            graveyard.killWizard(_tokenId, _owner);
            _wasWizardKilled = true;
        } else {
            if(wouldDie && hasArmor(_tokenId)) {
                burnArmor(_tokenId);
            }
           _randomness = uint256(keccak256(abi.encode(_randomness, _randomness)));

           uint256 _damageRoll = _randomness % 100;

           uint256 _damageChance = _chanceWizardDamaged(_wizardProficiency);

           if(_damageRoll < _damageChance) {
                uint8 damageTaken = baseDamage;
                if(hasArmor(_tokenId)) {
                    damageTaken -= armorDamageReductionAmt;
                    burnArmor(_tokenId);
                }
                // Death
                if(tokenIdToInfo[_tokenId].hp <= damageTaken) {
                    tokenIdToInfo[_tokenId].hp = 0;
                    graveyard.killWizard(_tokenId, _owner);
                    _wasWizardKilled = true;
                } else {
                    tokenIdToInfo[_tokenId].hp -= damageTaken;
                }
           }

            if(!_wasWizardKilled) {
                // To the rewards!
                uint256 _newRandom = uint256(keccak256(abi.encode(_randomness, _tokenId)));

                _findAndSendRewards(_tokenId, _owner, _newRandom, _wizardProficiency);

                _incrementGamePlayed(_tokenId, _wizardProficiency);
            }

            if(hasArmor(_tokenId)) {
                unequipArmor(_tokenId, _owner);
            }
        }

        // Clear so they can play again
        delete tokenIdToInfo[_tokenId].requestId;
    }

    function _incrementGamePlayed(uint256 _tokenId, uint8 _proficiencyCur) private {
        tokenIdToInfo[_tokenId].gamesPlayed++;
        // Not at the highest proficiency level and are that the number of games needed for the next proficiency
        if(_proficiencyCur < proficiencyToGamesPlayed.length - 1 && tokenIdToInfo[_tokenId].gamesPlayed == proficiencyToGamesPlayed[_proficiencyCur + 1]) {
            trainingProficiency.increaseProficiencyForWizard(_tokenId);
            // Increase HP as well if needed.
            tokenIdToInfo[_tokenId].hp++;
        }
    }

    function _getTrainingFee(uint256 _tokenId) public view returns(uint256) {
        if(_tokenId <= 15000 && tokenIdToInfo[_tokenId].gamesPlayed == 0) {
            return 0;
        }
        uint8 _wizardProficiency = trainingProficiency.proficiencyForWizard(_tokenId);
        uint256 proficiencyReductionAmt = 1000 ether;
        return trainingFee - (_wizardProficiency * proficiencyReductionAmt);
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

    function _chanceWizardDamaged(uint8 _wizardProficiency) private view returns(uint8) {
        return damagePercentChance - (_wizardProficiency * 2);
    }

    function healWithElixir(uint256 _tokenId, uint8 _quantity) external onlyEOA {
        _heal(_tokenId,_quantity);
    }

    function healWithElixirBatch(uint256[] calldata _tokenIds, uint8[] calldata _quantities) external onlyEOA {
        require(_tokenIds.length == _quantities.length, "invalid input");
        require(_tokenIds.length > 0, "No wizards given to heal");
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _heal(_tokenIds[i],_quantities[i]);
        }
    }

    function _heal(uint256 _tokenId, uint8 _quantity) internal {
        uint256 _currentHP = tokenIdToInfo[_tokenId].hp;
        uint256 _maxHP = maxHPForToken(_tokenId);
        require(_currentHP > 0, "TrainingGame: HP must be greater than 0");
        require(_quantity > 0, "TrainingGame: Can't heal with 0 elixirs");
        require(_currentHP + _quantity <= _maxHP, "TrainingGame: Quantity is wrong");
        require(elixirOfHealingId > 0, "TrainingGame: Elixir of Healing ID not set");

        consumables.burn(elixirOfHealingId, _quantity, msg.sender);

        tokenIdToInfo[_tokenId].hp += _quantity;
    }

    function isWizardTraining(uint256 _tokenId) public view override returns(bool) {
        return tokenIdToInfo[_tokenId].requestId != 0;
    }

    function maxHPForToken(uint256 _tokenId) public view returns(uint8) {
        return baseHP + trainingProficiency.proficiencyForWizard(_tokenId);
    }

    function resetWizard(uint256 _tokenId) external override onlyAdminOrOwner {
        delete tokenIdToInfo[_tokenId];
        trainingProficiency.resetProficiencyForWizard(_tokenId);
    }

}