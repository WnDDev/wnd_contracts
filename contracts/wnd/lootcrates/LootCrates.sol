// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "./LootCratesSetup.sol";

contract LootCrates is Initializable, LootCratesSetup {

    function initialize() external initializer {
        LootCratesSetup.__LootCratesSetup_init();
    }
    
    function claimBoxes(uint256 _tokenId, uint256 _amount, bytes32[] memory proof) external override onlyEOA {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _tokenId, _amount));
        if(!MerkleProof.verify(proof, tokenIdToMerkle[_tokenId], leaf)) {
            revert InvalidProofError({sender: msg.sender, leaf: leaf});
        }
        if(accountToHasClaimed[msg.sender]) {
            revert NoneToClaimError({sender: msg.sender});
        }

        accountToHasClaimed[msg.sender] = true;
        consumables.mint(_tokenId, _amount, msg.sender);

        emit CratesClaimed(msg.sender, _tokenId, _amount);
    }

    function openBox(uint256 _tokenId, uint256 _amount) external override onlyEOA {
        if(consumables.balanceOf(msg.sender, _tokenId) < _amount) {
            // revert InvalidProofError({sender: msg.sender, proof: hash});
        }
    }

}