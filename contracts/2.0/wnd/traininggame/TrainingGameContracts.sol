// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./ITrainingGame.sol";
import "./TrainingGameState.sol";
import "../../shared/Adminable.sol";
import "../../shared/randomizercl/IRandomizerCL.sol";
import "../world/IWorld.sol";
import "../tokens/sacrificialalter/ISacrificialAlter.sol";
import "../tokens/gp/IGP.sol";
import "../tokens/wnd/IWnD.sol";
import "../trainingproficiency/ITrainingProficiency.sol";

abstract contract TrainingGameContracts is Initializable, ITrainingGame, TrainingGameState {

    function __TrainingGameContracts_init() internal initializer {
        TrainingGameState.__TrainingGameState_init();
    }

    function setContracts(address _worldAddress, address _sacrificialAlterAddress, address _consumables, address _gpAddress, address _wndAddress, address _trainingProficiencyAddress, address _randomizerAddress, address _riftAddress) external onlyAdminOrOwner {
        require(_worldAddress != address(0)
            && _gpAddress != address(0)
            && _wndAddress != address(0)
            && _trainingProficiencyAddress != address(0)
            && _randomizerAddress != address(0)
            && _sacrificialAlterAddress != address(0)
            && _consumables != address(0)
            && _riftAddress != address(0), "Bad address.");

        world = IWorld(_worldAddress);
        sacrificialAlter = ISacrificialAlter(_sacrificialAlterAddress);
        gp = IGP(_gpAddress);
        wnd = IWnD(_wndAddress);
        trainingProficiency = ITrainingProficiency(_trainingProficiencyAddress);
        randomizer = IRandomizerCL(randomizer);
        rift = IRift(_riftAddress);
        consumables = IConsumables(_consumables);
    }

    modifier contractsAreSet() {
        require(address(world) != address(0)
            && address(gp) != address(0)
            && address(wnd) != address(0)
            && address(trainingProficiency) != address(0)
            && address(randomizer) != address(0)
            && address(sacrificialAlter) != address(0)
            && address(consumables) != address(0)
            && address(rift) != address(0), "Contracts not set");

        _;
    }
}