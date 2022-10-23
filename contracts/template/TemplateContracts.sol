//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./TemplateState.sol";

abstract contract TemplateContracts is Initializable, TemplateState {

    function __TemplateContracts_init() internal initializer {
        TemplateState.__TemplateState_init();
    }

    function setContracts(
        address _randomizerAddress)
    external requiresEitherRole(ADMIN_ROLE, OWNER_ROLE)
    {
        randomizer = IRandomizer(_randomizerAddress);
    }

    modifier contractsAreSet() {
        require(areContractsSet(), "Contracts aren't set");
        _;
    }

    function areContractsSet() public view returns(bool) {
        return address(randomizer) != address(0);
    }
}