//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Mock1155 is ERC1155 {

    constructor() ERC1155("") {
        
    }

    function mint(address _account, uint256 _id, uint256 _amount, bytes calldata _data) external {
        _mint(_account, _id, _amount, _data);
    }
}