import { POSClient, use } from "@maticnetwork/maticjs"
import { providers, ethers, Wallet } from "ethers";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";

use(Web3ClientPlugin);

async function main() {
    

    let posClient = new POSClient();

    let pk = process.env.PRIVATE_KEY;
    let parent = new HDWalletProvider(pk, process.env.GOERLI_URL);
    let child = new HDWalletProvider(pk, process.env.MUMBAI_URL);

    try {
        posClient = await posClient.init({
            network: "testnet",
            version: "mumbai",
            parent: {
                provider: parent,
                defaultConfig: {
                    from: "0x315EFf99b705B62362Ee2b406fBBf24b1Cf78efF"
                }
            },
            child: {
                provider: child,
                defaultConfig: {
                    from: "0x315EFf99b705B62362Ee2b406fBBf24b1Cf78efF"
                }
            }
        });
    
        const payload = await posClient
            .exitUtil
            .buildPayloadForExit(
                "0x791d9cc35ebab7dbaa4c5c36c874b79678f35eddea369078b88135635605fd16",
                "0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036",
                false
            ).catch(err => console.log(err));
    
        console.log(payload)
    } catch(error) {
        console.log(error)
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
