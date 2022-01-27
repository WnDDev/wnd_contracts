// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "../../shared/AdminableUpgradeable.sol";
import "./ITrainingGame.sol";
import "../../shared/Adminable.sol";
import "../../shared/randomizercl/IRandomizerCL.sol";
import "../world/IWorld.sol";
import "../rift/IRift.sol";
import "../tokens/sacrificialalter/ISacrificialAlter.sol";
import "../tokens/consumables/IConsumables.sol";
import "../tokens/gp/IGP.sol";
import "../tokens/wnd/IWnD.sol";
import "../trainingproficiency/ITrainingProficiency.sol";

abstract contract TrainingGameState is Initializable, AdminableUpgradeable {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    event TrainingStarted(address indexed _owner, uint256 indexed _tokenId, bytes32 indexed _requestId);
    event WizardBurnt(address indexed _owner, uint256 indexed _tokenId);
    event RewardMinted(address indexed _owner, uint256 indexed _tokenId, uint256 indexed _rewardId, uint256 _amount, uint256 _gpAmt);

    struct RewardMultiplier {
        // 9 possibilities for training proficiency... 0, 1... 8+
        uint16[9] min;
        uint16[9] max;
    }

    struct TokenTrainingInfo {
        bytes32 requestId;
        uint64 timeNextPlay;
        uint8 gamesPlayed;
    }

    IWorld public world;
    ISacrificialAlter public sacrificialAlter;
    IConsumables public consumables;
    IGP public gp;
    IWnD public wnd;
    ITrainingProficiency public trainingProficiency;
    IRandomizerCL public randomizer;
    IRift public rift;

    uint256 public ODDS_TOTAL;

    EnumerableSetUpgradeable.UintSet internal rewardIds;
    mapping(uint256 => uint32) internal rewardIdToOdds;
    mapping(uint256 => RewardMultiplier) internal rewardIdToMultiplier;

    EnumerableSetUpgradeable.UintSet internal gpAmts;
    mapping(uint256 => uint32) internal gpAmtsToOdds;


    mapping(uint256 => TokenTrainingInfo) internal tokenIdToInfo;
    // array index is proficiency, and value at index is the number of games needed for that proficiency level.
    // Ex. proficiencyToGamesPlayed[1] = 6 means you get level 1 proficiency at 6 games.
    uint8[] internal proficiencyToGamesPlayed;
    uint256 public gameCooldownTime;

    EnumerableSetUpgradeable.UintSet internal burntWizards;

    uint256 public trainingFee;

    // The base chance, before training proficiency, that the wizard is burnt.
    uint8 public baseChanceWizardBurned;

    // The maximum the proficiency can reduce the chance of burning.
    uint8 public maxBurnReduction;

    function __TrainingGameState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        ODDS_TOTAL = 100000;
        gameCooldownTime = 1 days;
        trainingFee = 12000 ether;
        // 10% base chance of being burned in training
        baseChanceWizardBurned = 10;
        // 8% max burn reduction from training proficiency
        maxBurnReduction = 8;
        proficiencyToGamesPlayed = [0, 6, 8, 10, 12, 14, 16, 18, 20];
    }
}