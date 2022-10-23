//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./RiftState.sol";

abstract contract RiftGP is Initializable, RiftState {

    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

    function __RiftGP_init() internal initializer {
        RiftState.__RiftState_init();
    }

    function updateStakeSettings(uint256 _amountNeededToOpenPortal) external onlyAdminOrOwner {
        amountNeededToOpenPortal = _amountNeededToOpenPortal;
    }

    function stakeGP(uint256 _amount) external whenNotPaused {
        require(_amount > 0, "Must stake some GP.");
        amountCurrentlyStaked += _amount;
        addressToGPStaked[msg.sender] += _amount;

        if(!addressesStaked.contains(msg.sender)) {
            addressesStaked.add(msg.sender);
        }

        bool _wasTransferred = gp.transferFrom(msg.sender, address(this), _amount);
        require(_wasTransferred, "GP not transferred");
    }

    function unstakeGP(uint256 _amount) external whenNotPaused {
        uint256 _amountStaked = addressToGPStaked[msg.sender];
        require(_amountStaked >= _amount, "Too much GP to unstake");

        amountCurrentlyStaked -= _amount;
        addressToGPStaked[msg.sender] -= _amount;

        if(addressToGPStaked[msg.sender] == 0) {
            addressesStaked.remove(msg.sender);
        }

        bool _wasTransferred = gp.transfer(msg.sender, _amount);
        require(_wasTransferred, "GP not transferred");
    }

}