// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../../shared/AdminableUpgradeable.sol";

contract RandomizerState is Initializable, AdminableUpgradeable {

    // RandomIds that are a part of this commit.
    mapping(uint256 => uint256) internal commitIdToRandomSeed;
    mapping(uint256 => uint256) internal requestIdToCommitId;

    uint256 public lastIncrementBlockNum;
    uint256 public commitId;
    uint256 public requestIdCur;
    uint256 public nextCommitIdToSeed;
    uint256 public pendingCommits;
    uint8 public numBlocksAfterIncrement;

    function __RandomizerState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();

        numBlocksAfterIncrement = 1;
        requestIdCur = 1;
        nextCommitIdToSeed = 1;
        commitId = 1;
    }
}