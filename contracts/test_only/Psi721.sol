// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "erc721psi/contracts/ERC721Psi.sol";

contract Psi721 is ERC721Psi {
    constructor() 
        ERC721Psi("Test", "TEST"){
    }

    function mint(uint256 quantity) external payable {
        // _safeMint's second argument now takes in a quantity, not a tokenId. (same as ERC721A)
        _safeMint(msg.sender, quantity);
    }
}