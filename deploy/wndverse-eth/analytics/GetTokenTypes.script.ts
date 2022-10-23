import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber, Contract } from 'ethers';
import { V1Contracts } from "../../utils/V1Contracts";
import { FileLocations } from '../../utils/FileLocations';
const CSV = require("comma-separated-values");
const fsPromises = require("fs/promises");
const fs = require('fs')  

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { deployments, network } = hre;
    const { deploy, read, execute, getOrNull } = deployments;
    const [deployer] = await hre.ethers.getSigners();

    let isUnitTests = network.name === "hardhat";
    let isTestNet = network.name === "arbitrumtestnet"
        || network.name === "arbitrum-rinkeby"
        || network.name === "goerli"
        || network.name === "mumbai";

    await main();

    async function main() {

        console.log("Calling get-early-trained-wizards");

        // Only eth networks
        if(network.name !== 'mainnet' && network.name !== 'goerli') {
            return;
        }
        
        const startBlock = 13717993; // block WnD token was deployed
        const endBlock = 13850857; // Block of the last mined mint transaction (token 46819)
        await cacheMintEventsIfNeeded(startBlock, endBlock);

        await generateTokenTypeList();

    }

    async function generateTokenTypeList() {

        const allEventsBuffer: any[] = await fsPromises.readFile(FileLocations.CACHED_TOKEN_MINTING_EVENTS);
        const allEvents: any[] = JSON.parse(allEventsBuffer.toString());

        allEvents.sort(function(a, b){
            if(a.blockNumber == b.blockNumber) {
                return a.transactionIndex - b.transactionIndex;
            }
            return a.blockNumber - b.blockNumber;
        });

        const tokenTypesMap: Map<number, boolean> = new Map();

        for (let i = 0; i < allEvents.length; i++) {
            const event: any = allEvents[i];
            let tokenId = BigNumber.from(event.args[0]).toNumber();
            if(event.event == "WizardMinted") {
                tokenTypesMap.set(tokenId, true);
            }
            else if(event.event == "DragonMinted") {
                tokenTypesMap.set(tokenId, false);
            }
        }

        const tokenTypes: {
            tokenId: number,
            isWizard: boolean,
        }[] = [];

        tokenTypesMap.forEach((_value, key) => {
            tokenTypes.push({
                tokenId: key,
                isWizard: _value,
            });
        })

        console.log(`Num tokens found: ${tokenTypes.length}`);

        await fsPromises.writeFile(FileLocations.CACHED_TOKEN_TYPES, JSON.stringify(tokenTypes, null, 3));
    }

    async function cacheMintEventsIfNeeded(startBlock: number, endBlock: number) {
        let eventsCache: any[] = [];
        if(fs.existsSync(FileLocations.CACHED_TOKEN_MINTING_EVENTS)) {
            const eventsBuffer = await fsPromises.readFile(FileLocations.CACHED_TOKEN_MINTING_EVENTS);
            eventsCache = JSON.parse(eventsBuffer.toString());
            //Assume cache was sorted before saving
            startBlock = eventsCache[eventsCache.length-1].blockNumber
        }

        const wndTokenContract = await V1Contracts.getWnDContract(hre);

        let counter = 0;
        for(let i = startBlock; i < endBlock; i += 2000) {
            const _startBlock = i;
            const _endBlock = Math.min(endBlock, i + 1999);
            const wizardsMinted = await wndTokenContract.queryFilter(wndTokenContract.filters.WizardMinted(), _startBlock, _endBlock);
            const dragonsMinted = await wndTokenContract.queryFilter(wndTokenContract.filters.DragonMinted(), _startBlock, _endBlock);
            eventsCache = [...eventsCache, ...wizardsMinted, ...dragonsMinted];

            counter++;
            if(counter % 10 == 0) {
                await fsPromises.writeFile(FileLocations.CACHED_TOKEN_MINTING_EVENTS, JSON.stringify(eventsCache));
                console.log(`blocks ${_endBlock} out of ${endBlock} done...`);
                console.log("num events found: " + eventsCache.length);
            }
        }

        // store in file so we don't need to pull this d
        eventsCache.sort(function(a, b){
            if(a.blockNumber == b.blockNumber) {
                return a.transactionIndex - b.transactionIndex;
            }
            return a.blockNumber - b.blockNumber;
        });

        await fsPromises.writeFile(FileLocations.CACHED_TOKEN_MINTING_EVENTS, JSON.stringify(eventsCache));
    }
};

export default func;
func.tags = ['get-token-types'];