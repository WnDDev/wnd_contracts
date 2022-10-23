// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, upgrades } = require("hardhat");
const fs = require('fs');
var deployments = require('../data/deployments');

var network;

var childTunnel;
var randomizerCL;

var rift;
var consumables;
var wnd;
var gp;
var sacrificialAlter;
var traits;
var trainingGrounds;
var trainingGame;
var trainingProficiency;
var world;
var graveyard;

async function main() {
    const [deployer] = await ethers.getSigners();

    network = hre.network.name;

    deployments = JSON.parse(fs.readFileSync(`${__dirname}/../data/deployments.json`));

    childTunnel = await createContract("ChildTunnel", deployer);
    randomizerCL = await createContract("RandomizerCL", deployer);

    rift = await createContract("Rift", deployer);
    consumables = await createContract("Consumables", deployer);
    wnd = await createContract("WnD", deployer);
    gp = await createContract("GP", deployer);
    sacrificialAlter = await createContract("SacrificialAlter", deployer);
    traits = await createContract("Traits", deployer);
    trainingGrounds = await createContract("TrainingGrounds", deployer);
    trainingGame = await createContract("TrainingGame", deployer);
    trainingProficiency = await createContract("TrainingProficiency", deployer);
    world = await createContract("World", deployer);
    graveyard = await createContract("Graveyard", deployer);

    console.log("Unpausing contracts...");

    await(await rift.setPause(false)).wait();
    await(await world.setPause(false)).wait();
    await(await trainingProficiency.setPause(false)).wait();
    await(await trainingGrounds.setPause(false)).wait();
    await(await gp.setPause(false)).wait();
    await(await wnd.setPause(false)).wait();
    await(await sacrificialAlter.setPause(false)).wait();
    await(await consumables.setPause(false)).wait();
    await(await graveyard.setPause(false)).wait();
    await(await trainingGame.setPause(false)).wait();

    console.log("Setting contracts");

    await(await rift.setContracts(world.address, wnd.address, trainingProficiency.address, randomizerCL.address, childTunnel.address, gp.address, sacrificialAlter.address, consumables.address)).wait();
    await(await world.setContracts(trainingGrounds.address, wnd.address, rift.address)).wait();
    await(await trainingGrounds.setContracts(world.address, sacrificialAlter.address, gp.address, trainingProficiency.address, trainingGame.address, randomizerCL.address)).wait();
    await(await trainingGame.setContracts(world.address, sacrificialAlter.address, consumables.address, gp.address, wnd.address, trainingProficiency.address, randomizerCL.address, rift.address, graveyard.address)).wait();
    await(await graveyard.setContracts(wnd.address, consumables.address, world.address)).wait();
    await(await sacrificialAlter.setContracts(gp.address)).wait();
    await(await wnd.setContracts(traits.address)).wait();

    console.log("Adding admins");

    await(await world.addAdmins([rift.address, trainingProficiency.address, trainingGrounds.address, trainingGame.address])).wait();
    await(await rift.addAdmins([world.address, trainingProficiency.address, trainingGrounds.address, trainingGame.address])).wait();
    await(await trainingProficiency.addAdmins([world.address, rift.address, trainingGrounds.address, trainingGame.address])).wait();
    await(await trainingGrounds.addAdmins([world.address, rift.address, trainingProficiency.address, trainingGame.address])).wait();
    await(await trainingGame.addAdmins([world.address, rift.address, trainingProficiency.address, trainingGrounds.address])).wait();
    await(await graveyard.addAdmins([trainingGame.address])).wait();
    await(await consumables.addAdmins([rift.address, world.address, trainingProficiency.address, trainingGame.address, trainingGrounds.address])).wait();
    await(await sacrificialAlter.addAdmins([rift.address, world.address, trainingProficiency.address, trainingGame.address, trainingGrounds.address])).wait();
    await(await wnd.addAdmins([rift.address, world.address, trainingProficiency.address, trainingGame.address, trainingGrounds.address])).wait();
    await(await gp.addAdmins([rift.address, world.address, trainingProficiency.address, trainingGame.address, trainingGrounds.address])).wait();
}

async function createContract(contractName, deployer) {
    const factory = await ethers.getContractFactory(contractName, deployer);
    return factory.attach(deployments[`${network}-${contractName}`]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
