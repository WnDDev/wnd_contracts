import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Utilities } from "../utilities";
import { WnDUtilities } from "../wnd/wndutilities";
import WorldLocation = WnDUtilities.WorldLocation;
import { TrainingProficiency } from "../../typechain-types";

export default function() {}

describe("TrainingProficiency", function () {
    let _ownerWallet: SignerWithAddress;
    let _otherWallet: SignerWithAddress;
    
    let trainingProficiency: TrainingProficiency;

    beforeEach(async () => {
        Utilities.changeAutomineEnabled(true);
        let signers = await ethers.getSigners();
        _ownerWallet = signers[0];
        _otherWallet = signers[1];

        await deployments.fixture([ 'trainingproficiency' ], { fallbackToGlobal: false });

        trainingProficiency = await Utilities.getDeployedContract<TrainingProficiency>('TrainingProficiency', _ownerWallet);
    });

    it("Should only be able to set max proficiency by admin", async function () {
        await expect(trainingProficiency
            .connect(_otherWallet)
            .setMaxProficiency(10))
            .to.be.revertedWith("Not admin or owner");

        await (await trainingProficiency
            .setMaxProficiency(10))
            .wait();

        expect(await trainingProficiency.maxProficiency())
            .to.equal(10);
    });

    it("Should not increase past max proficiency", async function() {
        await (await trainingProficiency
            .setMaxProficiency(1))
            .wait();

        expect(await trainingProficiency
            .proficiencyForWizard(1))
            .to.equal(0);

        await (await trainingProficiency
            .increaseProficiencyForWizard(1)).wait();

        expect(await trainingProficiency
            .proficiencyForWizard(1))
            .to.equal(1);

        await (await trainingProficiency
            .increaseProficiencyForWizard(1)).wait();

        // Still equals 1 since this is the max.
        expect(await trainingProficiency
            .proficiencyForWizard(1))
            .to.equal(1);

        await (await trainingProficiency
            .setMaxProficiency(2))
            .wait();

        await (await trainingProficiency
            .increaseProficiencyForWizard(1)).wait();

        expect(await trainingProficiency
            .proficiencyForWizard(1))
            .to.equal(2);
    });
});