//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract PrecomputeContractAddress {

    address internal _deployedAddress;

    function deployBytecode(
        bytes32 salt,
        bytes memory bytecode
    ) external {
        _deployedAddress = Create2.deploy(0, salt, bytecode);
    }

    function deploy(
        bytes32 salt
    ) external {
        _deployedAddress = Create2.deploy(0, salt, type(TransparentUpgradeableProxy).creationCode);
    }

    function deployParams(
        bytes32 salt,
        address impl,
        address admin
    ) external {
        _deployedAddress = Create2.deploy(0, salt, abi.encodePacked(type(TransparentUpgradeableProxy).creationCode, abi.encode(impl, admin, new bytes(0))));
    }

    function getAddress(
        bytes32 salt,
        bytes32 bytecodeHash,
        address deployer
    ) pure external returns(address) {
        return Create2.computeAddress(salt, bytecodeHash, deployer);
    }

    function getDeployedAddress() view external returns(address) {
        return _deployedAddress;
    }
}