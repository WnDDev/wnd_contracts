
   
//SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

interface IERC1155 {
    function balanceOf(address _owner, uint256 _id) external view returns (uint256);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
    function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external;
    function mintBatch(address to,uint256[] memory ids,uint256[] memory amounts) external;
}

interface IERC20 {
    function mint(address to, uint256 amount) external;
}

contract Disperse {
    function airdropConsumablesAndGP(IERC1155 consumables, IERC20 gp, address[] calldata recipients, uint256[] calldata ids, uint256[] calldata values, uint256 gpAmt) external {
        for (uint256 i = 0; i < recipients.length; i++) {
            gp.mint(recipients[i], gpAmt);
            consumables.mintBatch(recipients[i], ids, values);
        }
    }
}