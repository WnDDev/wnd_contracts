//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./TemplateContracts.sol";

contract Template is Initializable, TemplateContracts {

    function initialize() external initializer {
        TemplateContracts.__TemplateContracts_init();
    }
}