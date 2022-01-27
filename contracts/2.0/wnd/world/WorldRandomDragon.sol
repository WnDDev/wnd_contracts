// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./WorldStorage.sol";

abstract contract WorldRandomDragon is WorldStorage {

    function __WorldRandomDragon_init() internal initializer {
        WorldStorage.__WorldStorage_init();
    }

    function setDragonBonus(uint256 _dragonBonusForSameLocation) external onlyAdminOrOwner {
        require(_dragonBonusForSameLocation >= 0 && _dragonBonusForSameLocation <= 100, "Bad dragon bonus");
        dragonBonusForSameLocation = _dragonBonusForSameLocation;
    }

    function getRandomDragonOwner(uint256 _randomSeed, Location _locationOfEvent) external view override returns(address) {
        if(totalRankStaked == 0) {
            return address(0x0);
        }
        uint256 bucket = _randomSeed % totalRankStaked; // choose a value from 0 to total rank staked
        uint256 cumulative;
        _randomSeed >>= 32; // shuffle seed for new random
        uint256 rankPicked;
        // loop through each bucket of Dragons with the same rank score
        for (uint i = 5; i <= 8; i++) {
            cumulative += numberOfDragonsStakedAtRank(i) * rankToPoints[i];
            // if the value is not inside of that bucket, keep going
            if (bucket >= cumulative) {
                continue;
            }
            rankPicked = i;
            break;
        }
        if(rankPicked == 0) {
            return address(0);
        }
        // Guaranteed to have a dragon in at least 1 location because we found a rank above.

        uint256 _dragonsAtTG = numberOfDragonsStakedAtLocationAtRank(Location.TRAINING_GROUNDS, rankPicked);
        uint256 _dragonsAtRift = numberOfDragonsStakedAtLocationAtRank(Location.RIFT, rankPicked);

        // Assign bonus allocation points to dragons staked in the event's location. This allows for these dragons to have a higher chance of being selected over dragons NOT in this area.
        // We will use the same logic as above, cumulative point selection to determine the bucket to choose from.

        // Math is not at risk of overflowing because there are only 4000 dragons and the allocation points are small.
        uint256 _rangePerTGDragon = (100 + (_locationOfEvent == Location.TRAINING_GROUNDS ? dragonBonusForSameLocation : 0));
        uint256 _dragonsAtTGRange = _dragonsAtTG * _rangePerTGDragon;

        uint256 _rangePerRiftDragon = (100 + (_locationOfEvent == Location.RIFT ? dragonBonusForSameLocation : 0));
        uint256 _dragonsAtRiftRange = _dragonsAtRift * _rangePerRiftDragon;

        uint256 _totalRange = _dragonsAtTGRange + _dragonsAtRiftRange;

        uint256 _numberInRange = _randomSeed % _totalRange;

        uint256 _chosenDragonId;
        if(_numberInRange < _dragonsAtTGRange) {
            // One of the TG dragons got it. Use integer division to figure out WHICH dragon got it.
            uint256 _indexOfChosenDragon = _numberInRange / _rangePerTGDragon;
            _chosenDragonId = dragonAtLocationAtRankAtIndex(Location.TRAINING_GROUNDS, rankPicked, _indexOfChosenDragon);
        } else if(_numberInRange < _dragonsAtTGRange + _dragonsAtRiftRange) {
            uint256 _indexOfChosenDragon = _numberInRange / _rangePerRiftDragon;
            _chosenDragonId = dragonAtLocationAtRankAtIndex(Location.RIFT, rankPicked, _indexOfChosenDragon);
        } else {
            revert("Not possible currently.");
        }

        return ownerOfTokenId(_chosenDragonId);
    }
}