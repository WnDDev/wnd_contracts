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

        if(network.name !== 'mainnet') {
            return;
        }

        // Only run this once or it will take ages to finish.
        // await cacheTowerEvents();

        await generateAddressesToStakedNFTs();

        // await verifyStakedInTowers();

        // await trimVerifiedData();
    }

    async function trimVerifiedData() {
        console.log();
        console.log("starting to trim empty wallet data for Tower1...")
        console.log();
        await trimEmptyWalletData('walletsInTower1Verified');
        console.log();
        console.log('empty wallet data trimmed for Tower1 done...');
        console.log();

        console.log();
        console.log("starting to trim empty wallet data for Tower2...")
        console.log();
        await trimEmptyWalletData('walletsInTower2Verified');
        console.log();
        console.log('empty wallet data trimmed for Tower2 done...');
        console.log();
    }

    async function trimEmptyWalletData(verifiedFileName: string) {
        const walletAndTokenIdsBuffer = await fsPromises.readFile(`./data/analytics/${verifiedFileName}.json`);
        let walletAndTokenIds: {address: string, tokenIds: number[]}[] = JSON.parse(walletAndTokenIdsBuffer.toString());

        await fsPromises.writeFile(`./data/analytics/${verifiedFileName}_backup.json`, JSON.stringify(walletAndTokenIds));

        let numTotalTokenIds: number = 0;
        walletAndTokenIds.forEach(x => numTotalTokenIds += x.tokenIds.length);

        console.log(`Wallets before: ${walletAndTokenIds.length}, totalTokens: ${numTotalTokenIds}`);

        let walletAndTokenIdsOutput: {address: string, tokenIds: number[]}[] = [];
        for (let i = 0; i < walletAndTokenIds.length; i++) {
            const item = walletAndTokenIds[i];
            if(item.tokenIds.length == 0) {
                continue;
            }
            walletAndTokenIdsOutput.push({
                address: item.address,
                tokenIds: item.tokenIds,
            });
        }

        numTotalTokenIds = 0;
        walletAndTokenIds.forEach(x => numTotalTokenIds += x.tokenIds.length);

        console.log(`Wallets after: ${walletAndTokenIdsOutput.length}, totalTokens: ${numTotalTokenIds}`);

        await fsPromises.writeFile(`./data/analytics/${verifiedFileName}.json`, JSON.stringify(walletAndTokenIdsOutput));
    }

    async function verifyStakedInTowers() {
        console.log();
        console.log("starting to verify tokens staked for Tower1...")
        console.log();
        await verifyStakedInTower("0xF042A49FB03cb9D98CbA9DEf8711CEE85dC72281", 'walletsInTower1', 'walletsInTower1Verified');
        console.log();
        console.log('verification for Tower1 done...');
        console.log();

        // console.log();
        // console.log("starting to verify tokens staked for Tower2...")
        // console.log();
        // await verifyStakedInTower("0xeeA43B892D4593E7C44530dB1f75b0519Db0BD50", 'walletsInTower2', 'walletsInTower2Verified');
        // console.log();
        // console.log('verification for Tower2 done...');
        // console.log();
    }

    async function verifyStakedInTower(towerAddr: string, inputFileName: string, outputFileName: string) {
        const nft: any = await V1Contracts.getWnDContract(hre);

        let walletAndTokenIdsBuffer: any[] = [];
        if(fs.existsSync(`./data/analytics/${outputFileName}.json`)) {
            walletAndTokenIdsBuffer = await fsPromises.readFile(`./data/analytics/${outputFileName}.json`);
        }
        else {
            walletAndTokenIdsBuffer = await fsPromises.readFile(`./data/analytics/${inputFileName}.json`);
        }
        let walletAndTokenIds: {address: string, tokenIds: number[]}[] = JSON.parse(walletAndTokenIdsBuffer.toString());

        let walletAndTokenIdsOutput: {address: string, tokenIds: number[]}[] = [];
        for (let i = 0; i < walletAndTokenIds.length; i++) {
            const item = walletAndTokenIds[i];
            walletAndTokenIdsOutput.push({
                address: item.address,
                tokenIds: item.tokenIds,
            });
        }

        let numTotalTokenIds: number = 0;
        walletAndTokenIds.forEach(x => numTotalTokenIds += x.tokenIds.length);

        let numTokenIdsVerified: number = 0;
        let numTokenIdsRemoved: number = 0;
        
        for (let i = 0; i < walletAndTokenIds.length; i++) {
            const walletCur = walletAndTokenIds[i];
            let promises: Promise<any[]>[] = [];
            let owners: any[][] = [];
            let hasRetried = false;
            try {
                for (let j = 0; j < walletCur.tokenIds.length; j++) {
                    const tokenCur = walletCur.tokenIds[j];
                    promises.push(Promise.all([
                        nft.ownerOf(tokenCur),
                        tokenCur
                    ]));
                }
                owners = await Promise.all(promises);
            } catch (error: any) {
                console.log(`Error! ${error.message}`);
                try {
                    promises = [];
                    console.log(`First retry...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    for (let j = 0; j < walletCur.tokenIds.length; j++) {
                        const tokenCur = walletCur.tokenIds[j];
                        promises.push(Promise.all([
                            nft.ownerOf(tokenCur),
                            tokenCur
                        ]));
                    }
                    owners = await Promise.all(promises);
                } catch (error) {
                    promises = [];
                    console.log(`Second retry...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    for (let j = 0; j < walletCur.tokenIds.length; j++) {
                        const tokenCur = walletCur.tokenIds[j];
                        promises.push(Promise.all([
                            nft.ownerOf(tokenCur),
                            tokenCur
                        ]));
                    }
                    owners = await Promise.all(promises);
                }
            }
            owners.forEach(x => {
                if(x[0] === towerAddr) {
                    numTokenIdsVerified++;
                }
                else {
                    // console.log(`Token ${x[1]} is not in the tower...`);
                    numTokenIdsRemoved++;
                    walletCur.tokenIds.splice(walletCur.tokenIds.indexOf(x[1]), 1);
                    walletAndTokenIdsOutput[i].tokenIds = walletCur.tokenIds;
                }
            });
            if(i != 0 && i % 10 == 0) {
                await fsPromises.writeFile(`./data/analytics/${outputFileName}.json`, JSON.stringify(walletAndTokenIdsOutput));
                console.log(`Wallets verified: ${i}/${walletAndTokenIdsOutput.length}, tokens verified: ${numTokenIdsVerified}, tokens removed: ${numTokenIdsRemoved}, out of ${numTotalTokenIds}`)
            }
        }

        console.log(`Num tokens removed: ${numTokenIdsRemoved}`);
        console.log(`Num verified tokens: ${numTokenIdsVerified}`);

        await fsPromises.writeFile(`./data/analytics/${outputFileName}.json`, JSON.stringify(walletAndTokenIdsOutput));
    }

    async function generateAddressesToStakedNFTs() {
        console.log();
        console.log("starting to generate address mapping for Tower1...")
        console.log();
        await generateAddressesFromTower(true, 'stakingEventsTower1', 'walletsInTower1');
        console.log();
        console.log('generate address mapping for Tower1 done...');
        console.log();

        console.log();
        console.log("starting to generate address mapping for Tower2...")
        console.log();
        await generateAddressesFromTower(false, 'stakingEventsTower2', 'walletsInTower2');
        console.log();
        console.log('generate address mapping for Tower2 done...');
        console.log();
    }

    async function generateAddressesFromTower(isTower1: boolean, inputEventFileName: string, outputFileName: string) {

        const towerWallets: Map<string, number[]> = new Map();
        const tokenToAddress: Map<number, string> = new Map();
        const tokenIdEventIndex = isTower1 ? 0 : 1;

        const allEventsBuffer: any[] = await fsPromises.readFile(`./data/event_cache/${inputEventFileName}.json`);
        const allEvents: any[] = JSON.parse(allEventsBuffer.toString());

        // var lastEventTest = allEvents.filter(x => x.transactionHash === '0x09d0d1eb3fe200b53535660764707651037037d25c02273265ba5714aa847230');
        // console.log(JSON.stringify(lastEventTest));
        // return;

        allEvents.sort(function(a, b){
            if(a.blockNumber == b.blockNumber) {
                return a.transactionIndex - b.transactionIndex;
            }
            return a.blockNumber - b.blockNumber;
        });

        for (let i = 0; i < allEvents.length; i++) {
            const event: any = allEvents[i];
            let addr = "";
            let tokenId = 0;
            if(event.event == "TokenStaked") {
                addr = event.args[0];
                tokenId = BigNumber.from(event.args[1]).toNumber();
                if(addr === "0xa8c5115c8e44351b2bc2d401a1f033bb45129dc5") {
                    console.log(`${addr} staked token # ${tokenId}`);
                }
                const oldOwner = tokenToAddress.get(tokenId);
                if(oldOwner !== undefined) {
                    const oldOwnerTokens = towerWallets.get(oldOwner) || []
                    if(oldOwnerTokens.includes(tokenId)) {
                        oldOwnerTokens.splice(oldOwnerTokens.indexOf(tokenId), 1);
                        towerWallets.set(oldOwner, oldOwnerTokens);
                    }
                }
                tokenToAddress.set(tokenId, addr);
                if(!towerWallets.has(addr)) {
                    towerWallets.set(addr, []);
                }
                let tokenIds: number[] = towerWallets.get(addr) || [];
                if(!tokenIds.includes(tokenId)) {
                    tokenIds.push(tokenId);
                }
                towerWallets.set(addr, tokenIds);
            }
            else if(event.event == "WizardClaimed" || event.event == "DragonClaimed") {
                tokenId = BigNumber.from(event.args[tokenIdEventIndex]).toNumber();
                // get owner of tokenid by the latest addr set to the tokenId
                addr = tokenToAddress.get(tokenId) || '';
                if(!towerWallets.has(addr)) {
                    // should never happen unless there was a failed tx?
                    console.log(`ERROR CLAIMING: token: ${tokenId}, addr: ${addr}`);
                    continue;
                }
                if(addr === "0xa8c5115c8e44351b2bc2d401a1f033bb45129dc5") {
                    console.log(`${addr} unstaked token # ${tokenId}`);
                }
                let tokenIds: number[] = towerWallets.get(addr) || [];
                tokenIds.splice(tokenIds.indexOf(tokenId), 1);
                towerWallets.set(addr, tokenIds);
            }
        }

        console.log(`Num events parsed: ${allEvents.length}`);

        const walletsToTokensStaked: {
            address: string,
            tokenIds: number[],
        }[] = [];

        towerWallets.forEach((_value, key) => {
            if(_value.length > 0) {
                walletsToTokensStaked.push({
                    address: key,
                    tokenIds: _value,
                });
            }
        })

        console.log(`Num wallets found: ${walletsToTokensStaked.length}`);

        // await fsPromises.writeFile(`./data/analytics/${outputFileName}.json`, JSON.stringify(walletsToTokensStaked));
    }

    async function cacheTowerEvents() {
        const startBlockTower1 = 13718003; // block tower1 was deployed
        const startBlockTower2 = 13797504; // block tower2 was deployed
        const endBlock = 14730831; // block after the last rescue

        console.log();
        console.log("starting to cache Tower1...")
        console.log();
        await cacheAllStakeEventsForTower(true, startBlockTower1, endBlock);
        console.log();
        console.log('caching Tower1 done...');
        console.log();

        console.log();
        console.log("starting to cache Tower2...")
        console.log();
        await cacheAllStakeEventsForTower(false, startBlockTower2, endBlock);
        console.log();
        console.log('caching Tower2 done...');
        console.log();
    }

    async function cacheAllStakeEventsForTower(isTower1: boolean, startBlock: number, endBlock: number) {
        const trainingGrounds: any = await V1Contracts.getTrainingGroundsContract(hre);
        const tower1 = await V1Contracts.getTower1Contract(hre);
        const isUnstakedIndex = isTower1 ? 1 : 2;
        const outputFile = isTower1 ? FileLocations.CACHED_TOWER1_STAKING_EVENTS : FileLocations.CACHED_TOWER2_STAKING_EVENTS;


        let tower: Contract = isTower1 ? tower1 : trainingGrounds;
        let stakeEventsCache: any[] = [];
        let counter = 0;
        for(let i = startBlock; i < endBlock; i += 2000) {
            const _startBlock = i;
            const _endBlock = Math.min(endBlock, i + 1999);
            const staked = await tower.queryFilter(tower.filters.TokenStaked(), _startBlock, _endBlock);
            await new Promise(resolve => setTimeout(resolve, 1000));
            let unstakedWiz = await tower.queryFilter(tower.filters.WizardClaimed(), _startBlock, _endBlock);
            unstakedWiz = unstakedWiz.filter( function( el: any ) {
                return el.args[isUnstakedIndex];
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            let unstakedDrag = await tower.queryFilter(tower.filters.DragonClaimed(), _startBlock, _endBlock);
            unstakedDrag = unstakedDrag.filter( function( el: any ) {
                return el.args[isUnstakedIndex];
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            stakeEventsCache = [...stakeEventsCache, ...staked, ...unstakedWiz, ...unstakedDrag];

            counter++;
            if(counter % 10 == 0) {
                console.log(`blocks ${_endBlock} out of ${endBlock} done...`);
                console.log("num events found: " + stakeEventsCache.length);
            }
        }

        // store in file so we don't need to pull this d
        stakeEventsCache.sort(function(a, b){
            if(a.blockNumber == b.blockNumber) {
                return a.transactionIndex - b.transactionIndex;
            }
            return a.blockNumber - b.blockNumber;
        });

        await fsPromises.writeFile(outputFile, JSON.stringify(stakeEventsCache));
    }
};

export default func;
func.tags = ['get-staked-tokens'];