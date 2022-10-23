// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDragonStakable {
    function stake(uint256 _tokenId, address _owner) external;
    // doTransfer handles whether or not the NFT should change wallet owners
    // Set to false when 'moving locations' without having to transfer the NFT twice.
    function unstake(uint256 _tokenId, bool doTransfer) external;
}