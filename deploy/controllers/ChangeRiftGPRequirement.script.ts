import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber } from 'ethers';
const CSV = require("comma-separated-values");
const fsPromises = require("fs/promises");

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { deployments, network } = hre;
    const { deploy, read, execute, getOrNull } = deployments;
    const [deployer] = await hre.ethers.getSigners();

    let isUnitTests = network.name === "hardhat";
    let isTestNet = network.name === "arbitrumtestnet"
        || network.name === "arbitrum-rinkeby"
        || network.name === "goerli"
        || network.name === "mumbai";
    let forceSetContracts = false;

    let tokenId: number = 35090;

    await main();

    async function main() {
        if(network.name !== 'mainnet') {
            console.log("wrong network. only mainnet");
            return;
        }
        const isTest = false;

        console.log(`Setting rift settings and unpausing`);

        const riftRoot = getOrNull('RiftRoot');
        if(riftRoot == undefined) {
            return;
        }

        const realStakedGpRequirement = hre.ethers.utils.parseEther("42069696.9");
        const lockStakeRequirement = hre.ethers.utils.parseEther("1000000000");
        const testStakedRequirement = 0;

        await execute(
            'RiftRoot',
            { from: deployer.address, log: true },
            `updateStakeSettings`,
            realStakedGpRequirement
            // isTest ? testStakedRequirement : realStakedGpRequirement
        );

        // await execute(
        //     'RiftRoot',
        //     { from: deployer.address, log: true },
        //     `setPause`,
        //     !isTest
        // );
    }
};

export default func;
func.tags = ['wnd-mainnet-test-rift'];
