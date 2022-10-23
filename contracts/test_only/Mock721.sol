//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Mock721 is ERC721 {

    constructor() ERC721("MyMock", "$MOCK") {
        
    }

    function safeMint(address _to, uint256 _tokenId) external {
        _safeMint(_to, _tokenId);
    }
}