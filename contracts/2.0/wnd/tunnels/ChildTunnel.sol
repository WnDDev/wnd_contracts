// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@maticnetwork/fx-portal/contracts/tunnel/FxBaseChildTunnel.sol";

import "../../shared/Adminable.sol";
import "./IMessageHandler.sol";
import "./IChildTunnel.sol";

contract ChildTunnel is IChildTunnel, FxBaseChildTunnel, Adminable {

    IMessageHandler public messageHandler;

    constructor(
        address _fxChild
    ) FxBaseChildTunnel(_fxChild) {

    }

    function setMessageHandler(address _messageHandlerAddress) external onlyAdminOrOwner {
        messageHandler = IMessageHandler(_messageHandlerAddress);
    }

    function sendMessageToRoot(bytes calldata _message) external override onlyAdminOrOwner {
        require(address(messageHandler) != address(0), "Message handler not set");
        _sendMessageToRoot(_message);
    }

    function _processMessageFromRoot(
        uint256,
        address sender,
        bytes memory data
    ) internal override validateSender(sender) {
        messageHandler.handleMessage(data);
    }
}