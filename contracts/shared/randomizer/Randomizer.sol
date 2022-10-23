//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "../AdminableUpgradeable.sol";
import "./IRandomizer.sol";
import "./RandomizerState.sol";

// Single implementation of randomizer that uses CL for a random number. 1 Random number per commit.
// This is not an upgradeable contract as CL relies on the constructor.
contract Randomizer is IRandomizer, RandomizerState {

    function initialize() external initializer {
        RandomizerState.__RandomizerState_init();
    }

    function setNumBlocksAfterIncrement(uint8 _numBlocksAfterIncrement) external override onlyAdminOrOwner {
        numBlocksAfterIncrement = _numBlocksAfterIncrement;
    }

    function incrementCommitId() external override onlyAdminOrOwner {
        require(pendingCommits > 0, "No pending requests");
        commitId++;
        lastIncrementBlockNum = block.number;
        pendingCommits = 0;
    }

    function addRandomForCommit(uint256 _seed) external override onlyAdminOrOwner {
        require(block.number >= lastIncrementBlockNum + numBlocksAfterIncrement, "No random on same block");
        require(commitId > nextCommitIdToSeed, "Commit id must be higher");

        commitIdToRandomSeed[nextCommitIdToSeed] = _seed;
        nextCommitIdToSeed++;
    }

    function requestRandomNumber() external override onlyAdminOrOwner returns(uint256) {
        uint256 _requestId = requestIdCur;

        requestIdToCommitId[_requestId] = commitId;

        requestIdCur++;
        pendingCommits++;

        return _requestId;
    }

    function revealRandomNumber(uint256 _requestId) external view override onlyAdminOrOwner returns(uint256) {
        uint256 _commitIdForRequest = requestIdToCommitId[_requestId];
        require(_commitIdForRequest > 0, "Bad request ID");

        uint256 _randomSeed = commitIdToRandomSeed[_commitIdForRequest];
        require(_randomSeed > 0, "Random seed not set");

        // Combine the seed with the request id so each request id on this commit has a different number
        uint256 randomNumber = uint256(keccak256(abi.encode(_randomSeed, _requestId)));

        return randomNumber;
    }

    function isRandomReady(uint256 _requestId) external view override returns(bool) {
        return commitIdToRandomSeed[requestIdToCommitId[_requestId]] != 0;
    }
}