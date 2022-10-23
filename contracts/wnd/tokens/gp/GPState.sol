// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../../../shared/AdminableUpgradeable.sol";

abstract contract GPState is Initializable, AdminableUpgradeable, ERC20Upgradeable {

    function __GPState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
    }
}