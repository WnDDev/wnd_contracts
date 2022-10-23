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

        const rootTunnelAddr = "0x2233b32d47CD12e0864d33b7514C80e624e234d5";
        const childTunnelAddr = "0xE1B5A572eE3B9C348189bCe0D98Aa2F7bcb9F00b";

        const mainnetProvider = new hre.ethers.providers.AlchemyProvider("homestead", process.env.MAINNET_ALCHEMY_KEY || '');
        // const polyProvider = new hre.ethers.providers.AnkrProvider("matic");

        const hash = await mainnetProvider.getTransactionReceipt("0x77cc791be55774215725d4d17f970a1a10abed68161957857c019a28abdc6e39");

        const stateSyncInterface = new hre.ethers.utils.Interface([
            "event StateSynced(uint256 indexed id,address indexed contractAddress,bytes data)",
            "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
            "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
        ]);

        console.log("parsing logs...");
        let events = hash.logs.map((log) => stateSyncInterface.parseLog(log))
        events = events.filter(x => x.name == 'StateSynced');
        if(events.length !== 1) {
            console.log(`Couldn't find StateSynced event for the hash: ${hash.transactionHash}`);
            return;
        }

        const stateSyncEvent = events[0];

        if(stateSyncEvent.eventFragment.inputs.length < 3 || stateSyncEvent.eventFragment.inputs[2].name !== "data" || stateSyncEvent.args.length < 3) {
            console.log(`Couldn't find StateSynced data...`);
            return;
        }

        //data arg
        let data = stateSyncEvent.args[2];

        // console.log(JSON.stringify(hash));
        await fsPromises.writeFile('./data/txeventoutput', JSON.stringify(data));

        const recorderDataTypes = ["uint256", "uint", "bytes"];
        const childTunnelDataTypes = ["address", "address", "bytes"];
        const riftDataTypes = ["address", "uint256", "uint256[]", "tuple(bool,uint8,uint8,uint8,uint8,uint8,uint8,uint8,uint8,uint8)[]", "uint256[]", "uint256[]", "uint256[]", "uint256[]"];

        // run decoder with recorderDataTypes, take the data and run it 1 more time
        // then run decover with riftDataTypes to get the input bytes
        // let data = "";
        // strip leading 2 byte32s without parsing (recorder data for polygon service)
        // data = hre.ethers.utils.hexDataSlice(data, 64);
        // strip 'from' address (RootTunnel contract) and the 'recipient' address (ChildTunnel contract) 
        // data = hre.ethers.utils.hexDataSlice(data, 64);

        const abiCoder = hre.ethers.utils.defaultAbiCoder;

        var res = abiCoder.decode(childTunnelDataTypes, data);
        if(res[0].toLowerCase() !== rootTunnelAddr.toLowerCase()) {
            console.log(`The from address: ${res[0]} does not match the RootTunnel address: ${rootTunnelAddr}`);
            return;
        }
        if(res[1].toLowerCase() !== childTunnelAddr.toLowerCase()) {
            console.log(`The recipient address: ${res[0]} does not match the ChildTunnel address: ${rootTunnelAddr}`);
            return;
        }

        // console.log(JSON.stringify(res[2]));

        await fsPromises.writeFile('./data/txoutput', JSON.stringify(res[2]));

        res = abiCoder.decode(riftDataTypes, res[2])

        // console.log(JSON.stringify(res));

        console.log(res[2].length);

        const tokenIds: BigNumber[] = [];
        const tokenTraits: any[] = [];

        if(res[2].length != res[3].length) {
            console.log(`Missing tokenid or token trait... Can't continue. Tx hash: ${hash.transactionHash}`);
            return;
        }

        for (let i = 0; i < res[2].length; i++) {
            tokenIds.push(res[2][i]);
            tokenTraits.push(res[3][i]);
        }

        // console.log('tokenIds to send: ' + JSON.stringify(tokenIds));
        // console.log('tokenTraits to send: ' + JSON.stringify(tokenTraits));

        const decodedData: {
            to: string,
            gpAmount: BigNumber,
            tokens: BigNumber[],
            traits: any[],
            saIds: BigNumber[],
            saAmounts: BigNumber[],
            consumableIds: BigNumber[],
            consumableAmounts: BigNumber[],

        } = {
            to: res[0],
            gpAmount: res[1] ?? BigNumber.from(0),
            tokens: res[2],
            traits: res[3],
            saIds: res[4] ?? [],
            saAmounts: res[5] ?? [],
            consumableIds: res[6] ?? [],
            consumableAmounts: res[7] ?? [],
        };

        // console.log(JSON.stringify(decodedData));

        var encoded = abiCoder.encode(
            riftDataTypes,
            Object.values(decodedData)
        );

        const inputData: {
            to: string,
            gpAmount: BigNumber,
            tokens: BigNumber[],
            traits: any[],
            saIds: BigNumber[],
            saAmounts: BigNumber[],
            consumableIds: BigNumber[],
            consumableAmounts: BigNumber[],

        } = {
            to: decodedData.to,
            gpAmount: decodedData.gpAmount ?? BigNumber.from(0),
            tokens: [],
            traits: [],
            saIds: decodedData.saIds ?? [],
            saAmounts: decodedData.saAmounts ?? [],
            consumableIds: decodedData.consumableIds ?? [],
            consumableAmounts: decodedData.consumableAmounts ?? [],
        }

        let hasNotRemovedExtraData = false;

        let numToSkip = 0;
        while (tokenIds.length > 0) {
            let tokenBatch: BigNumber[] = tokenIds.splice(0, Math.min(30, tokenIds.length));
            let traitBatch: any[] = tokenTraits.splice(0, Math.min(30, tokenTraits.length));

            if(numToSkip > 0) {
                numToSkip--;
                continue;
            }


            inputData.tokens = tokenBatch;
            inputData.traits = traitBatch;

            var encoded = abiCoder.encode(
                riftDataTypes,
                Object.values(inputData)
            );

            // console.log(tokenBatch);
            // console.log(encoded);
            // return;

            try {
                await execute(
                    'Rift',
                    { from: deployer.address, log: true },
                    `handleMessage`,
                    encoded
                )
            } catch (error) {
                // retry once
                try {
                    await execute(
                        'Rift',
                        { from: deployer.address, log: true },
                        `handleMessage`,
                        encoded
                    )
                } catch (error: any) {
                    const epochTime = Math.floor(new Date().getTime() / 1000);
                    await fsPromises.writeFile(`./data/failed_bridges/${decodedData.to}-${epochTime}.json`, JSON.stringify({
                        questionable: {
                            tokenBatch: tokenBatch.map(x => x.toNumber()),
                            traitBatch
                        },
                        tokenIdsRemaining: tokenIds.map(x => x.toNumber()),
                        tokenTraitsRemaining: tokenTraits,
                    }, null, 2));
                    console.log(`Error occurred, look in data/failed_bridges/${decodedData.to}-${epochTime}.json for data that hasn't been bridged`);
                    console.log(`Error: ${(error.reason ?? JSON.stringify(error))}`);
                    return;
                }
            }
            
            if(!hasNotRemovedExtraData) {
                // Set non-NFT related data to empty for batches after the first,
                // since the first batch will include all of these other items, if applicable.
                inputData.gpAmount = BigNumber.from(0);
                inputData.saIds = [];
                inputData.saAmounts = [];
                inputData.consumableIds = [];
                inputData.consumableAmounts = [];
                hasNotRemovedExtraData = true;
            }
        }
    }
};

export default func;
func.tags = ['wnd-retry-retrieve-l2'];
