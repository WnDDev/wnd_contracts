//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./IRandomizerCL.sol";

contract MockRandomizerCL is IRandomizerCL {

    mapping(bytes32 => uint256) internal requestIdToRandomness;

    uint256 public commitId = 1;

    function getRandomNumber() external returns(bytes32) {
        uint256 _commitId = commitId;
        commitId++;
        return bytes32(_commitId);
    }

    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) external {
        requestIdToRandomness[_requestId] = _randomness;
    }

    function randomForRequestID(bytes32 _requestID) external view returns(uint256) {
        require(isRequestIDFulfilled(_requestID), "Not fulfilled");
        return requestIdToRandomness[_requestID];
    }

    function isRequestIDFulfilled(bytes32 _requestID) public view returns(bool) {
        return requestIdToRandomness[_requestID] != 0;
    }
}