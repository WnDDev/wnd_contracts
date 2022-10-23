
const { ethers, upgrades } = require("hardhat");
import { MockRootWnD, Rift, World, TrainingProficiency, TrainingGrounds,
    TrainingGame, Consumables, SacrificialAlter, Traits, WnD, GP, MockRandomizerCL, RiftRoot, MockRootTunnel, MockChildTunnel, MockOldTrainingGrounds, Graveyard } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export module WnDUtilities {

    export enum WorldLocation {
        NONEXISTENT = 0,
        RIFT = 1,
        TRAINING_GROUNDS_ENTERING = 2,
        TRAINING_GROUNDS = 3,
        TRAINING_GROUNDS_LEAVING = 4
    }

    export class WnDWorld {
        mockRandomizer: MockRandomizerCL;

        oldTrainingGrounds: MockOldTrainingGrounds;
        rootConsumables: Consumables;
        rootWnD: MockRootWnD;
        rootSacrificialAlter: SacrificialAlter;
        rootGP: GP;
        riftRoot: RiftRoot;
        rootTunnel: MockRootTunnel;

        childTunnel: MockChildTunnel;
        rift: Rift;
        world: World;
        trainingProficiency: TrainingProficiency;
        trainingGrounds: TrainingGrounds;
        trainingGame: TrainingGame;
        consumables: Consumables;
        sacrificialAlter: SacrificialAlter;
        traits: Traits;
        wnd: WnD;
        gp: GP;

        ownerWallet: SignerWithAddress;
        otherWallet: SignerWithAddress;

        constructor(mockRandomizer: MockRandomizerCL, rootConsumables: Consumables, rootWnD: MockRootWnD, rootSacrificialAlter: SacrificialAlter, rootGP: GP, rift: Rift, world: World, trainingProficiency: TrainingProficiency, trainingGrounds: TrainingGrounds,
            trainingGame: TrainingGame, consumables: Consumables, sacrificialAlter: SacrificialAlter, traits: Traits,
            wnd: WnD, gp: GP, ownerWallet: SignerWithAddress, otherWallet: SignerWithAddress, riftRoot: RiftRoot, rootTunnel: MockRootTunnel, childTunnel: MockChildTunnel,
            oldTrainingGrounds: MockOldTrainingGrounds)
        {
            this.mockRandomizer = mockRandomizer;

            this.rootConsumables = rootConsumables;
            this.rootWnD = rootWnD;
            this.rootSacrificialAlter = rootSacrificialAlter;
            this.rootGP = rootGP;
            this.riftRoot = riftRoot;
            this.rootTunnel = rootTunnel;

            this.childTunnel = childTunnel;
            this.rift = rift;
            this.world = world;
            this.trainingProficiency = trainingProficiency;
            this.trainingGrounds = trainingGrounds;
            this.trainingGame = trainingGame;
            this.consumables = consumables;
            this.sacrificialAlter = sacrificialAlter;
            this.traits = traits;
            this.wnd = wnd;
            this.gp = gp;
            this.oldTrainingGrounds = oldTrainingGrounds;

            this.ownerWallet = ownerWallet;
            this.otherWallet = otherWallet;
        }
    }

    export function getWizardDragon(isWizard: boolean) : any {
        return {
            isWizard: isWizard,
            body: 1,
            head: 1,
            spell: 1,
            eyes: 1,
            mouth: 1,
            neck: 1,
            wand: 1,
            tail: 1,
            rankIndex: 3
        };
    }

    export async function setupWnD() : Promise<WnDWorld> {
        let signers = await ethers.getSigners();
        let ownerWallet = signers[0];
        let otherWallet = signers[1];

        let mockRandomizer = await(await(await ethers.getContractFactory("MockRandomizerCL", ownerWallet)).deploy()).deployed() as MockRandomizerCL;

        let oldTrainingGrounds = await(await(await ethers.getContractFactory("MockOldTrainingGrounds", ownerWallet)).deploy()).deployed() as MockOldTrainingGrounds;
        let rootConsumables = await upgrades.deployProxy(await ethers.getContractFactory("Consumables", ownerWallet)) as Consumables;
        let rootSacrificialAlter = await upgrades.deployProxy(await ethers.getContractFactory("SacrificialAlter", ownerWallet)) as SacrificialAlter;
        let traits = await(await(await ethers.getContractFactory("Traits", ownerWallet)).deploy()).deployed() as Traits;
        let rootWnD = await(await(await ethers.getContractFactory("MockRootWnD", ownerWallet)).deploy()).deployed() as MockRootWnD;
        let rootGP = await upgrades.deployProxy(await ethers.getContractFactory("GP", ownerWallet)) as GP;
        let rootTunnel = await(await(await ethers.getContractFactory("MockRootTunnel", ownerWallet)).deploy()).deployed() as MockRootTunnel;

        await(await rootGP.setPause(false)).wait();
        await(await rootSacrificialAlter.setPause(false)).wait();
        await(await rootSacrificialAlter.setContracts(rootGP.address)).wait();
        await(await rootSacrificialAlter.setType(1, 10000)).wait();
        await(await rootSacrificialAlter.setType(2, 10000)).wait();
        await(await rootConsumables.setPause(false)).wait();
        await(await rootConsumables.setType(1, 100000)).wait();
        await(await rootConsumables.setType(2, 100000)).wait();

        let riftRoot = await upgrades.deployProxy(await ethers.getContractFactory("RiftRoot", ownerWallet)) as RiftRoot;

        await(await riftRoot.setPause(false)).wait();

        await(await riftRoot.setContracts(rootGP.address, rootWnD.address, rootSacrificialAlter.address, rootConsumables.address, rootTunnel.address, oldTrainingGrounds.address)).wait();
        await(await rootGP.addAdmin(riftRoot.address)).wait();
        await(await rootSacrificialAlter.addAdmin(riftRoot.address)).wait();
        await(await rootConsumables.addAdmin(riftRoot.address)).wait();

        let childTunnel = await(await(await ethers.getContractFactory("MockChildTunnel", ownerWallet)).deploy()).deployed() as MockChildTunnel;

        let rift = await upgrades.deployProxy(await ethers.getContractFactory("Rift", ownerWallet)) as Rift;
        let world = await upgrades.deployProxy(await ethers.getContractFactory("World", ownerWallet)) as World;
        let trainingProficiency = await upgrades.deployProxy(await ethers.getContractFactory("TrainingProficiency", ownerWallet)) as TrainingProficiency;
        let trainingGrounds = await upgrades.deployProxy(await ethers.getContractFactory("TrainingGrounds", ownerWallet)) as TrainingGrounds;
        let trainingGame = await upgrades.deployProxy(await ethers.getContractFactory("TrainingGame", ownerWallet)) as TrainingGame;
        let consumables = await upgrades.deployProxy(await ethers.getContractFactory("Consumables", ownerWallet)) as Consumables;
        let sacrificialAlter = await upgrades.deployProxy(await ethers.getContractFactory("SacrificialAlter", ownerWallet)) as SacrificialAlter;
        let wnd = await upgrades.deployProxy(await ethers.getContractFactory("WnD", ownerWallet)) as WnD;
        let gp = await upgrades.deployProxy(await ethers.getContractFactory("GP", ownerWallet)) as GP;
        let graveyard = await upgrades.deployProxy(await ethers.getContractFactory("Graveyard", ownerWallet)) as Graveyard;

        await(await rift.setPause(false)).wait();
        await(await world.setPause(false)).wait();
        await(await trainingProficiency.setPause(false)).wait();
        await(await trainingGrounds.setPause(false)).wait();
        await(await gp.setPause(false)).wait();
        await(await wnd.setPause(false)).wait();
        await(await sacrificialAlter.setPause(false)).wait();
        await(await consumables.setPause(false)).wait();
        await(await graveyard.setPause(false)).wait();

        await(await rift.setContracts(world.address, wnd.address, trainingProficiency.address, mockRandomizer.address, childTunnel.address, gp.address, sacrificialAlter.address, consumables.address)).wait();
        await(await world.setContracts(trainingGrounds.address, wnd.address, rift.address)).wait();
        await(await trainingGrounds.setContracts(world.address, sacrificialAlter.address, gp.address, trainingProficiency.address, trainingGame.address, mockRandomizer.address)).wait();
        await(await trainingGame.setContracts(world.address, sacrificialAlter.address, consumables.address, gp.address, wnd.address, trainingProficiency.address, mockRandomizer.address, rift.address, graveyard.address)).wait();
        await(await graveyard.setContracts(wnd.address, consumables.address, world.address, trainingGame.address)).wait();

        await(await world.addAdmins([rift.address, trainingProficiency.address, trainingGrounds.address, trainingGame.address, ownerWallet.address])).wait();
        await(await rift.addAdmins([world.address, trainingProficiency.address, trainingGrounds.address, trainingGame.address, ownerWallet.address])).wait();
        await(await trainingProficiency.addAdmins([world.address, rift.address, trainingGrounds.address, trainingGame.address, ownerWallet.address])).wait();
        await(await trainingGrounds.addAdmins([world.address, rift.address, trainingProficiency.address, trainingGame.address, ownerWallet.address])).wait();
        await(await trainingGame.addAdmins([world.address, rift.address, trainingProficiency.address, trainingGrounds.address, ownerWallet.address])).wait();
        await(await graveyard.addAdmins([trainingGame.address, ownerWallet.address])).wait();

        await(await consumables.addAdmins([rift.address, world.address, trainingProficiency.address, trainingGame.address, trainingGrounds.address])).wait();
        await(await sacrificialAlter.addAdmins([rift.address, world.address, trainingProficiency.address, trainingGame.address, trainingGrounds.address])).wait();
        await(await wnd.addAdmins([rift.address, world.address, trainingProficiency.address, trainingGame.address, trainingGrounds.address])).wait();
        await(await gp.addAdmins([rift.address, world.address, trainingProficiency.address, trainingGame.address, trainingGrounds.address])).wait();

        await(await sacrificialAlter.setContracts(gp.address)).wait();
        await(await sacrificialAlter.setType(1, 10000)).wait();
        await(await sacrificialAlter.setType(2, 10000)).wait();
        await(await consumables.setType(1, 100000)).wait();
        await(await consumables.setType(2, 100000)).wait();
        // Phoenix Downs
        await(await consumables.setType(4, 100000)).wait();
        await(await wnd.setContracts(traits.address)).wait();

        return new WnDWorld(mockRandomizer, rootConsumables, rootWnD, rootSacrificialAlter, rootGP, rift, world, trainingProficiency, trainingGrounds, trainingGame,
            consumables, sacrificialAlter, traits, wnd, gp, ownerWallet, otherWallet, riftRoot, rootTunnel, childTunnel, oldTrainingGrounds);
    }

    export function numToHexString(num: Number) : string {
        return "0x" + num.toString(16).padStart(64, "0");
    }
}
