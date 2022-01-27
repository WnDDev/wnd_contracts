// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ITrainingGrounds.sol";
import "./TrainingGroundsDragonStakable.sol";
import "./TrainingGroundsWizardStakable.sol";

contract TrainingGrounds is Initializable, TrainingGroundsDragonStakable, TrainingGroundsWizardStakable {

    function initialize() external initializer {
        TrainingGroundsDragonStakable.__TrainingGroundsDragonStakable_init();
        TrainingGroundsWizardStakable.__TrainingGroundsWizardStakable_init();
    }
}