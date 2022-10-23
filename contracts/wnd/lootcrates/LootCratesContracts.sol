// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./LootCratesState.sol";

abstract contract LootCratesContracts is Initializable, LootCratesState {

    function __LootCratesContracts_init() internal initializer {
        LootCratesState.__LootCratesState_init();
    }

    function setContracts(
        address _consumablesAddress)
    external
    onlyAdminOrOwner
    {
        consumables = IConsumables(_consumablesAddress);
    }

    modifier contractsAreSet() {
        require(areContractsSet(), "Rift: Contracts not set");

        _;
    }

    function areContractsSet() public view returns(bool) {
        return address(consumables) != address(0);
    }
}