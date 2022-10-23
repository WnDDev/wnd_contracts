// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../wnd/riftroot/IOldTrainingGrounds.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract MockOldTrainingGrounds is IOldTrainingGrounds, ERC721Holder {

    mapping(uint256 => address) private tokenToAtTG;

    function ownsToken(uint256 tokenId) external view override returns (bool) {
        return tx.origin == tokenToAtTG[tokenId];
    }

    function setTokenAtTG(uint256 _tokenId, address _originalOwner) external {
        tokenToAtTG[_tokenId] = _originalOwner;
    }
}