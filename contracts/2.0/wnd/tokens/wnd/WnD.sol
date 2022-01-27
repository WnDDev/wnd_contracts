// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./IWnD.sol";
import "./WnDState.sol";

contract WnD is Initializable, IWnD, WnDState {

    function initialize() external initializer {
        ERC721Upgradeable.__ERC721_init("Wizards & Dragons Game", "WnD");
        WnDState.__WnDState_init();
    }

    /** CRITICAL TO SETUP / MODIFIERS */

    modifier requireContractsSet() {
        require(address(traits) != address(0), "Contracts not set");
        _;
    }

    function setContracts(address _traits) external onlyOwner {
        traits = ITraits(_traits);
    }

    /** EXTERNAL */

    /**
    * Mint a token - any payment / game logic should be handled in the game contract.
    * This will just generate random traits and mint a token to a designated address.
    */
    function mint(address _to, uint256 _tokenId, WizardDragon calldata _traits) external override whenNotPaused onlyAdminOrOwner {
        tokenTraits[_tokenId] = _traits;
        _safeMint(_to, _tokenId);
    }

    /**
    * Burn a token - any game logic should be handled before this function.
    */
    function burn(uint256 _tokenId) external override whenNotPaused onlyAdminOrOwner {
        _burn(_tokenId);
    }

    function adminTransferFrom(address _from, address _to, uint256 _tokenId) external override whenNotPaused onlyAdminOrOwner {
        _transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721Upgradeable, IERC721Upgradeable) onlyAdminOrOwner {
        _transfer(from, to, tokenId);
    }

    /** Lock down transfers for anything that isn't a game contract on L2.
    * You should only be able to play the game on L2, so any transfers should be from game logic.
    * This is crucial to ensure game state is preserved */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override onlyAdminOrOwner {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /** READ */

    /**
    * checks if a token is a Wizards
    * @param tokenId the ID of the token to check
    * @return wizard - whether or not a token is a Wizards
    */
    function isWizard(uint256 tokenId) external view override returns (bool) {
        return tokenTraits[tokenId].isWizard;
    }

    /** ADMIN */

    /**
    * enables owner to pause / unpause minting
    */
    function setPaused(bool _paused) external requireContractsSet onlyAdminOrOwner {
        if(_paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    /** Traits */

    function getTokenTraits(uint256 tokenId) external view override returns (WizardDragon memory) {
        return tokenTraits[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return traits.tokenURI(tokenId);
    }

    function exists(uint256 _tokenId) external view override returns(bool) {
        return _exists(_tokenId);
    }

    function ownerOf(uint256 _tokenId) public view override(ERC721Upgradeable, IERC721Upgradeable) returns(address) {
        return super.ownerOf(_tokenId);
    }

}