import { deployments, ethers, network } from "hardhat";
import { ContractTransaction, BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export module Utilities {

    export async function changeAutomineEnabled(enabled: boolean) {
        await network.provider.send("evm_setAutomine", [enabled]);
    }

    export async function mine(...args: ContractTransaction[]) {
        await ethers.provider.send("evm_mine", []);
        for(var txn of args) {
            await txn.wait();
        }
    }

    export async function mineForward(forwardSeconds: number) {
        const now = await blockNow();
        await ethers.provider.send("evm_mine", [now.add(forwardSeconds).toNumber()]);
    }

    export async function currentBlockNumber() : Promise<number> {
        return await ethers.provider.getBlockNumber();
    }

    export async function blockNow() : Promise<BigNumber> {
        const blockNumber = await currentBlockNumber();
        const block = await ethers.provider.getBlock(blockNumber)
        return BigNumber.from(block.timestamp);
    }

    export async function getDeployedContract<T extends Contract>(name: string, deployer: SignerWithAddress) : Promise<T> {
        const deployment = await deployments.get(name);
        return new Contract(
            deployment.address,
            deployment.abi,
            deployer
        ) as T;
    }

}
