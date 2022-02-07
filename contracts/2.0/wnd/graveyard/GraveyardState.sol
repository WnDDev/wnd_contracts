// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";

import "../../shared/AdminableUpgradeable.sol";
import "../tokens/wnd/IWnD.sol";
import "../tokens/consumables/IConsumables.sol";
import "../world/IWorld.sol";

contract GraveyardState is Initializable, ERC721HolderUpgradeable, AdminableUpgradeable {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    event WizardKilled(address indexed _owner, uint256 indexed _tokenId);
    event WizardRevived(address indexed _owner, uint256 indexed _tokenId);

    mapping(address => EnumerableSetUpgradeable.UintSet) internal ownerToKilledTokens;

    IWnD internal wnd;
    IConsumables internal consumables;
    IWorld internal world;
    uint256 internal phoenixDownTokenId;

    function __GraveyardState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        ERC721HolderUpgradeable.__ERC721Holder_init();
        phoenixDownTokenId = 4;
    }
}