// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";

import "../../shared/AdminableUpgradeable.sol";
import "../tokens/wnd/IWnD.sol";
import "../world/IWorld.sol";
import "../rift/IRift.sol";
import "../traininggrounds/ITrainingGrounds.sol";
import "../trainingproficiency/ITrainingProficiency.sol";
import "../../shared/randomizercl/IRandomizerCL.sol";

contract WorldState is Initializable, ERC721HolderUpgradeable, AdminableUpgradeable {

    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    EnumerableSetUpgradeable.UintSet internal dragonIdSet;
    EnumerableSetUpgradeable.UintSet internal wizardIdSet;
    mapping(uint256 => Location) internal tokenIdToLocation;
    mapping(uint256 => address) internal tokenIdToOwner;
    // Location enum -> rank -> id set
    mapping(Location => mapping(uint256 => EnumerableSetUpgradeable.UintSet)) internal locationToRankToDragonIdSet;
    mapping(Location => EnumerableSetUpgradeable.UintSet) internal locationToWizardIdSet;
    uint256 internal totalRankStaked;
    Location[] internal stakeableDragonLocations;
    // rank -> number of points to add the the total staked values for picking random dragons with.
    // This is needed to ensure a fair probability of selection is achieved per rank correlating with its rareness.
    mapping(uint256 => uint256) internal rankToPoints;

    ITrainingGrounds public trainingGrounds;
    IWnD public wnd;
    IRift public rift;

    // A number from 0-100 which is the bonus dragons staked at a given location receive.
    uint256 public dragonBonusForSameLocation;

    function __WorldState_init() internal initializer {
        AdminableUpgradeable.__Adminable_init();
        ERC721HolderUpgradeable.__ERC721Holder_init();

        dragonBonusForSameLocation = 15;
        stakeableDragonLocations = [Location.RIFT, Location.TRAINING_GROUNDS];
        rankToPoints[3] = 4;
        rankToPoints[2] = 7;
        rankToPoints[1] = 11;
        rankToPoints[0] = 20;
    }
}