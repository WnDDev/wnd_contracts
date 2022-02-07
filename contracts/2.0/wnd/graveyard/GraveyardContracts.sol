// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./IGraveyard.sol";
import "./GraveyardState.sol";

abstract contract GraveyardContracts is Initializable, IGraveyard, GraveyardState {

    function __GraveyardContracts_init() internal initializer {
        GraveyardState.__GraveyardState_init();
    }

    function setContracts(
        address _wndAddress,
        address _consumablesAddress,
        address _worldAddress)
    external
    onlyAdminOrOwner
    {
        wnd = IWnD(_wndAddress);
        consumables = IConsumables(_consumablesAddress);
        world = IWorld(_worldAddress);
    }

    modifier contractsAreSet() {
        require(address(wnd) != address(0)
            && address(consumables) != address(0)
            && address(world) != address(0), "Contracts not set");

        _;
    }
}