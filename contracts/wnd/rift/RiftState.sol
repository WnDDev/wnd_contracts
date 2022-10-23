// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";

import "../../shared/AdminableUpgradeable.sol";
import "../tunnels/IChildTunnel.sol";
import "../tunnels/IMessageHandler.sol";
import "../tokens/wnd/IWnD.sol";
import "../tokens/gp/IGP.sol";
import "../tokens/sacrificialalter/ISacrificialAlter.sol";
import "../tokens/consumables/IConsumables.sol";
import "../world/IWorld.sol";
import "../trainingproficiency/ITrainingProficiency.sol";
import "../../shared/randomizercl/IRandomizerCL.sol";

abstract contract RiftState is Initializable, IMessageHandler, ERC721HolderUpgradeable, ERC1155HolderUpgradeable, AdminableUpgradeable {

    event TokenWithdrawn(address indexed _owner, uint256 indexed _tokenId);
    event WizardStolen(address indexed _oldOwner, address indexed _newOwner, uint256 indexed _tokenId);
    event ChestStolen(address indexed _oldOwner, address indexed _newOwner, uint256 indexed _savedTokenId);

    IWnD public wnd;
    IWorld public world;
    ITrainingProficiency public trainingProficiency;
    IRandomizerCL public randomizer;
    IChildTunnel public childTunnel;
    IGP public gp;
    ISacrificialAlter public sacrificialAlter;
    IConsumables public consumables;

    mapping(bytes32 => uint256[]) public requestIdToTokens;
    mapping(address => bytes32[]) public recipientToRequestIDs;

    // Percent out of 100
    uint8 public chanceWizardStolen;

    // index is the riftTier, value is the minimum amt of $GP needed.
    uint256[] public riftTierAmts;
    uint256 public treasureChestId;

    EnumerableSetUpgradeable.AddressSet internal addressesStaked;
    mapping(address => uint256) public addressToGPStaked;
    uint256 public amountNeededToOpenPortal;
    uint256 public amountCurrentlyStaked;

    function __RiftState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        ERC721HolderUpgradeable.__ERC721Holder_init();
        ERC1155HolderUpgradeable.__ERC1155Holder_init();

        treasureChestId = 5;

        amountNeededToOpenPortal = 42069000 ether;

        chanceWizardStolen = 10;

        riftTierAmts = [0 ether, 100000 ether, 1000000 ether, 10000000 ether];
    }
}