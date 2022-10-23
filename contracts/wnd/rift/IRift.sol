// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../shared/IDragonStakable.sol";

interface IRift is IDragonStakable {

    // Returns the rift tier for the given user based on how much GP is staked at the rift.
    function getRiftTier(address _address) external view returns(uint256);
}