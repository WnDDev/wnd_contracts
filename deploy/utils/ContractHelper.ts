import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeploymentsExtension } from 'hardhat-deploy/types';
import { NetworkHelper } from "./NetworkHelper";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export module ContractHelper {
    let hre: HardhatRuntimeEnvironment;
    let forceSetContracts: boolean;
    let deployer: SignerWithAddress;
    let deployments: DeploymentsExtension;
    let network: { name: string };

    export async function setDeploymentConfig(config: DeploymentConfig) {
        hre = config.hre;
        ({ deployments, network } = config.hre);
        const [_deployer] = await config.hre.ethers.getSigners();
        deployer = _deployer;
        forceSetContracts = config.forceSetContracts;
    }

    // export async function unpauseContractIfNeeded(contract: string) {
    //     if(await deployments.read(contract, `paused`)) {
    //         await deployments.execute(
    //             contract,
    //             { from: deployer.address, log: true },
    //             `setPause`,
    //             false
    //         );
    //     }
    // }

    // export async function setContractsIfNeeded(contract: string, ...args: any[]) {
    //     if(forceSetContracts || !(await deployments.read(contract, `areContractsSet`))) {
    //         await deployments.execute(
    //             contract,
    //             { from: deployer.address, log: true },
    //             `setContracts`,
    //             ...args
    //         );
    //     }
    // }

    // async function setAdminsIfNeeded(contract: string, ...args: any[]) {
    //     var addressesToAdd = new Array<string>();

    //     for(var i = 0; i < args.length; i++) {
    //         let address = args[i];

    //         if(!(await deployments.read(contract, `isAdmin`, address))) {
    //             addressesToAdd.push(address);
    //         }
    //     }

    //     if(addressesToAdd.length > 0) {
    //         await deployments.execute(
    //             contract,
    //             { from: deployer.address, log: true },
    //             `addAdmins`,
    //             addressesToAdd
    //         );
    //     }
    // }

    // async function verifyContracts() {
    //     if(NetworkHelper.isUnitTests(network)) {
    //         return;
    //     }

    //     try {
    //         await hre.run("etherscan-verify");
    //     } catch(error) {
    //         console.log(`Error verifying: ${error}`);
    //     }
    // }

    // async function deployContract(name: string) : Promise<any> {
    //     return await deployments.deploy(name, {
    //         from: deployer.address,
    //         log: true,
    //         proxy: {
    //             owner: deployer.address,
    //             proxyContract: 'OpenZeppelinTransparentProxy',
    //             execute: {
    //                 init: {
    //                     methodName: "initialize",
    //                     args: []
    //                 }
    //             }
    //         },
    //     });
    // }

    // async function deployContractNonUpgradeable(name: string, ...args: any[]) : Promise<any> {
    //     const deploymentInfo = await deployments.getOrNull(name);
    //     if(deploymentInfo != null) {
    //         return deploymentInfo;
    //     }
    //     return await deployments.deploy(name, {
    //         from: deployer.address,
    //         log: true,
    //         args: args
    //     });
    // }

    interface DeploymentConfig {
        hre: HardhatRuntimeEnvironment;
        forceSetContracts: boolean;
    }
}