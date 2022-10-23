// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../../shared/AdminableUpgradeable.sol";
import "./LootCratesContracts.sol";

abstract contract LootCratesSetup is Initializable, LootCratesContracts {

    function __LootCratesSetup_init() internal initializer {
        LootCratesContracts.__LootCratesContracts_init();
    }

    function setMerkleForCrate(uint256 _tokenId, bytes32 _merkleRoot) external onlyAdminOrOwner {
        tokenIdToMerkle[_tokenId] = _merkleRoot;
        emit MerkleRootSet(_tokenId, _merkleRoot);
    }
}