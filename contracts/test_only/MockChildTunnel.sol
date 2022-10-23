// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../wnd/tunnels/IChildTunnel.sol";

contract MockChildTunnel is IChildTunnel {

    function sendMessageToRoot(bytes calldata _data) external override {

    }
}