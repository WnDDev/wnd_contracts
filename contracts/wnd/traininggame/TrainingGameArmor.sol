// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./ITrainingGame.sol";
import "./TrainingGameTimeKeeper.sol";

abstract contract TrainingGameArmor is Initializable, TrainingGameTimeKeeper {

    function __TrainingGameArmor_init() internal initializer {
        TrainingGameTimeKeeper.__TrainingGameTimeKeeper_init();
    }

    function hasArmor(uint256 _tokenId) public view returns(bool) {
        return tokenIdToInfo[_tokenId].hasArmor;
    }

    function equipArmor(uint256 _tokenId, address _owner) internal {
        consumables.adminSafeTransferFrom(_owner, address(this), equipmentTokenId, 1);
        tokenIdToInfo[_tokenId].hasArmor = true;
    }

    function unequipArmor(uint256 _tokenId, address _owner) internal {
        require(tokenIdToInfo[_tokenId].hasArmor, "No armor equipped");
        consumables.adminSafeTransferFrom(address(this), _owner, equipmentTokenId, 1);
        tokenIdToInfo[_tokenId].hasArmor = false;
    }

    function burnArmor(uint256 _tokenId) internal {
        require(tokenIdToInfo[_tokenId].hasArmor, "No armor equipped");
        consumables.burn(equipmentTokenId, 1, address(this));
        tokenIdToInfo[_tokenId].hasArmor = false;
    }
}