// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRandomizerCL {
    // Returns a request ID for the random number. This should be kept and mapped to whatever the contract
    // is tracking randoms for.
    // Admin only.
    function getRandomNumber() external returns(bytes32);

    // Returns the random for the given request ID.
    // Will revert if the random is not ready.
    function randomForRequestID(bytes32 _requestID) external view returns(uint256);

    // Returns if the request ID has been fulfilled yet.
    function isRequestIDFulfilled(bytes32 _requestID) external view returns(bool);
}