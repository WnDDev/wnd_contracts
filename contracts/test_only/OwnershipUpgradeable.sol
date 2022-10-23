// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract OwnershipUpgradeable is OwnableUpgradeable {
    function initialize() public initializer {
        __Ownable_init_unchained();
    }
}