// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../wnd/tunnels/IRootTunnel.sol";

contract MockRootTunnel is IRootTunnel {

    // Sends the bytes to the child (L2).
    // Admin only.
    function sendMessageToChild(bytes calldata _data) external override {

    }
}