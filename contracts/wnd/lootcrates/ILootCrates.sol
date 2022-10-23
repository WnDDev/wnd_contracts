// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILootCrates {

    // Sends caller the amount of crates owed. Reverts if not owed any crates
    function claimBoxes(uint256 tokenId, uint256 amount, bytes32[] memory proof) external;
    // Opens the given number of boxes of the given type.
    function openBox(uint256 _tokenId, uint256 _amount) external;
}

struct ClaimInfo {
    bool hasClaimedAll;
    uint256 leftToClaim;
}