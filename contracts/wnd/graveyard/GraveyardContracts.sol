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
        address _worldAddress,
        address _trainingGameAddress)
    external
    onlyAdminOrOwner
    {
        wnd = IWnD(_wndAddress);
        consumables = IConsumables(_consumablesAddress);
        world = IWorld(_worldAddress);
        trainingGame = ITrainingGame(_trainingGameAddress);
    }

    modifier contractsAreSet() {
        require(areContractsSet(), "Graveyard: Contracts not set");

        _;
    }

    function areContractsSet() public view returns(bool) {
        return address(wnd) != address(0)
            && address(consumables) != address(0)
            && address(world) != address(0)
            && address(trainingGame) != address(0);
    }
}