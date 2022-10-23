// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../../shared/AdminableUpgradeable.sol";
import "./ILootCrates.sol";
import "../tokens/consumables/IConsumables.sol";

abstract contract LootCratesState is Initializable, ILootCrates, AdminableUpgradeable {

    error NoneToClaimError(address sender);
    error InvalidProofError(address sender, bytes32 leaf);

    event MerkleRootSet(uint256 indexed _tokenId, bytes32 indexed _merkleRoot);
    event CratesClaimed(address indexed _owner, uint256 indexed _tokenId, uint256 _amount);
    event WizardStolen(address indexed _oldOwner, address indexed _newOwner, uint256 indexed _tokenId);
    event ChestStolen(address indexed _oldOwner, address indexed _newOwner, uint256 indexed _savedTokenId);

    mapping(uint256 => bytes32) internal tokenIdToMerkle;
    mapping(address => bool) public accountToHasClaimed;

    IConsumables internal consumables;

    function __LootCratesState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
    }
}