//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Mock20 is ERC20 {

    constructor() ERC20("MyMock", "$MOCK") {
        
    }

    function mint(address _account, uint256 _amount) external {
        _mint(_account, _amount);
    }

    function burn(address _from, uint256 _amount) external {
        _burn(_from, _amount);
    }
}