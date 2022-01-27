//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "../Adminable.sol";
import "./IRandomizerCL.sol";

// Single implementation of randomizer that uses CL for a random number. 1 Random number per commit.
// This is not an upgradeable contract as CL relies on the constructor.
contract RandomizerCL is IRandomizerCL, Adminable, VRFConsumerBase {

    mapping(bytes32 => uint256) internal requestIdToRandomness;

    bytes32 internal keyHash;
    uint256 internal fee;

    constructor(address _vrfCoordinator, address _linkToken, bytes32 _keyHash) VRFConsumerBase(_vrfCoordinator, _linkToken) {
        keyHash = _keyHash;
        fee = 0.0001 * 10**18;
    }

    function setKeyHashAndFee(uint256 _fee, bytes32 _keyHash) external onlyAdminOrOwner {
        fee = _fee;
        keyHash = _keyHash;
    }

    function getRandomNumber() external onlyAdminOrOwner returns(bytes32) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
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