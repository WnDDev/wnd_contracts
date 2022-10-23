import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber } from 'ethers';
import { POSClient, use } from "@maticnetwork/maticjs"
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
const CSV = require("comma-separated-values");
const fsPromises = require("fs/promises");
const axios = require('axios')

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    use(Web3ClientPlugin);

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

        const iface = new hre.ethers.utils.Interface([
            "event MessageSent(bytes message)"
        ]);
        // Get signature from interface to be explicit about what event we are wrapping the proof in.
        const eventSigHash = iface.getEventTopic("MessageSent"); // outputs 0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036

        let posClient = new POSClient();

        let pk = process.env.PRIVATE_KEY || '';
        let parent = new HDWalletProvider(pk, `https://eth-mainnet.alchemyapi.io/v2/${process.env.MAINNET_ALCHEMY_KEY}`);
        let child = new HDWalletProvider(pk, process.env.POLYGON_URL || '');
        
        //This will be a function input for the signed in wallet
        const account = "0xcc0b5aca8a8de4c907553bf33400540e91be9b39";

        posClient = await posClient.init({
            network: "mainnet", //L1 network "mainnet"
            version: "v1", // L2 network "matic"
            parent: {
                provider: parent,
                defaultConfig: {
                    from: account // Wallet address
                }
            },
            child: {
                provider: child,
                defaultConfig: {
                    from: account // Wallet address
                }
            }
        });

        const polyProvider = new hre.ethers.providers.AnkrProvider("matic", '5c755c52116f11eb22beecaf399e1cead9debc36444b50bfd0ead8d4337a0a6c');


        // const startBlock = parseInt(localStorage.getItem('lastExtractBlockUsed') || '27902267'); // 27902267 is the creation block for ChildTunnel contract
        const startBlock = 27902267; // 27902267 is the creation block for ChildTunnel contract
        const endBlock = await polyProvider.getBlockNumber();
        // localStorage.setItem('lastExtractBlockUsed', endBlock.toString());

        const apiCall = `https://api.polygonscan.com/api?module=account&action=txlist&address=${account}&startblock=${startBlock}&endblock=${endBlock}&page=1&offset=10000&sort=asc&apikey=${process.env.POLYGONSCAN_API_KEY}`;
        const response = await axios.get(apiCall);

        if(!response.data.result) {
            console.log("Extreme error: couldnt find account transactions");
            return;
        }

        const txList = response.data.result;

        console.log(txList.length);

        // const pendingTxs: any = JSON.parse(localStorage.getItem('pendingL1Withdraws') || '[]');
        let pendingTxs: any = [];
        const abiCoder = hre.ethers.utils.defaultAbiCoder;

        try {
            for (let i = 0; i < txList.length; i++) {
                const tx = txList[i];
                if(pendingTxs.includes(tx.hash)) {
                    continue;
                }
                let txReceipt = await polyProvider.getTransactionReceipt(tx.hash);
                if(!txReceipt) {
                    console.log(`NO RECEIPT! ${tx.hash}`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    txReceipt = await polyProvider.getTransactionReceipt(tx.hash);
                    if(!txReceipt) {
                        continue;
                    }
                }
                let foundMessageSentEvent: boolean = false;
                let data: string = '';
                // console.log(`has receipt? ${txReceipt != undefined} ${i}`);
                // console.log('has logs? ' + JSON.stringify(txReceipt.logs != undefined));
                txReceipt.logs.forEach(x => {
                    if(x.topics.includes(eventSigHash)) {
                        foundMessageSentEvent = true;
                        data = x.data;
                    };
                });
                if(!foundMessageSentEvent) {
                    // console.log(`Skipping unrelated ${i}`);
                    continue;
                }
                console.log("FOUND EVENT!!");
                console.log(tx.hash);
                // strip first 2 bytes as they are event padding and unrelated
                data = hre.ethers.utils.hexDataSlice(data, 64);
                // console.log(data);
                // return abi.encode(msg.sender, _gpAmount, _wndTokenIds, _saIds, _saAmounts, _consumablesIds, _consumablesAmounts);
                const l1DataTypes = ["address", "uint256", "uint256[]", "uint256[]", "uint256[]", "uint256[]", "uint256[]"];
                var inputs = abiCoder.decode(l1DataTypes, data);
                const senderWallet: string = inputs[0];
                const gpAmt: BigNumber = inputs[1];
                const nftTokens: BigNumber[] = inputs[2];
                const sacAlterIds: BigNumber[] = inputs[3];
                const sacAlterAmts: BigNumber[] = inputs[4];
                const consumablesIds: BigNumber[] = inputs[5];
                const consumablesAmts: BigNumber[] = inputs[6];
                // console.log(JSON.stringify(inputs));
                
                // add it to pending if 
                try {
                    if(!await posClient.isCheckPointed(tx.hash)) {
                        console.log("tx is not checkpointed!");
                        pendingTxs.push(tx.hash);
                        continue;
                    }
                } catch (error) {
                    console.log(`error checking for checkpoint: ${JSON.stringify(error)}`);
                    continue;
                }
                try {
                    const proof = await posClient.exitUtil.buildPayloadForExit(
                        tx.hash,
                        eventSigHash, 
                        false
                    ).catch((err: any) => console.log(err));

                    console.log();
                    console.log(proof);
                    console.log();

                    // TODO: call rootTunnel.receiveMessage(proof)
                    //   await execute(
                    //     'RootTunnel',
                    //     { from: deployer.address, log: true },
                    //     `receiveMessage`,
                    //     proof
                    //   );
                } catch (error) {
                console.log("Something went wrong receiving message...");
                // Remove from pending array if it contains it
                pendingTxs = pendingTxs.filter((x: any) => x != tx.hash);
                // Assume the tx has already been completed.
                // Because the endBlock from this run has been stored,
                // this tx will never be attempted again unless
                // the user clears their browser cache
                }
            }
        } catch(error) {
            console.log('error: ' + JSON.stringify(error));
        }
        
        // localStorage.setItem('pendingL1Withdraws', JSON.stringify(pendingTxs));
    }
};

export default func;
func.tags = ['wnd-l1-withdraw'];