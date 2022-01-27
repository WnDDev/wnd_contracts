// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./ITrainingGrounds.sol";
import "./TrainingGroundsState.sol";
import "../../shared/randomizercl/IRandomizerCL.sol";
import "../world/IWorld.sol";
import "../tokens/sacrificialalter/ISacrificialAlter.sol";
import "../tokens/gp/IGP.sol";
import "../trainingproficiency/ITrainingProficiency.sol";
import "../traininggame/ITrainingGame.sol";

abstract contract TrainingGroundsContracts is Initializable, ITrainingGrounds, TrainingGroundsState {

    function __TrainingGroundsContracts_init() internal initializer {
        TrainingGroundsState.__TrainingGroundsState_init();
    }

    function setContracts(address _worldAddress, address _sacrificialAlterAddress, address _gpAddress, address _trainingProficiencyAddress, address _trainingGameAddress, address _randomizerAddress) external onlyAdminOrOwner {
        require(_worldAddress != address(0)
            && _gpAddress != address(0)
            && _trainingProficiencyAddress != address(0)
            && _trainingGameAddress != address(0)
            && _randomizerAddress != address(0)
            && _sacrificialAlterAddress != address(0), "Bad address.");

        world = IWorld(_worldAddress);
        sacrificialAlter = ISacrificialAlter(_sacrificialAlterAddress);
        gp = IGP(_gpAddress);
        trainingProficiency = ITrainingProficiency(_trainingProficiencyAddress);
        trainingGame = ITrainingGame(_trainingGameAddress);
        randomizer = IRandomizerCL(_randomizerAddress);
    }

    modifier contractsAreSet() {
        require(address(world) != address(0)
            && address(gp) != address(0)
            && address(trainingProficiency) != address(0)
            && address(trainingGame) != address(0)
            && address(randomizer) != address(0)
            && address(sacrificialAlter) != address(0), "Contracts not set");

        _;
    }
}