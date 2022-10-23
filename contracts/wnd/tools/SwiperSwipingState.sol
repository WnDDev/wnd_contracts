//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

import "./ISwiperSwiping.sol";
import "../tokens/wnd/IWnD.sol";
import "../../shared/UtilitiesV2Upgradeable.sol";

abstract contract SwiperSwipingState is Initializable, ISwiperSwiping, UtilitiesV2Upgradeable {

    IWnDRoot public wnd;
    address public tower1Address;
    address public tower2Address;

    bytes32 public merkleRootTower1;
    bytes32 public merkleRootTower2;

    mapping(address => SwiperInfo) internal addressToClaimInfoTower1;
    mapping(address => SwiperInfo) internal addressToClaimInfoTower2;

    // Max number of tokens claimable from merkle in 1 tx
    uint8 public maxBatchSize;

    function __SwiperSwipingState_init() internal initializer {
        UtilitiesV2Upgradeable.__Utilities_init();
        maxBatchSize = 10;
    }
}

struct SwiperInfo {
    bool hasClaimedAll;
    EnumerableSetUpgradeable.UintSet tokenIdsClaimed;
}