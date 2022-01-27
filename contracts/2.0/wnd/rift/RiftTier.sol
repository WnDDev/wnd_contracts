// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./IRift.sol";
import "./RiftGP.sol";

abstract contract RiftTier is Initializable, IRift, RiftGP {

    function __RiftTier_init() internal initializer {
        RiftGP.__RiftGP_init();
    }

    function getRiftTier(address _address) external view override returns(uint256) {
        uint256 _amt = addressToGPStaked[_address];
        for (uint256 i = 0; i < riftTierAmts.length; i++) {
            if(i < riftTierAmts.length - 1 && _amt > riftTierAmts[i+1]) {
                continue;
            }
            return i;
        }
        return 0;
    }

    function setRiftTiers(uint256[] calldata _tiers) external onlyAdminOrOwner {
        riftTierAmts = _tiers;
    }
}