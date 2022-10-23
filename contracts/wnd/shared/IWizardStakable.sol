// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWizardStakable {
    function startStake(uint256 _tokenId, address _owner) external;
    function finishStake(uint256 _tokenId) external;

    function startUnstake(uint256 _tokenId) external;
    function finishUnstake(uint256 _tokenId) external;
}