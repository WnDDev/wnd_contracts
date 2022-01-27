// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../../shared/AdminableUpgradeable.sol";
import "../tokens/wnd/IWnD.sol";
import "../tokens/gp/IGP.sol";
import "../tokens/sacrificialalter/ISacrificialAlter.sol";
import "../world/IWorld.sol";
import "../trainingproficiency/ITrainingProficiency.sol";
import "../traininggame/ITrainingGame.sol";
import "../../shared/randomizercl/IRandomizerCL.sol";

contract TrainingGroundsState is Initializable, AdminableUpgradeable {

    event WizardStakingStart(address indexed _owner, uint256 indexed _tokenId, bytes32 indexed _requestId);
    event WizardStakingFinish(address indexed _owner, uint256 indexed _tokenId);

    event WizardUnstakingStart(address indexed _owner, uint256 indexed _tokenId, bytes32 indexed _requestId);
    event WizardUnstakingFinish(address indexed _owner, uint256 indexed _tokenId);

    event WizardStolen(address indexed _oldOwner, address indexed _newOwner, uint256 indexed _tokenId);
    event ChestStolen(address indexed _oldOwner, address indexed _newOwner, uint256 indexed _savedTokenId);

    mapping(uint256 => uint256) public tokenIdToTimeStaked;
    uint256 public wizardStakingCost;
    // The chance of being stolen out of 100
    uint8 public chanceWizardStolen;
    uint256 public minTimeStaked;
    uint256 public treasureChestId;
    IWorld public world;
    ISacrificialAlter public sacrificialAlter;
    IGP public gp;
    ITrainingProficiency public trainingProficiency;
    ITrainingGame public trainingGame;
    IRandomizerCL public randomizer;

    // Holds the commit ids for random numbers when staking or unstaking.
    mapping(uint256 => bytes32) internal tokenIdToRequestId;

    function __TrainingGroundsState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();

        wizardStakingCost = 8000;
        chanceWizardStolen = 10;
        minTimeStaked = 2 days;
    }
}