// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./IRift.sol";
import "./RiftTier.sol";
import "./RiftState.sol";

abstract contract RiftContracts is Initializable, IRift, RiftTier {

    function __RiftContracts_init() internal initializer {
        RiftTier.__RiftTier_init();
    }

    function setContracts(
        address _worldAddress,
        address _wndAddress,
        address _trainingProficiencyAddress,
        address _randomizerAddress,
        address _childTunnelAddress,
        address _gpAddress,
        address _sacrificialAlterAddress,
        address _consumablesAddress)
    external
    onlyAdminOrOwner
    {
        world = IWorld(_worldAddress);
        wnd = IWnD(_wndAddress);
        trainingProficiency = ITrainingProficiency(_trainingProficiencyAddress);
        randomizer = IRandomizerCL(_randomizerAddress);
        childTunnel = IChildTunnel(_childTunnelAddress);
        gp = IGP(_gpAddress);
        sacrificialAlter = ISacrificialAlter(_sacrificialAlterAddress);
        consumables = IConsumables(_consumablesAddress);
    }

    modifier contractsAreSet() {
        require(address(world) != address(0)
            && address(trainingProficiency) != address(0)
            && address(randomizer) != address(0)
            && address(wnd) != address(0)
            && address(gp) != address(0)
            && address(sacrificialAlter) != address(0)
            && address(consumables) != address(0)
            && address(childTunnel) != address(0), "Contracts not set");

        _;
    }
}