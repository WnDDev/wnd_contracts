// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGraveyard {
    // sends the given wizard tokenId to this contract to be considered 'dead'. Can be revived though, so that's cool.
    function killWizard(uint256 _tokenId) external;
    // attempts to bring the given dead wizard tokenId back to life and give to caller. This token must have been owned by the caller when it died.
    function reviveWizard(uint256 _tokenId) external;
    // Returns the rift tier for the given user based on how much GP is staked at the rift.
    function getFallenWizardsForAddr(address _address) external view returns(uint256[] memory);
}