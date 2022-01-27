// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

import "./TrainingGameContracts.sol";

abstract contract TrainingGameRewards is Initializable, TrainingGameContracts {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    function __TrainingGameRewards_init() internal initializer {
        TrainingGameContracts.__TrainingGameContracts_init();
    }

    // Clears existing reward Ids and replaces with the given reward ids.
    function setRewardSettings(uint256[] calldata _rewardIds, uint32[] calldata _rewardOdds, RewardMultiplier[] calldata _rewardMultipliers) external onlyAdminOrOwner {
        require(_rewardIds.length == _rewardOdds.length && _rewardOdds.length == _rewardMultipliers.length, "Invalid lengths");
        delete rewardIds;

        uint256 _oddsTotal = 0;

        for(uint256 i = 0; i < _rewardIds.length; i++) {
            uint256 _newRewardId = _rewardIds[i];
            rewardIds.add(_newRewardId);
            _oddsTotal += _rewardOdds[i];
            rewardIdToOdds[_newRewardId] = _rewardOdds[i];
            rewardIdToMultiplier[_newRewardId] = _rewardMultipliers[i];
        }

        require(_oddsTotal == ODDS_TOTAL, "Bad odds");
    }

    // Clears existing reward Ids and replaces with the given reward ids.
    function setGPRewardSettings(uint256[] calldata _gpAmts, uint32[] calldata _gpOdds) external onlyAdminOrOwner {
        require(_gpAmts.length == _gpOdds.length, "Invalid lengths");
        delete gpAmts;

        uint256 _oddsTotal = 0;

        for(uint256 i = 0; i < _gpAmts.length; i++) {
            uint256 _newGpAmt = _gpAmts[i];
            gpAmts.add(_newGpAmt);
            _oddsTotal += _gpOdds[i];
            gpAmtsToOdds[_newGpAmt] = _gpOdds[i];
        }

        require(_oddsTotal == ODDS_TOTAL, "Bad odds");
    }

    function pickReward(uint256 _random) internal view returns(uint256) {
        uint256 _result = _random % ODDS_TOTAL;

        uint32 _upperBound = 0;
        for(uint8 i = 0; i < rewardIds.length(); i++) {
            uint256 _rewardId = rewardIds.at(i);
            _upperBound += rewardIdToOdds[_rewardId];
            if(_result < _upperBound) {
                return _rewardId;
            }
        }

        revert("The odds are incorrect.");
    }

    function pickGPReward(uint256 _random) internal view returns(uint256) {
        uint256 _result = _random % ODDS_TOTAL;

        uint32 _upperBound = 0;
        for(uint8 i = 0; i < gpAmts.length(); i++) {
            uint256 _gpAmt = gpAmts.at(i);
            _upperBound += gpAmtsToOdds[_gpAmt];
            if(_result < _upperBound) {
                return _gpAmt;
            }
        }

        revert("The odds are incorrect.");
    }

    function pickAmount(uint256 _rewardId, uint256 _random, uint8 _wizardProficiency) internal view returns(uint16) {
        RewardMultiplier memory _multiplier = rewardIdToMultiplier[_rewardId];

        uint8 _multIndex = _wizardProficiency > 8 ? 8 : _wizardProficiency;
        uint16 _min = _multiplier.min[_multIndex];
        uint16 _max = _multiplier.max[_multIndex];

        if(_min == _max) {
            return _min;
        }

        uint16 _length = _max - _min + 1;
        uint256[] memory _odds = new uint256[](_length);

        // Every value between _min and _max does not have the same chance of being picked. Each higher value is half as likely as the one
        // before it.
        uint256 _currentOdd = 1;
        uint256 _maxRangeOdd = 0;
        for(uint16 i = _length - 1; i >= 0; i--) {
            _odds[i] = _currentOdd;
            _maxRangeOdd += _currentOdd;
            _currentOdd << 1;
        }

        uint256 _result = _random % _maxRangeOdd;

        uint256 _upperBound = 0;
        for(uint8 i = 0; i < _odds.length; i++) {
            _upperBound += _odds[i];
            if(_result < _upperBound) {
                return _min + i;
            }
        }

        revert("Odds broken");
    }

    modifier trainingRewardsSet() {
        require(rewardIds.length() > 0, "Rewards not set");

        _;
    }
}