// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./WorldState.sol";
import "./IWorld.sol";
import "../rift/IRift.sol";
import "../traininggrounds/ITrainingGrounds.sol";
import "../tokens/wnd/IWnD.sol";

// Contains the storage for where dragons and wizards are and how many of them there are.
abstract contract WorldContracts is Initializable, IWorld, WorldState {

    function __WorldContracts_init() internal initializer {
        WorldState.__WorldState_init();
    }

    function setContracts(address _trainingGroundsAddress, address _wndAddress, address _riftAddress) external onlyAdminOrOwner {
        require(_trainingGroundsAddress != address(0)
            && _riftAddress != address(0)
            && _wndAddress != address(0), "Bad addresses");

        trainingGrounds = ITrainingGrounds(_trainingGroundsAddress);
        wnd = IWnD(_wndAddress);
        rift = IRift(_riftAddress);
    }

    modifier contractsAreSet() {
        require(areContractsSet(), "World: Contracts not set");

        _;
    }

    function areContractsSet() public view returns(bool) {
        return address(trainingGrounds) != address(0)
            && address(rift) != address(0)
            && address(wnd) != address(0);
    }
}