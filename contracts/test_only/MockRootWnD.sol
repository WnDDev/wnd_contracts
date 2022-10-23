//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../wnd/tokens/wnd/IWnD.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MockRootWnD is ERC721Enumerable {

    constructor() ERC721("WnD", "WnD") {

    }

    function mint(address _to, uint256 _tokenId) public {
        _mint(_to, _tokenId);
    }

    function getTokenTraits(uint256) external pure returns(WizardDragon memory) {
        return WizardDragon(true, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

}