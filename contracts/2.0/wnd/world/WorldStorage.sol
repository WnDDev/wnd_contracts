// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";

import "./WorldContracts.sol";

// Contains the storage for where dragons and wizards are and how many of them there are.
abstract contract WorldStorage is Initializable, WorldContracts {

    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    function __WorldStorage_init() internal initializer {
        WorldContracts.__WorldContracts_init();
    }

    function addWizardToWorld(uint256 _tokenId, address _owner, Location _location) external override onlyAdminOrOwner contractsAreSet {
        wizardIdSet.add(_tokenId);
        tokenIdToLocation[_tokenId] = _location;
        locationToWizardIdSet[_location].add(_tokenId);
        tokenIdToOwner[_tokenId] = _owner;

        wnd.adminTransferFrom(_owner, address(this), _tokenId);
    }

    function addDragonToWorld(uint256 _tokenId, address _owner, Location _location) external override onlyAdminOrOwner contractsAreSet {
        WizardDragon memory s = wnd.getTokenTraits(_tokenId);
        require(!s.isWizard, "Token not a dragon");
        totalRankStaked += rankToPoints[s.rankIndex];
        dragonIdSet.add(_tokenId);
        tokenIdToLocation[_tokenId] = _location;
        locationToRankToDragonIdSet[_location][s.rankIndex].add(_tokenId);
        tokenIdToOwner[_tokenId] = _owner;

        wnd.adminTransferFrom(_owner, address(this), _tokenId);
    }

    function removeWizardFromWorld(uint256 _tokenId, address _owner) external override onlyAdminOrOwner contractsAreSet {
        wizardIdSet.remove(_tokenId);
        Location _oldLocation = tokenIdToLocation[_tokenId];
        delete tokenIdToLocation[_tokenId];
        locationToWizardIdSet[_oldLocation].remove(_tokenId);
        delete tokenIdToOwner[_tokenId];

        wnd.adminTransferFrom(address(this), _owner, _tokenId);
    }

    function removeDragonFromWorld(uint256 _tokenId, address _owner) external override onlyAdminOrOwner contractsAreSet {
        WizardDragon memory s = wnd.getTokenTraits(_tokenId);
        require(!s.isWizard, "Token not a dragon");
        totalRankStaked -= rankToPoints[s.rankIndex];
        dragonIdSet.remove(_tokenId);
        Location _oldLocation = tokenIdToLocation[_tokenId];
        delete tokenIdToLocation[_tokenId];
        locationToRankToDragonIdSet[_oldLocation][s.rankIndex].remove(_tokenId);
        delete tokenIdToOwner[_tokenId];

        wnd.adminTransferFrom(address(this), _owner, _tokenId);
    }

    function changeLocationOfWizard(uint256 _tokenId, Location _location) external override onlyAdminOrOwner {
        require(wizardIdSet.contains(_tokenId), "Wizard not in world");
        Location _currentLocation = tokenIdToLocation[_tokenId];
        if(_currentLocation == _location) {
            return;
        }

        locationToWizardIdSet[_currentLocation].remove(_tokenId);
        locationToWizardIdSet[_location].add(_tokenId);
        tokenIdToLocation[_tokenId] = _location;
    }

    function totalNumberOfWizards() external view override returns(uint256) {
        return wizardIdSet.length();
    }

    function totalNumberOfDragons() public view override returns(uint256) {
        return dragonIdSet.length();
    }

    function locationOfToken(uint256 _tokenId) public view override returns(Location) {
        return tokenIdToLocation[_tokenId];
    }

    function setStakeableDragonLocations(Location[] calldata _locations) public override {
        stakeableDragonLocations = _locations;
    }

    function getStakeableDragonLocations() public view override returns(Location[] memory) {
        return stakeableDragonLocations;
    }

    function numberOfDragonsStakedAtRank(uint256 _rank) public view override returns(uint256 numStaked) {
        for (uint256 i = 0; i < stakeableDragonLocations.length; i++) {
            numStaked += locationToRankToDragonIdSet[stakeableDragonLocations[i]][_rank].length();
        }
    }

    function numberOfDragonsStakedAtLocationAtRank(Location _location, uint256 _rank) public view override returns(uint256) {
        return locationToRankToDragonIdSet[_location][_rank].length();
    }

    function numberOfWizardsStakedAtLocation(Location _location) public view override returns(uint256) {
        return locationToWizardIdSet[_location].length();
    }

    function dragonAtLocationAtRankAtIndex(Location _location, uint256 _rank, uint256 _index) public view override returns(uint256) {
        return locationToRankToDragonIdSet[_location][_rank].at(_index);
    }

    function wizardAtLocationAtIndex(Location _location, uint256 _index) public view override returns(uint256) {
        return locationToWizardIdSet[_location].at(_index);
    }

    function ownerOfTokenId(uint256 _tokenId) public view override returns(address) {
        return tokenIdToOwner[_tokenId];
    }

    function isOwnerOfTokenId(uint256 _tokenId, address _owner) public view override returns(bool) {
        return ownerOfTokenId(_tokenId) == _owner;
    }

    function isTokenInWorld(uint256 _tokenId) public view override returns(bool) {
        return tokenIdToOwner[_tokenId] != address(0);
    }

    /** This function is only here in case it is required to tweak the rankToPoints mapping for probability distribution on random dragon selection.
      * In the most perfect of worlds, this will never be called. If it does, it assumes that the _rankStaked parameter is calculated by new rankToPoints mappings for each dragon staked. */
    function setTotalRankStaked(uint256 _rankStaked) external onlyAdminOrOwner {
        totalRankStaked = _rankStaked;
    }
}