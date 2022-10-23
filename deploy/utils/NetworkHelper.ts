import { Contract } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export module NetworkHelper {

    export function isTestNet(network: {name: string} | undefined): boolean {
        return network !== undefined && (network.name === "arbitrumtestnet"
        || network.name === "arbitrum-rinkeby"
        || network.name === "goerli"
        || network.name === "mumbai");
    }

    export function isUnitTests(network: {name: string} | undefined): boolean {
        return network === undefined || network.name === "hardhat";
    }

    export function isAnyMainnet(network: {name: string} | undefined): boolean {
        return network !== undefined && (network.name === "mainnet" || network.name === "polygon");
    }

    export function isEthMainnet(network: {name: string} | undefined): boolean {
        return network !== undefined && (network.name === "mainnet");
    }

    export function isPolyMainnet(network: {name: string} | undefined): boolean {
        return network !== undefined && (network.name === "polygon");
    }

}