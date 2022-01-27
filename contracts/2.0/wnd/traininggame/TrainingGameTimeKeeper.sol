// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./ITrainingGame.sol";
import "./TrainingGameState.sol";

abstract contract TrainingGameTimeKeeper is Initializable, ITrainingGame, TrainingGameState {

    function __TrainingGameTimeKeeper_init() internal initializer {
        TrainingGameState.__TrainingGameState_init();
    }

    function setGameCooldown(uint256 _gameCooldownTime) external onlyAdminOrOwner {
        gameCooldownTime = _gameCooldownTime;
    }

    function updateNextPlayTime(uint256 _tokenId, address _player) internal {
        // Add 24 hours and subtract 4 hours per Rift Tier
        tokenIdToInfo[_tokenId].timeNextPlay = uint64(block.timestamp + (24 * 3600) - (4 * rift.getRiftTier(_player) * 3600)); // 3600 seconds is an hour
    }

    function canWizardPlay(uint256 _tokenId) public view override returns(bool) {
        return block.timestamp > timeWizardCanPlayNext(_tokenId);
    }

    function timeWizardCanPlayNext(uint256 _tokenId) public view override returns(uint256) {
        return tokenIdToInfo[_tokenId].timeNextPlay;
    }
}