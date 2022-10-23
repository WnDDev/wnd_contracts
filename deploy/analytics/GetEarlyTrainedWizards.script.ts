import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber, Contract } from 'ethers';
import { V1Contracts } from "../utils/V1Contracts";
import { FileLocations } from '../utils/FileLocations';
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

        // Only Polygon networks
        if(network.name !== 'mumbai' && network.name !== 'polygon') {
            return;
        }
        
        const startBlock = 27926017; // block trainingGame was unpaused
        const endBlock = 28199664; // Last mined transaction on TrainingGame when looking on 05/11/2022
        await cacheTrainingLevelsIfNeeded(startBlock, endBlock);

        const mapLevelsToTokenInfo = await generateWizardLevelsWithBlockInfo();
        
        await fsPromises.writeFile(`./data/analytics/wizardLevels.json`, JSON.stringify(Object.fromEntries(mapLevelsToTokenInfo)));

        const listAtLevel = mapLevelsToTokenInfo.get(8) ?? [];
        console.log(`Number of level 8 wizards: ${listAtLevel.length}`);

        const atLevel = 8;
        const firstWizardsAtLevel = getFirstNOwnersForWizardsOfLevel(atLevel, 3, mapLevelsToTokenInfo);

        console.log();
        console.log(`First ${firstWizardsAtLevel.length} Level ${atLevel} owners:`);
        console.log(JSON.stringify(firstWizardsAtLevel, null, 2));

        const aboveLevel = 0;
        const firstWizardsAboveLevel = await getFirstNOwnersForWizardsAboveLevel(aboveLevel, 420, mapLevelsToTokenInfo);

        console.log();
        console.log(`First ${firstWizardsAboveLevel.length} Level ${aboveLevel + 1} or higher owners:`);
        // console.log(JSON.stringify(firstWizardsAboveLevel, null, 2));

    }

    async function getFirstNOwnersForWizardsAboveLevel(level: number, numAddresses: number, mapLevelsToTokenInfo: Map<number, TokenInfo[]>): Promise<string[]> {

        const eventsBuffer = await fsPromises.readFile(FileLocations.CACHED_WIZARD_TRAINING_EVENTS);
        let eventsCache: any[] = JSON.parse(eventsBuffer.toString());

        let tokenToGamesPlayed: Map<number, number> = new Map();
        let levelsToTokenIds: Map<number, TokenInfo[]> = new Map();

        let addresses: Set<string> = new Set();

        for (let i = 0; i < eventsCache.length; i++) {
            const event: any = eventsCache[i];
            let addr: string = event.args[0];
            let tokenId: number = BigNumber.from(event.args[1]).toNumber();
            let gamesPlayed = tokenToGamesPlayed.get(tokenId) ?? 0;
            let currentLevel = getLevelForGamesPlayed(gamesPlayed);
            if(event.event == "RewardMinted") {
                tokenToGamesPlayed.set(tokenId, ++gamesPlayed);
                const newLevel = getLevelForGamesPlayed(gamesPlayed);
                if(currentLevel < newLevel) {
                    addresses.add(addr);
                    // Gets the first unique number of addresses that ever leveled up to lv1 or higher.
                    if(addresses.size === numAddresses) {
                        // return [ ...addresses ];
                    }
                    // leveled up, remove from old set and add to new
                    let oldLevelSet = levelsToTokenIds.get(currentLevel) ?? [];
                    if(oldLevelSet.map(x => x.tokenId).includes(tokenId)) {
                        // remove token and save
                        oldLevelSet.splice(oldLevelSet.map(x => x.tokenId).indexOf(tokenId), 1);
                        levelsToTokenIds.set(currentLevel, oldLevelSet);
                    }
                    let newLevelSet = levelsToTokenIds.get(newLevel) ?? [];
                    newLevelSet.push({ tokenId, address: addr, blockNumber: event.blockNumber, transactionIndex: event.transactionIndex });
                    levelsToTokenIds.set(newLevel, newLevelSet);
                }
            }
            else if(event.event == "WizardKilled" ) {
                if(currentLevel > 0) {
                    let levelSet = levelsToTokenIds.get(currentLevel) ?? [];
                    if(levelSet.map(x => x.tokenId).includes(tokenId)) {
                        levelSet.splice(levelSet.map(x => x.tokenId).indexOf(tokenId), 1);
                        levelsToTokenIds.set(currentLevel, levelSet);
                    }
                }
                tokenToGamesPlayed.set(tokenId, 0);
            }
        }
        return [ ...addresses ];
    }

    function getFirstNOwnersForWizardsOfLevel(level: number, numAddresses: number, mapLevelsToTokenInfo: Map<number, TokenInfo[]>): string[] {
        const listAtLevel = mapLevelsToTokenInfo.get(level) ?? [];
        const addressesInOrder = listAtLevel.map(x => x.address);
        const dedupped = [ ...new Set(addressesInOrder) ];
        return dedupped.splice(0, numAddresses);
    }

    async function generateWizardLevelsWithBlockInfo(): Promise<Map<number, TokenInfo[]>> {
        const eventsBuffer = await fsPromises.readFile(FileLocations.CACHED_WIZARD_TRAINING_EVENTS);
        let eventsCache: any[] = JSON.parse(eventsBuffer.toString());

        let tokenToGamesPlayed: Map<number, number> = new Map();
        let levelsToTokenIds: Map<number, TokenInfo[]> = new Map();

        for (let i = 0; i < eventsCache.length; i++) {
            const event: any = eventsCache[i];
            let addr: string = event.args[0];
            let tokenId: number = BigNumber.from(event.args[1]).toNumber();
            let gamesPlayed = tokenToGamesPlayed.get(tokenId) ?? 0;
            let currentLevel = getLevelForGamesPlayed(gamesPlayed);
            if(event.event == "RewardMinted") {
                tokenToGamesPlayed.set(tokenId, ++gamesPlayed);
                const newLevel = getLevelForGamesPlayed(gamesPlayed);
                if(currentLevel < newLevel) {
                    // leveled up, remove from old set and add to new
                    let oldLevelSet = levelsToTokenIds.get(currentLevel) ?? [];
                    if(oldLevelSet.map(x => x.tokenId).includes(tokenId)) {
                        // remove token and save
                        oldLevelSet.splice(oldLevelSet.map(x => x.tokenId).indexOf(tokenId), 1);
                        levelsToTokenIds.set(currentLevel, oldLevelSet);
                    }
                    let newLevelSet = levelsToTokenIds.get(newLevel) ?? [];
                    newLevelSet.push({ tokenId, address: addr, blockNumber: event.blockNumber, transactionIndex: event.transactionIndex });
                    levelsToTokenIds.set(newLevel, newLevelSet);
                }
            }
            else if(event.event == "WizardKilled" ) {
                if(currentLevel == 8) {
                    console.log(`${addr}'s level 8 token ${tokenId} killed on round #${gamesPlayed}`);
                }
                if(currentLevel > 0) {
                    let levelSet = levelsToTokenIds.get(currentLevel) ?? [];
                    if(levelSet.map(x => x.tokenId).includes(tokenId)) {
                        levelSet.splice(levelSet.map(x => x.tokenId).indexOf(tokenId), 1);
                        levelsToTokenIds.set(currentLevel, levelSet);
                    }
                }
                tokenToGamesPlayed.set(tokenId, 0);
            }
        }
        return levelsToTokenIds;
    }

    function getLevelForGamesPlayed(gamesPlayed: number) {
        if(gamesPlayed >= 20) {
            return 8;
        }
        if(gamesPlayed >= 18) {
            return 7;
        }
        if(gamesPlayed >= 16) {
            return 6;
        }
        if(gamesPlayed >= 14) {
            return 5;
        }
        if(gamesPlayed >= 12) {
            return 4;
        }
        if(gamesPlayed >= 10) {
            return 3;
        }
        if(gamesPlayed >= 8) {
            return 2;
        }
        if(gamesPlayed >= 6) {
            return 1;
        }
        return 0;
    }

    async function cacheTrainingLevelsIfNeeded(startBlock: number, endBlock: number) {
        let eventsCache: any[] = [];
        if(fs.existsSync(FileLocations.CACHED_WIZARD_TRAINING_EVENTS)) {
            const eventsBuffer = await fsPromises.readFile(FileLocations.CACHED_WIZARD_TRAINING_EVENTS);
            eventsCache = JSON.parse(eventsBuffer.toString());
            //Assume cache was sorted before saving
            startBlock = eventsCache[eventsCache.length-1].blockNumber
        }

        const trainingGame = await hre.ethers.getContract('TrainingGame');
        const graveyard = await hre.ethers.getContract('Graveyard');

        let counter = 0;
        for(let i = startBlock; i < endBlock; i += 2000) {
            const _startBlock = i;
            const _endBlock = Math.min(endBlock, i + 1999);
            const gamePlayed = await trainingGame.queryFilter(trainingGame.filters.RewardMinted(), _startBlock, _endBlock);
            // await new Promise(resolve => setTimeout(resolve, 1000));
            let wizKilled = await graveyard.queryFilter(graveyard.filters.WizardKilled(), _startBlock, _endBlock);
            eventsCache = [...eventsCache, ...gamePlayed, ...wizKilled];

            counter++;
            if(counter % 10 == 0) {
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

        await fsPromises.writeFile(FileLocations.CACHED_WIZARD_TRAINING_EVENTS, JSON.stringify(eventsCache));
    }
};

export default func;
func.tags = ['get-early-trained-wizards'];

interface TokenInfo { tokenId: number, address: string, blockNumber: number, transactionIndex: number }