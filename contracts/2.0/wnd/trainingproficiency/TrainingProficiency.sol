// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ITrainingProficiency.sol";
import "./TrainingProficiencyState.sol";

contract TrainingProficiency is Initializable, ITrainingProficiency, TrainingProficiencyState {

    function initialize() external initializer {
        TrainingProficiencyState.__TrainingProficiencyState_init();
    }

    function setMaxProficiency(uint8 _maxProficiency) external onlyAdminOrOwner {
        maxProficiency = _maxProficiency;
    }

    function increaseProficiencyForWizard(uint256 _tokenId) external override onlyAdminOrOwner {
        uint8 _profCur = tokenIdToProficiency[_tokenId];
        if(_profCur >= maxProficiency) {
            return;
        }
        tokenIdToProficiency[_tokenId]++;
    }

    function proficiencyForWizard(uint256 _tokenId) external view override returns(uint8) {
        return tokenIdToProficiency[_tokenId];
    }
}