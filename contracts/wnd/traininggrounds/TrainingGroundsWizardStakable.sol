// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./TrainingGroundsContracts.sol";
import "../world/IWorld.sol";

abstract contract TrainingGroundsWizardStakable is TrainingGroundsContracts {

    function __TrainingGroundsWizardStakable_init() internal initializer {
        TrainingGroundsContracts.__TrainingGroundsContracts_init();
    }

    function setStakingSettings(uint256 _wizardStakingCost, uint8 _chanceWizardStolen, uint256 _minTimeStaked, uint256 _treasureChestId) external onlyAdminOrOwner {
        require(_chanceWizardStolen <= 100, "Bad stolen chance");
        wizardStakingCost = _wizardStakingCost;
        chanceWizardStolen = _chanceWizardStolen;
        treasureChestId = _treasureChestId;
        minTimeStaked = _minTimeStaked;
    }

    function startStake(uint256 _tokenId, address _owner) external override onlyAdminOrOwner contractsAreSet {
        _startStakingOrUnstaking(_tokenId, _owner, true);
    }

    function finishStake(uint256 _tokenId) public override onlyAdminOrOwner contractsAreSet {
        _finishStakingOrUnstaking(_tokenId, true);
    }

    function startUnstake(uint256 _tokenId) external override onlyAdminOrOwner contractsAreSet {
        uint256 _timeStaked = tokenIdToTimeStaked[_tokenId];
        require(block.timestamp > _timeStaked + minTimeStaked, "Stake longer");

        require(!trainingGame.isWizardTraining(_tokenId), "Can't unstake while training");

        address _currentOwner = world.ownerOfTokenId(_tokenId);

        _startStakingOrUnstaking(_tokenId, _currentOwner, false);
    }

    function finishUnstake(uint256 _tokenId) external override onlyAdminOrOwner contractsAreSet {
        _finishStakingOrUnstaking(_tokenId, false);
    }

    function requestIdForTokenId(uint256 _tokenId) public view returns(bytes32) {
        return tokenIdToRequestId[_tokenId];
    }

    function _startStakingOrUnstaking(uint256 _tokenId, address _owner, bool _isStaking) private {
        if(_tokenId > 15000) {
            require(gp.balanceOf(_owner) >= wizardStakingCost, "Not enough GP");
            // Burn the fee.
            gp.burn(_owner, wizardStakingCost);
        }

        if(_isStaking) {
            // This will transfer the wizard to the world contract
            world.addWizardToWorld(_tokenId, _owner, Location.TRAINING_GROUNDS_ENTERING);
        } else {
            world.changeLocationOfWizard(_tokenId, Location.TRAINING_GROUNDS_LEAVING);
        }


        if(_canWizardGetStolen(_tokenId)) {
            bytes32 _requestId = randomizer.getRandomNumber();
            tokenIdToRequestId[_tokenId] = _requestId;

            if(_isStaking) {
                emit WizardStakingStart(_owner, _tokenId, _requestId);
            } else {
                emit WizardUnstakingStart(_owner, _tokenId, _requestId);
            }
        } else {
            // Wizard can't be stolen, so there is no point in waiting for a random number.
            _finalizeStakingOrUnstaking(_owner, _tokenId, _isStaking);
        }
    }

    // function testFinishStaking() public {
    //     uint256 _randomness = 30651181323863600757805402065249228182939696318774945618241995789939011552006;

    //     uint256 _result = _randomness % 100;
    //     uint8 _wizardProf = 0;
    //     uint8 _maxRemoval = _wizardProf > 8 ? 8 : _wizardProf;

    //     uint256 _chanceWizardStolen = chanceWizardStolen - _maxRemoval;
    //     if(world.totalNumberOfDragons() != 0 && _result < _chanceWizardStolen) {
    //         // Got stolen. Get bent.
    //         // The dragons number is fluctuating so using the same seed should be okay.
    //         address _dragonOwner = world.getRandomDragonOwner(_randomness, Location.TRAINING_GROUNDS);

    //         bool _hasChest = false;

    //         // Just look at the top bit for the 50/50 odds of stealing the chest
    //         if(_hasChest && _randomness >> 255 == 1) {
    //             // sacrificialAlter.adminSafeTransferFrom(_tokenOwner, _dragonOwner, treasureChestId, 1);
    //             // emit ChestStolen(_tokenOwner, _dragonOwner, _tokenId);

    //             _finalizeStakingOrUnstaking(_tokenOwner, _tokenId, _isStaking);
    //         } else {
    //             world.removeWizardFromWorld(_tokenId, _dragonOwner);
    //             // emit WizardStolen(_tokenOwner, _dragonOwner, _tokenId);
    //         }
    //     } else {
    //         _finalizeStakingOrUnstaking(_tokenOwner, _tokenId, _isStaking);
    //     }
    // }

    function _finishStakingOrUnstaking(uint256 _tokenId, bool _isStaking) private {
        bytes32 _requestId = requestIdForTokenId(_tokenId);
        require(randomizer.isRequestIDFulfilled(_requestId), "Not ready");
        delete tokenIdToRequestId[_tokenId];

        address _tokenOwner = world.ownerOfTokenId(_tokenId);

        uint256 _randomness = randomizer.randomForRequestID(_requestId);

        uint256 _result = _randomness % 100;
        uint8 _wizardProf = trainingProficiency.proficiencyForWizard(_tokenId);
        uint8 _maxRemoval = _wizardProf > 8 ? 8 : _wizardProf;

        uint256 _chanceWizardStolen = chanceWizardStolen - _maxRemoval;
        if(world.totalNumberOfDragons() != 0 && _result < _chanceWizardStolen) {
            // Got stolen. Get bent.
            // The dragons number is fluctuating so using the same seed should be okay.
            address _dragonOwner = world.getRandomDragonOwner(_randomness, Location.TRAINING_GROUNDS);

            bool _hasChest = sacrificialAlter.balanceOf(_tokenOwner, treasureChestId) > 0;

            // Just look at the top bit for the 50/50 odds of stealing the chest
            if(_hasChest && _randomness >> 255 == 1) {
                sacrificialAlter.adminSafeTransferFrom(_tokenOwner, _dragonOwner, treasureChestId, 1);
                emit ChestStolen(_tokenOwner, _dragonOwner, _tokenId);

                _finalizeStakingOrUnstaking(_tokenOwner, _tokenId, _isStaking);
            } else {
                world.removeWizardFromWorld(_tokenId, _dragonOwner);
                emit WizardStolen(_tokenOwner, _dragonOwner, _tokenId);
            }
        } else {
            _finalizeStakingOrUnstaking(_tokenOwner, _tokenId, _isStaking);
        }
    }

    function _finalizeStakingOrUnstaking(address _owner, uint256 _tokenId, bool _isStaking) private {
        if(_isStaking) {
            tokenIdToTimeStaked[_tokenId] = block.timestamp;
            world.changeLocationOfWizard(_tokenId, Location.TRAINING_GROUNDS);
            emit WizardStakingFinish(_owner, _tokenId);
        } else {
            delete tokenIdToTimeStaked[_tokenId];
            world.removeWizardFromWorld(_tokenId, _owner);
            emit WizardUnstakingFinish(_owner, _tokenId);
        }
    }

    function _canWizardGetStolen(uint256 _tokenId) private view returns(bool) {
        return chanceWizardStolen != 0
            && world.totalNumberOfDragons() != 0
            && _tokenId > 15000;
    }
}