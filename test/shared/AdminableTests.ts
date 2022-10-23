import { expect } from "chai";
import { ethers } from "hardhat";
import { Adminable } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Utilities } from "../utilities";

describe("Adminable", function () {
    let _signers: SignerWithAddress[];
    let _ownerWallet: SignerWithAddress;
    let _otherWallet: SignerWithAddress;
    let _adminable: Adminable;

    beforeEach(async () => {
        Utilities.changeAutomineEnabled(true);
        _signers = await ethers.getSigners();
        _ownerWallet = _signers[0];
        _otherWallet = _signers[1];
        const factory = await ethers.getContractFactory("Adminable", _ownerWallet);
        _adminable = await(await factory.deploy()).deployed() as Adminable;
    });

    it("Should only allow owners to add or remove admins", async function () {

        expect(await _adminable.isAdmin(_otherWallet.address)).to.be.false;

        await expect(_adminable
            .connect(_otherWallet)
            .addAdmin(_otherWallet.address))
            .to.be.revertedWith("Ownable: caller is not the owner");
        await expect(_adminable
            .connect(_otherWallet)
            .removeAdmin(_otherWallet.address))
            .to.be.revertedWith("Ownable: caller is not the owner");

        // Must be contract address
        await expect(_adminable
            .connect(_ownerWallet)
            .addAdmin(_adminable.address))
            .to.not.be.reverted;

        expect(await _adminable.isAdmin(_adminable.address)).to.be.true;
    });
});
