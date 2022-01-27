//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./RiftRootState.sol";

abstract contract RiftRootContracts is Initializable, RiftRootState {

    function __RiftRootContracts_init() internal initializer {
        RiftRootState.__RiftRootState_init();
    }

    function setContracts(
        address _gpAddress,
        address _wndAddress,
        address _sacrificialAlterAddress,
        address _consumablesAddress,
        address _rootTunnelAddress)
    external onlyAdminOrOwner
    {
        gp = IGP(_gpAddress);
        wnd = IWnDRoot(_wndAddress);
        sacrificialAlter = ISacrificialAlter(_sacrificialAlterAddress);
        consumables = IConsumables(_consumablesAddress);
        rootTunnel = IRootTunnel(_rootTunnelAddress);
    }

    modifier contractsAreSet() {
        require(address(gp) != address(0)
            && address(wnd) != address(0)
            && address(sacrificialAlter) != address(0)
            && address(rootTunnel) != address(0)
            && address(consumables) != address(0), "Contracts aren't set");

        _;
    }
}