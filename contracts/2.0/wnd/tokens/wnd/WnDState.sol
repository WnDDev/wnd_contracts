// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "../../../shared/AdminableUpgradeable.sol";
import "./IWnD.sol";
import "../traits/ITraits.sol";

abstract contract WnDState is Initializable, AdminableUpgradeable, ERC721Upgradeable {

    // mapping from tokenId to a struct containing the token's traits
    mapping(uint256 => WizardDragon) internal tokenTraits;

    // reference to Traits
    ITraits public traits;

    function __WnDState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
    }
}