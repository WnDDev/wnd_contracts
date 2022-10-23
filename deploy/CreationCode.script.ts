import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
const fsPromises = require("fs/promises");
const fs = require('fs')  

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { deployments, network } = hre;
    const { deploy, deterministic, read, execute, getOrNull } = deployments;
    const [deployer] = await hre.ethers.getSigners();

    let isUnitTests = network.name === "hardhat";
    let isTestNet = network.name === "arbitrumtestnet"
        || network.name === "arbitrum-rinkeby"
        || network.name === "goerli"
        || network.name === "mumbai";

    await main();

    async function main() {
        console.log(`Running creationcode`)
        // Only local
        if(!isUnitTests) {
            return;
        }
        await deploy('CreationCodeTest', { from: deployer.address });
        await deploy('PrecomputeContractAddress', { from: deployer.address });

        const salt = '0xa85aee41fe40576e3d5f2d25d9645f2f38c0079c05865997d88db47c029f4017';

        const ownableImpl = await deploy('OwnershipUpgradeable', {
            from: deployer.address,
            log: true
        })
        const empty = await deploy('Empty', {
            from: deployer.address,
            log: true
        })

        const admin = await deploy('ProxyAdmin', {
            from: deployer.address,
            log: true
        });

        const factory = await hre.ethers.getContractFactory('TransparentUpgradeableProxy1', deployer);
        const data = factory.getDeployTransaction([], ownableImpl.address, admin.address).data;

        await deploy('TransparentUpgradeableProxy1', { from: deployer.address, args: [[], ownableImpl.address, admin.address] });
        const emptyByt = await read('TransparentUpgradeableProxy1', 'byt');
        console.log(emptyByt);
        return;
        console.log(data);
        console.log(ownableImpl.address);
        console.log(admin.address);
        return;
        const formattedImpl = hre.ethers.utils.hexZeroPad(ownableImpl.address, 32);
        const formattedAdmin = hre.ethers.utils.hexZeroPad(admin.address, 32);
        const formattedEmptyByte = hre.ethers.utils.hexZeroPad([], 32);
        const formattedTest = hre.ethers.utils.hexZeroPad('0x60', 32);
        const bytes = await read('CreationCodeTest', 'getCreationCode');
        const packedConstructorArgs = hre.ethers.utils.solidityPack(['address', 'address', 'bytes'], [ownableImpl.address, admin.address, [] ]);
        const bytes2 = hre.ethers.utils.solidityPack(['bytes', 'bytes'], [bytes, packedConstructorArgs]);

        const bytecode = hre.ethers.utils.hexlify(hre.ethers.utils.concat([
            bytes,
            factory.interface.encodeDeploy([ownableImpl.address, admin.address, []])
        ]));
        const bytecode2 = hre.ethers.utils.hexlify(`${bytes}${formattedImpl.slice(2)}${formattedAdmin.slice(2)}${formattedEmptyByte.slice(2)}`);

        console.log(ownableImpl.address, ' ', admin.address);
        // await execute('PrecomputeContractAddress',
        //     {
        //         from: deployer.address,
        //         log: true,
        //         gasLimit: 30000000
        //     },
        //     'deployBytecode',
        //     salt, bytecode
        // );
        await execute('PrecomputeContractAddress',
            {
                from: deployer.address,
                log: true,
                gasLimit: 30000000
            },
            'deployParams',
            salt, empty.address, admin.address
        );
        const deployedAddress = await read('PrecomputeContractAddress', 'getDeployedAddress');
        console.log(`The actual deployed address is: ${deployedAddress}`);

        // const deterministicDeploy = await deterministic('TransparentUpgradeableProxy', {
        //     from: deployer.address,
        //     salt: salt,
        //     args: [ ownableImpl.address, admin.address, [] ],
        // })
        // console.log(`The calculated address is: ${deterministicDeploy.address}`);

        // const res = await deterministicDeploy.deploy();
        // console.log(`The actual deployed address is: ${res.address}`);

        // console.log(`${await read('OwnershipUpgradeable', 'owner')}`);
    }
};

export default func;
func.tags = ['creationcode'];
