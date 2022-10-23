import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber } from 'ethers';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { deployments, network } = hre;
    const { deploy, read, execute } = deployments;
    const [deployer] = await hre.ethers.getSigners();

    let isUnitTests = network.name === "hardhat";
    let isTestNet = network.name === "arbitrumtestnet" || network.name === "arbitrum-rinkeby";
    let isMainNet = !isUnitTests && !isTestNet;

    let forceSetContracts = false;

    await main();

    async function main() {

        let randomizerAddress = await getRandomizerAddress();

        const templateContract = await deployContract('Template');

        if(!isMainNet) {
            await unpauseContractIfNeeded('Template');
        }

        if(isUnitTests) {
            await unpauseContractIfNeeded('Randomizer');
            await setAdminsIfNeeded('Randomizer', templateContract.address);
        }

        await setContractsIfNeeded('Template', randomizerAddress);

        await setRoleIfNeeded('Template', "ADMIN", randomizerAddress);

        // do stuff to set up initial variables, run specific commands, etc.
        // this can be set up to call in unit tests, testnet, live, or any of the combination of the 3
        await setupTemplate();

        await verifyContracts();
    }

    async function setupTemplate() {
        // read and execute commands here to set up specific contract state since upgradeable
        // contracts cannot have constructors and you can't rely on the initializer function
        // for redeploys
        const areContractsSet = await read('Template', 'areContractsSet');

        if(!areContractsSet) {
            console.log("CONTACTS NOT SET");
            // const arg1 = "";
            // const arg2 = 1;
            // const arg3 = BigNumber.from("1000000000000000");
            // await execute(
            //     'Template',
            //     { from: deployer.address, log: true },
            //     'someFunctionHere',
            //     [arg1,arg2,arg3]
            // );
        }
    }

    async function getRandomizerAddress() : Promise<string> {
        if(isUnitTests) {
            const randomizer = await deployContract('Randomizer');
            return randomizer.address;
        } else if(isTestNet) {
            // Shared testnet deployment
            return "0xdec6641458eef4f7fe70101e77935d4e9d431f64";
        } else {
            // Live
            return "0x8e79c8607a28fe1EC3527991C89F1d9E36D1bAd9";
        }
    }

    async function unpauseContractIfNeeded(contract: string) {
        if(await read(contract, `paused`)) {
            await execute(
                contract,
                { from: deployer.address, log: true },
                `setPause`,
                false
            );
        }
    }

    async function setContractsIfNeeded(contract: string, ...args: any[]) {
        if(!forceSetContracts) {
            if((await read(contract, `areContractsSet`))) {
                return;
            }
        }

        await execute(
            contract,
            { from: deployer.address, log: true },
            `setContracts`,
            ...args
        );
    }

    async function setRoleIfNeeded(contract: string, role: string, ...args: any[]) {
        for(var i = 0; i < args.length; i++) {
            let address = args[i];

            if(address === "") {
                continue;
            }

            if(!(await read(contract, 'hasRole', getRoleWithName(role), address))) {
                await execute(
                    contract,
                    { from: deployer.address, log: true },
                    `grantRole`,
                    getRoleWithName(role),
                    address
                );
            }
        }
    }

    function getRoleWithName(name: string): string {
        return keccak256(toUtf8Bytes(name));
    }

    async function verifyContracts() {
        if(isUnitTests) {
            return;
        }

        try {
            await hre.run("etherscan-verify");
        } catch(error) {
            console.log(`Error verifying: ${error}`);
        }
    }

    async function deployContract(name: string) : Promise<any> {
        return await deploy(name, {
            from: deployer.address,
            log: true,
            proxy: {
                owner: deployer.address,
                proxyContract: 'OpenZeppelinTransparentProxy',
                execute: {
                    init: {
                        methodName: "initialize",
                        args: []
                    }
                }
            },
        });
    }

    // Old function used to add admins for contracts with Adminable/UtilitiesV1 library
    async function setAdminsIfNeeded(contract: string, ...args: any[]) {
        var addressesToAdd = new Array<string>();

        for(var i = 0; i < args.length; i++) {
            let address = args[i];

            if(address === "") {
                continue;
            }

            if(!(await read(contract, `isAdmin`, address))) {
                addressesToAdd.push(address);
            }
        }

        if(addressesToAdd.length > 0) {
            await execute(
                contract,
                { from: deployer.address, log: true },
                `addAdmins`,
                addressesToAdd
            );
        }
    }
};

export default func;
func.tags = ['template'];
// Add dependencies here to ensure the contract you are getting has been deployed in your desired network
func.dependencies = []