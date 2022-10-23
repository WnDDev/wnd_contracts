// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "../../shared/AdminableUpgradeable.sol";
import "./ITrainingGame.sol";
import "../../shared/Adminable.sol";
import "../../shared/randomizercl/IRandomizerCL.sol";
import "../world/IWorld.sol";
import "../rift/IRift.sol";
import "../graveyard/IGraveyard.sol";
import "../tokens/sacrificialalter/ISacrificialAlter.sol";
import "../tokens/consumables/IConsumables.sol";
import "../tokens/gp/IGP.sol";
import "../tokens/wnd/IWnD.sol";
import "../trainingproficiency/ITrainingProficiency.sol";

abstract contract TrainingGameState is Initializable, ERC721HolderUpgradeable, ERC1155HolderUpgradeable, AdminableUpgradeable {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    event TrainingStarted(address indexed _owner, uint256 indexed _tokenId, bytes32 indexed _requestId);
    event RewardMinted(address indexed _owner, uint256 indexed _tokenId, uint256 indexed _rewardId, uint256 _amount, uint256 _gpAmt);

    struct RewardMultiplier {
        // 9 possibilities for training proficiency... 0, 1... 8+
        uint16[9] min;
        uint16[9] max;
    }

    struct TokenTrainingInfo {
        bytes32 requestId;
        uint64 timeNextPlay;
        uint32 gamesPlayed;
        uint8 hp;
        bool hasArmor;
    }

    IWorld public world;
    ISacrificialAlter public sacrificialAlter;
    IConsumables public consumables;
    IGP public gp;
    IWnD public wnd;
    ITrainingProficiency public trainingProficiency;
    IRandomizerCL public randomizer;
    IRift public rift;
    IGraveyard public graveyard;

    uint256 public ODDS_TOTAL;
    uint256 internal equipmentTokenId;

    EnumerableSetUpgradeable.UintSet internal rewardIds;
    mapping(uint256 => uint32) internal rewardIdToOdds;
    mapping(uint256 => RewardMultiplier) internal rewardIdToMultiplier;

    EnumerableSetUpgradeable.UintSet internal gpAmts;
    mapping(uint256 => uint32) internal gpAmtsToOdds;

    mapping(uint256 => TokenTrainingInfo) public tokenIdToInfo;
    // array index is proficiency, and value at index is the number of games needed for that proficiency level.
    // Ex. proficiencyToGamesPlayed[1] = 6 means you get level 1 proficiency at 6 games.
    uint8[] internal proficiencyToGamesPlayed;
    uint256 public gameCooldownTime;

    uint256 public trainingFee;

    // The base chance, before training proficiency, that the wizard is burnt.
    uint8 public baseChanceWizardBurned;

    // The maximum the proficiency can reduce the chance of burning.
    uint8 public maxBurnReduction;

    uint8 public damagePercentChance;

    uint8 public baseHP;

    uint8 public baseDamage;

    uint8 public armorDamageReductionAmt;

    uint8 public elixirOfHealingId;

    function __TrainingGameState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        ERC721HolderUpgradeable.__ERC721Holder_init();
        ERC1155HolderUpgradeable.__ERC1155Holder_init();

        ODDS_TOTAL = 100000;
        gameCooldownTime = 1 days;
        trainingFee = 12000 ether;
        // 10% base chance of being burned in training
        baseChanceWizardBurned = 10;
        // 8% max burn reduction from training proficiency
        maxBurnReduction = 8;
        proficiencyToGamesPlayed = [0, 6, 8, 10, 12, 14, 16, 18, 20];
        equipmentTokenId = 2;
        damagePercentChance = 50;
        baseHP = 7;
        baseDamage = 6;
        armorDamageReductionAmt = 3;
        elixirOfHealingId = 1;
    }
}