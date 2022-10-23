//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../shared/randomizer/IRandomizer.sol";
import "./ITemplate.sol";
import "../shared/UtilitiesV2Upgradeable.sol";

abstract contract TemplateState is Initializable, ITemplate, UtilitiesV2Upgradeable {

    IRandomizer public randomizer;

    function __TemplateState_init() internal initializer {
        UtilitiesV2Upgradeable.__Utilities_init();
    }
}