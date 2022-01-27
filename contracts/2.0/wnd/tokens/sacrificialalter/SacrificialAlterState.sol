// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "../../../shared/tokens/ERC1155OnChainBaseUpgradeable.sol";
import "../../../shared/AdminableUpgradeable.sol";
import "../../../shared/Base64ableUpgradeable.sol";
import "../gp/IGP.sol";

abstract contract SacrificialAlterState is Initializable, AdminableUpgradeable, Base64ableUpgradeable, ERC1155OnChainBaseUpgradeable {

    struct TypeInfo {
        uint16 mints;
        uint16 burns;
        uint16 maxSupply;
        uint256 gpExchangeAmt;
    }

    mapping(uint256 => TypeInfo) internal typeInfo;

    // reference to the $GP contract for minting $GP earnings
    IGP public gpToken;

    function __SacrificialAlterState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        Base64ableUpgradeable.__Base64able_init();
    }
}