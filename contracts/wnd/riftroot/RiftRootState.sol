//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";

import "../../shared/randomizer/IRandomizer.sol";
import "../../shared/AdminableUpgradeable.sol";
import "../tokens/gp/IGP.sol";
import "../tokens/wnd/IWnD.sol";
import "../tokens/sacrificialalter/ISacrificialAlter.sol";
import "../tokens/consumables/IConsumables.sol";
import "../tunnels/IMessageHandler.sol";
import "../tunnels/IRootTunnel.sol";
import "./IRiftRoot.sol";
import "./IOldTrainingGrounds.sol";

abstract contract RiftRootState is Initializable, IRiftRoot, IMessageHandler, ERC721HolderUpgradeable, ERC1155HolderUpgradeable, AdminableUpgradeable {

    IGP public gp;
    IWnDRoot public wnd;
    ISacrificialAlter public sacrificialAlter;
    IConsumables public consumables;
    IRootTunnel public rootTunnel;
    IOldTrainingGrounds public oldTrainingGrounds;

    EnumerableSetUpgradeable.AddressSet internal addressesStaked;
    mapping(address => uint256) public addressToGPStaked;
    uint256 public amountNeededToOpenPortal;
    uint256 public amountCurrentlyStaked;

    function __RiftRootState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        ERC721HolderUpgradeable.__ERC721Holder_init();
        ERC1155HolderUpgradeable.__ERC1155Holder_init();

        amountNeededToOpenPortal = 42_000_000 ether;
    }
}