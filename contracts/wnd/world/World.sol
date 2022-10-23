// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./WorldRandomDragon.sol";
import "./WorldRouter.sol";

contract World is Initializable, WorldRandomDragon, WorldRouter {

    function initialize() external initializer {
        WorldRandomDragon.__WorldRandomDragon_init();
        WorldRouter.__WorldRouter_init();
    }
}