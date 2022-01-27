// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./IGraveyard.sol";
import "./GraveyardContracts.sol";

contract Graveyard is Initializable, GraveyardContracts {

    function initialize() public initializer {
        GraveyardContracts.__GraveyardContracts_init();
    }

    function killWizard(uint256 _tokenId) external override onlyAdminOrOwner {
        // change state
        // assume calling origin is the owner. This should be validated by the caller of this function.
        tokenIdToInfo[_tokenId] = TokenInfo(tx.origin, true);

        // transfer after state change
        wnd.transferFrom(tx.origin, address(this), _tokenId);
    }
    
    function reviveWizard(uint256 _tokenId) external override onlyAdminOrOwner {

    }
    
    function getFallenWizardsForAddr(address _address) external view override returns(uint256[] memory) {
        uint256[] memory retVal;
        return retVal;
    }
}