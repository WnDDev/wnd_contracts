import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Utilities } from "../utilities";
import { WnDUtilities } from "../wnd/wndutilities";
import WnDWorld = WnDUtilities.WnDWorld;
import WorldLocation = WnDUtilities.WorldLocation;
import { MockRandomizerCL, Rift, SacrificialAlter, WnD, World } from "../../typechain-types";

export default function() {}

describe("Rift", function () {
    let _ownerWallet: SignerWithAddress;
    let _otherWallet: SignerWithAddress;

    let rift: Rift;
    let wnd: WnD;
    let sacrificialAlter: SacrificialAlter;
    let mockRandomizer: MockRandomizerCL;
    let world: World;

    let treasureChestId = 5;

    beforeEach(async () => {
        Utilities.changeAutomineEnabled(true);

        let signers = await ethers.getSigners();
        _ownerWallet = signers[0];
        _otherWallet = signers[1];

        await deployments.fixture([ 'rift', 'wndtoken', 'sacrificialalter', 'world' ], { fallbackToGlobal: false });

        rift = await Utilities.getDeployedContract<Rift>('Rift', _ownerWallet);
        wnd = await Utilities.getDeployedContract<WnD>('WnD', _ownerWallet);
        sacrificialAlter = await Utilities.getDeployedContract<SacrificialAlter>('SacrificialAlter', _ownerWallet);
        mockRandomizer = await Utilities.getDeployedContract<MockRandomizerCL>('MockRandomizerCL', _ownerWallet);
        world = await Utilities.getDeployedContract<World>('World', _ownerWallet);

        await(await rift.setWizardSettings(10, treasureChestId)).wait();
    });

    it("Should only hold back non-gen 0 wizards", async function () {

        await(await rift.processMessageFromRoot(
            _ownerWallet.address,
            0,
            [1, 16000, 32000],
            [WnDUtilities.getWizardDragon(true), WnDUtilities.getWizardDragon(true), WnDUtilities.getWizardDragon(false)],
            [],
            [],
            [],
            [])).wait();

        expect(await wnd.ownerOf(1))
            .to.equal(_ownerWallet.address);
        // Non-gen0 held back.
        expect(await wnd.ownerOf(16000))
            .to.equal(rift.address);
        expect(await wnd.ownerOf(32000))
            .to.equal(_ownerWallet.address);
    });

    it("Should be able to reveal once the random number has returned", async function () {

        await(await rift.processMessageFromRoot(
            _ownerWallet.address,
            0,
            [16000],
            [WnDUtilities.getWizardDragon(true)],
            [],
            [],
            [],
            [])).wait();

        // Can't withdraw yet.
        await expect(rift.withdrawWizardsToWallet())
            .to.be.revertedWith("Request in progress");

        await(await mockRandomizer.fulfillRandomness(WnDUtilities.numToHexString(1), 235234)).wait();

        await(await rift.withdrawWizardsToWallet()).wait();

        expect(await wnd.ownerOf(16000))
            .to.equal(_ownerWallet.address);

        // No tokens given since their wizard didn't die.
        expect(await sacrificialAlter.balanceOf(_ownerWallet.address, 0))
            .to.equal(0);
    });

    it("Should send wizard to a dragon if stolen", async function () {

        // Add dragon to the world that will be the recipient
        await(await wnd.mint(_otherWallet.address, 17000, WnDUtilities.getWizardDragon(false))).wait();

        await(await world
            .connect(_otherWallet).stakeDragons([17000], WorldLocation.RIFT)).wait();

        await(await rift.processMessageFromRoot(
            _ownerWallet.address,
            0,
            [16000],
            [WnDUtilities.getWizardDragon(true)],
            [],
            [],
            [],
            [])).wait();

        await(await mockRandomizer.fulfillRandomness(WnDUtilities.numToHexString(1), 12)).wait();

        await expect(rift.withdrawWizardsToWallet())
            .to.emit(rift, "WizardStolen")
            .withArgs(_ownerWallet.address, _otherWallet.address, 16000);

        expect(await wnd.ownerOf(16000))
            .to.equal(_otherWallet.address);

        // Unstake dragon from rift.
        await(await world
            .connect(_otherWallet)
            .unstakeDragons([17000], WorldLocation.RIFT)).wait();

        expect(await wnd.ownerOf(17000))
            .to.equal(_otherWallet.address);
    });

    it("Should not hold wizards/dragons when only dragons/gen0 wizard are transferred", async function () {

        await(await rift.processMessageFromRoot(
            _ownerWallet.address,
            0,
            [1, 32000],
            [WnDUtilities.getWizardDragon(true), WnDUtilities.getWizardDragon(false)],
            [],
            [],
            [],
            [])).wait();

        expect(await wnd.ownerOf(1))
            .to.equal(_ownerWallet.address);
        expect(await wnd.ownerOf(32000))
            .to.equal(_ownerWallet.address);
    });

    it("Should allow setting the chance of being stolen by a dragon by admin", async function () {
        await expect(rift.connect(_otherWallet).setWizardSettings(40, treasureChestId))
            .to.be.revertedWith("Not admin or owner");

        await (await rift.setWizardSettings(40, treasureChestId)).wait();

        expect(await rift.chanceWizardStolen())
            .to.equal(40);
    });
});