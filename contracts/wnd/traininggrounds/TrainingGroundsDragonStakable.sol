// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./TrainingGroundsContracts.sol";
import "../world/IWorld.sol";

abstract contract TrainingGroundsDragonStakable is Initializable, TrainingGroundsContracts {

    function __TrainingGroundsDragonStakable_init() internal initializer {
        TrainingGroundsContracts.__TrainingGroundsContracts_init();
    }

    function stake(uint256 _tokenId, address _owner) external override onlyAdminOrOwner contractsAreSet {
        // Nothing needed except for adding the dragon to the world at the right location.
        // This will also transfer the token.
        world.addDragonToWorld(_tokenId, _owner, Location.TRAINING_GROUNDS);
    }

    function unstake(uint256 _tokenId, bool doTransfer) external override onlyAdminOrOwner contractsAreSet {
        // Nothing needed except for removing the dragon from the world and transferring it to the existing owner.
        // Adding the if statement in case future features are added that would change state regardless
        // of if a dragon is changing locations or going back to owner's wallet
        if(doTransfer) {
            address _owner = world.ownerOfTokenId(_tokenId);
            world.removeDragonFromWorld(_tokenId, _owner);
        }
    }
}