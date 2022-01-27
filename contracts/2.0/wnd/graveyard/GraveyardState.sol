// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";

import "../../shared/AdminableUpgradeable.sol";
import "../tokens/wnd/IWnD.sol";
import "../tokens/consumables/IConsumables.sol";

contract GraveyardState is Initializable, ERC721HolderUpgradeable, AdminableUpgradeable {

    struct TokenInfo {
        address owner;
        bool isDead;
    }

    mapping(uint256 => TokenInfo) internal tokenIdToInfo;

    IWnD internal wnd;
    IConsumables internal consumables;

    function __GraveyardState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        ERC721HolderUpgradeable.__ERC721Holder_init();
    }
}