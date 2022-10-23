import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { V1Contracts } from '../utils/V1Contracts';
import { Ownable } from '../../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const { deployments, network } = hre;
    const { deploy, read, execute, getOrNull } = deployments;
    const [deployer] = await hre.ethers.getSigners();

    await main();

    async function main() {
        if(network.name !== 'polygon' && network.name !== 'mainnet') {
            console.log("wrong network. only polygon or mainnet");
            return;
        }

        const newOwnerAddress = "0x6e0e275083327cacc7195de94532c7a86c05bd05";

        // ------------ POLYGON CONTRACTS -------------
        // ChildTunnel
        // Consumables
        // DefaultProxyAdmin
        // GP
        // Graveyard
        // RandomizerCL
        // Rift
        // SacrificialAlter
        // TrainingGame
        // TrainingGrounds
        // TrainingProficiency
        // Traits
        // WnD
        // World
        if(network.name === 'polygon') {
            await transferOwnershipIfNeeded('ChildTunnel', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('Consumables', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('DefaultProxyAdmin', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('GP', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('Graveyard', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('RandomizerCL', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('Rift', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('SacrificialAlter', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('TrainingGame', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('TrainingGrounds', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('TrainingProficiency', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('Traits', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('WnD', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('World', newOwnerAddress, deployer);
        }

        // ------------ MAINNET CONTRACTS --------------
        // -=-=-=-=-=- New / Proxied Contracts -=-=-=-=-=-
        // Consumables
        // DefaultProxyAdmin
        // RiftRoot
        // RootTunnel
        // SwiperSwiping
        // -=-=-=-=-=- Old Contracts -=-=-=-=-=-
        // GP
        // SacrificialAlter
        // Tower
        // TrainingGrounds
        // Traits
        // WnD
        if(network.name === 'mainnet') {
            await transferOwnershipIfNeeded('Consumables', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('DefaultProxyAdmin', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('RiftRoot', newOwnerAddress, deployer);
            await transferOwnershipIfNeeded('RootTunnel', newOwnerAddress, deployer);

            console.log(`Running transferOwnership on gp...`)
            const gp = (await V1Contracts.getGPContract(hre)) as Ownable;
            await (await gp.transferOwnership(newOwnerAddress, {from: deployer.address})).wait();

            console.log(`Running transferOwnership on sacAlter...`)
            const sacAlter = (await V1Contracts.getSacrificialAlterContract(hre)) as Ownable;
            await (await sacAlter.transferOwnership(newOwnerAddress, {from: deployer.address})).wait();

            console.log(`Running transferOwnership on tower...`)
            const tower = (await V1Contracts.getTower1Contract(hre)) as Ownable;
            await (await tower.transferOwnership(newOwnerAddress, {from: deployer.address})).wait();

            console.log(`Running transferOwnership on trainingGrounds...`)
            const trainingGrounds = (await V1Contracts.getTrainingGroundsContract(hre)) as Ownable;
            await (await trainingGrounds.transferOwnership(newOwnerAddress, {from: deployer.address})).wait();

            console.log(`Running transferOwnership on traits...`)
            const traits = (await V1Contracts.getTraitsContract(hre)) as Ownable;
            await (await traits.transferOwnership(newOwnerAddress, {from: deployer.address})).wait();

            console.log(`Running transferOwnership on wnd...`)
            const wnd = (await V1Contracts.getWnDContract(hre)) as Ownable;
            await (await wnd.transferOwnership(newOwnerAddress, {from: deployer.address})).wait();
        }
        console.log(`Transfer complete.`)
    }

    async function transferOwnershipIfNeeded(contractName: string, newOwner: string, deployer: SignerWithAddress): Promise<void> {
        await execute(
            contractName,
            { from: deployer.address, log: true, gasLimit: 15000000, gasPrice: "210000000000"  },
            'transferOwnership',
            newOwner
        );
    }
};

export default func;
func.tags = ['TransferOwnership'];

