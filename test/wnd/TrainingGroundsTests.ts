import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Utilities } from "../utilities";
import { WnDUtilities } from "../wnd/wndutilities";
import WorldLocation = WnDUtilities.WorldLocation;
import { BigNumber } from "ethers";
import { WnD, SacrificialAlter, MockRandomizerCL, World, GP, TrainingGrounds } from "../../typechain-types";

export default function() {}

describe("TrainingGrounds", function () {
    let _ownerWallet: SignerWithAddress;
    let _otherWallet: SignerWithAddress;
    
    let trainingGrounds: TrainingGrounds;
    let wnd: WnD;
    let sacrificialAlter: SacrificialAlter;
    let mockRandomizer: MockRandomizerCL;
    let world: World;
    let gp: GP;

    beforeEach(async () => {
        Utilities.changeAutomineEnabled(true);
        let signers = await ethers.getSigners();
        _ownerWallet = signers[0];
        _otherWallet = signers[1];

        await deployments.fixture([ 'traininggrounds', 'wndtoken', 'sacrificialalter', 'world', 'gptoken' ], { fallbackToGlobal: false });

        trainingGrounds = await Utilities.getDeployedContract<TrainingGrounds>('TrainingGrounds', _ownerWallet);
        wnd = await Utilities.getDeployedContract<WnD>('WnD', _ownerWallet);
        gp = await Utilities.getDeployedContract<GP>('GP', _ownerWallet);
        sacrificialAlter = await Utilities.getDeployedContract<SacrificialAlter>('SacrificialAlter', _ownerWallet);
        mockRandomizer = await Utilities.getDeployedContract<MockRandomizerCL>('MockRandomizerCL', _ownerWallet);
        world = await Utilities.getDeployedContract<World>('World', _ownerWallet);


    });

    it("Should be able to begin stake a wizard you own with enough GP", async function () {
        await(await wnd.mint(_otherWallet.address, 1, WnDUtilities.getWizardDragon(true))).wait();
        await(await wnd.mint(_otherWallet.address, 16000, WnDUtilities.getWizardDragon(true))).wait();

        // Add dragon to world
        await(await wnd.mint(_ownerWallet.address, 2, WnDUtilities.getWizardDragon(false))).wait();
        await(await world.stakeDragons([2], WorldLocation.TRAINING_GROUNDS)).wait();

        await expect(world.connect(_otherWallet).startStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.be.revertedWith("Not enough GP");

        // Give enough GP to stake 2 wizards.
        await(await gp.mint(_otherWallet.address, (await trainingGrounds.wizardStakingCost()).mul(2))).wait();

        // Fully staked immediately since it is a gen 0 wizard.
        await expect(world.connect(_otherWallet).startStakeWizards([1], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStakingFinish")
            .withArgs(_otherWallet.address, 1);

        expect(await world.locationOfToken(1))
            .to.equal(WorldLocation.TRAINING_GROUNDS);

        // Stake non-gen 0 wizard
        await expect(world.connect(_otherWallet).startStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStakingStart")
            // Request ID starts at 1
            .withArgs(_otherWallet.address, 16000, WnDUtilities.numToHexString(1));

        expect(await world.locationOfToken(16000))
            .to.equal(WorldLocation.TRAINING_GROUNDS_ENTERING);

        expect(await world.ownerOfTokenId(16000))
            .to.equal(_otherWallet.address);
    });

    it("Should be able to finish staking non-gen0 wizard that succeedes", async function () {
        await(await wnd.mint(_otherWallet.address, 16000, WnDUtilities.getWizardDragon(true))).wait();

        // Add dragon to world
        await(await wnd.mint(_ownerWallet.address, 2, WnDUtilities.getWizardDragon(false))).wait();
        await(await world.stakeDragons([2], WorldLocation.TRAINING_GROUNDS)).wait();

        // Give enough GP to stake a wizard.
        await(await gp.mint(_otherWallet.address, (await trainingGrounds.wizardStakingCost()))).wait();

        // Stake non-gen 0 wizard
        await expect(world.connect(_otherWallet).startStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStakingStart")
            // Request ID starts at 1
            .withArgs(_otherWallet.address, 16000, WnDUtilities.numToHexString(1));

        expect(await world.locationOfToken(16000))
            .to.equal(WorldLocation.TRAINING_GROUNDS_ENTERING);

        // Should fail as no random number yet
        await expect(world.connect(_otherWallet).finishStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.be.revertedWith("Not ready");

        await(await mockRandomizer.fulfillRandomness(WnDUtilities.numToHexString(1), 123)).wait();
        expect(await mockRandomizer.isRequestIDFulfilled(WnDUtilities.numToHexString(1)))
            .to.be.true;

        await expect(world.connect(_otherWallet).finishStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStakingFinish")
            .withArgs(_otherWallet.address, 16000);

        expect(await world.ownerOfTokenId(16000))
            .to.equal(_otherWallet.address);

        expect(await world.locationOfToken(16000))
            .to.equal(WorldLocation.TRAINING_GROUNDS);
    });

    it("Should allow for wizards to be stolen", async function () {
        // 100% chance of being stolen.
        await(await trainingGrounds.setStakingSettings(123, 100, 2, 1)).wait();

        await(await wnd.mint(_otherWallet.address, 16000, WnDUtilities.getWizardDragon(true))).wait();

        // Add dragon to world
        await(await wnd.mint(_ownerWallet.address, 2, WnDUtilities.getWizardDragon(false))).wait();
        await(await world.stakeDragons([2], WorldLocation.TRAINING_GROUNDS)).wait();

        // Give enough GP to stake a wizard.
        await(await gp.mint(_otherWallet.address, (await trainingGrounds.wizardStakingCost()).toNumber())).wait();

        // Stake non-gen 0 wizard
        await expect(world.connect(_otherWallet).startStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStakingStart")
            // Request ID starts at 1
            .withArgs(_otherWallet.address, 16000, WnDUtilities.numToHexString(1));

        await(await mockRandomizer.fulfillRandomness(WnDUtilities.numToHexString(1), 123)).wait();

        await expect(world.connect(_otherWallet).finishStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStolen")
            .withArgs(_otherWallet.address, _ownerWallet.address, 16000);

        expect(await world.isTokenInWorld(16000))
            .to.be.false;

        expect(await wnd.ownerOf(16000))
            .to.equal(_ownerWallet.address);
    });

    it("Should allow for a treasure chest to be stolen in place of a wizard", async function () {
        // 100% chance of being stolen.
        await(await trainingGrounds.setStakingSettings(123, 100, 2, 1)).wait();

        await(await wnd.mint(_otherWallet.address, 16000, WnDUtilities.getWizardDragon(true))).wait();
        await(await sacrificialAlter.mint(1, 1, _otherWallet.address)).wait();

        // Add dragon to world
        await(await wnd.mint(_ownerWallet.address, 2, WnDUtilities.getWizardDragon(false))).wait();
        await(await world.stakeDragons([2], WorldLocation.TRAINING_GROUNDS)).wait();

        // Give enough GP to stake a wizard.
        await(await gp.mint(_otherWallet.address, (await trainingGrounds.wizardStakingCost()).toNumber())).wait();

        // Stake non-gen 0 wizard
        await expect(world.connect(_otherWallet).startStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStakingStart")
            // Request ID starts at 1
            .withArgs(_otherWallet.address, 16000, WnDUtilities.numToHexString(1));

        // This is a 256 bit number in hex. F is the top hex value which makes the last 4 bits 1111. The treasure chest code checks the top bit.
        await(await mockRandomizer.fulfillRandomness(WnDUtilities.numToHexString(1), BigNumber.from("0x" + "F".padEnd(64, "0")))).wait();

        await expect(world.connect(_otherWallet).finishStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "ChestStolen")
            .withArgs(_otherWallet.address, _ownerWallet.address, 16000);

        expect(await world.ownerOfTokenId(16000))
            .to.equal(_otherWallet.address);

        expect(await world.locationOfToken(16000))
            .to.equal(WorldLocation.TRAINING_GROUNDS);
    });

    it("Should be able to stake and unstake dragon", async function () {
        // Add dragon to world
        await(await wnd.mint(_ownerWallet.address, 2, WnDUtilities.getWizardDragon(false))).wait();
        await(await world.stakeDragons([2], WorldLocation.TRAINING_GROUNDS)).wait();

        expect(await world.locationOfToken(2))
            .to.equal(WorldLocation.TRAINING_GROUNDS);

        await(await world.unstakeDragons([2], WorldLocation.TRAINING_GROUNDS)).wait();

        expect(await world.isTokenInWorld(2))
            .to.be.false;

        expect(await wnd.ownerOf(2))
            .to.equal(_ownerWallet.address);
    });

    it("Should be able to unstake gen0 and gen1 wizards", async function () {
        // no minimum stake time
        await(await trainingGrounds.setStakingSettings(123, 1, 0, 1)).wait();

        await(await wnd.mint(_otherWallet.address, 1, WnDUtilities.getWizardDragon(true))).wait();
        await(await wnd.mint(_otherWallet.address, 16000, WnDUtilities.getWizardDragon(true))).wait();

        // Add dragon to world
        await(await wnd.mint(_ownerWallet.address, 2, WnDUtilities.getWizardDragon(false))).wait();
        await(await world.stakeDragons([2], WorldLocation.TRAINING_GROUNDS)).wait();

        // Give enough GP to stake and unstake 2 wizards.
        await(await gp.mint(_otherWallet.address, (await trainingGrounds.wizardStakingCost()).toNumber() * 2)).wait();

        // Stake both
        await expect(world.connect(_otherWallet).startStakeWizards([1, 16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStakingFinish")
            .withArgs(_otherWallet.address, 1)
            .to.emit(trainingGrounds, "WizardStakingStart")
            // Request ID starts at 1
            .withArgs(_otherWallet.address, 16000, WnDUtilities.numToHexString(1));

        await(await mockRandomizer.fulfillRandomness(WnDUtilities.numToHexString(1), 123)).wait();

        await expect(world.connect(_otherWallet).finishStakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardStakingFinish")
            .withArgs(_otherWallet.address, 16000);

        // Now unstake. Gen 0 will be instance. Gen 1 will need to call finish.
        await expect(world.connect(_otherWallet).startUnstakeWizards([1, 16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardUnstakingFinish")
            .withArgs(_otherWallet.address, 1)
            .to.emit(trainingGrounds, "WizardUnstakingStart")
            // Request ID starts at 1
            .withArgs(_otherWallet.address, 16000, WnDUtilities.numToHexString(2));

        expect(await wnd.ownerOf(1))
            .to.equal(_otherWallet.address);

        expect(await world.locationOfToken(16000))
            .to.equal(WorldLocation.TRAINING_GROUNDS_LEAVING);

        await(await mockRandomizer.fulfillRandomness(WnDUtilities.numToHexString(2), 123)).wait();

        await expect(world.connect(_otherWallet).finishUnstakeWizards([16000], WorldLocation.TRAINING_GROUNDS))
            .to.emit(trainingGrounds, "WizardUnstakingFinish")
            .withArgs(_otherWallet.address, 16000);

        expect(await wnd.ownerOf(16000))
            .to.equal(_otherWallet.address);

        expect(await gp.balanceOf(_otherWallet.address))
            .to.eq(0);
    });
});