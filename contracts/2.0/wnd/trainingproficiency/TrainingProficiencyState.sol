// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../../shared/AdminableUpgradeable.sol";
import "../tokens/wnd/IWnD.sol";
import "../world/IWorld.sol";
import "../trainingproficiency/ITrainingProficiency.sol";
import "../../shared/randomizercl/IRandomizerCL.sol";

contract TrainingProficiencyState is Initializable, AdminableUpgradeable {

    // Proficiency is a scale from 0 -> maxProficiency that increases with each training
    mapping(uint256 => uint8) public tokenIdToProficiency;
    uint8 public maxProficiency;

    function __TrainingProficiencyState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();

        maxProficiency = 8;
    }
}