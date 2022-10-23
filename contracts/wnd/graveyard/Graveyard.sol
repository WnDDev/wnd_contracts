// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./IGraveyard.sol";
import "./GraveyardContracts.sol";

contract Graveyard is Initializable, GraveyardContracts {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.UintSet;

    function initialize() public initializer {
        GraveyardContracts.__GraveyardContracts_init();
    }

    /** Transfer and mark the tokenId as killed. Owner validation must be handled outside of this contract.*/
    function killWizard(uint256 _tokenId, address _owner) external override onlyAdminOrOwner {
        // change state
        // assume calling origin is the owner. This should be validated by the caller of this function.
        // It must be validated by the caller because it could be staked into a contract instead of in the caller's wallet.
        ownerToKilledTokens[_owner].add(_tokenId);

        // transfer after state change
        // Gone from the world forever :'(
        world.removeWizardFromWorld(_tokenId, address(this));

        emit WizardKilled(_owner, _tokenId);
    }
    
    /** Revive a wizard by burning a phoenix down. Transfers revived asset to owner's wallet. */
    function reviveWizard(uint256 _tokenId) external override onlyEOA {
        _revive(_tokenId);
    }
    
    /** Revive a wizard by burning a phoenix down. Transfers revived asset to owner's wallet. */
    function reviveWizardBatch(uint256[] calldata _tokenIds) external override onlyEOA {
        require(_tokenIds.length > 0, "must give token ids to revive");
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _revive(_tokenIds[i]);
        }
    }

    function _revive(uint256 _tokenId) internal {
        require(ownerToKilledTokens[_msgSender()].contains(_tokenId), "Not dead or not owned by caller.");

        // Will revert if the caller does not have a phoenix down.
        consumables.burn(phoenixDownTokenId, 1, _msgSender());
        trainingGame.resetWizard(_tokenId);
        ownerToKilledTokens[_msgSender()].remove(_tokenId);

        // transfer after state change
        wnd.transferFrom(address(this), _msgSender(), _tokenId);

        emit WizardRevived(_msgSender(), _tokenId);
    }
    
    /** Do not call from other contracts as this could be gassy depending on the number of wizards who have died for this player. */
    function getFallenWizardsForAddr(address _address) external view override returns(uint256[] memory) {
        EnumerableSetUpgradeable.UintSet storage set = ownerToKilledTokens[_address];
        uint256[] memory tokenIds = new uint256[] (set.length());
        for (uint256 i = 0; i < set.length(); i++) {
            tokenIds[i] = set.at(i);
        }
        return tokenIds;
    }
}