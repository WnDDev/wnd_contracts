import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Utilities } from "../utilities";
import { WnDUtilities } from "../wnd/wndutilities";
import WnDWorld = WnDUtilities.WnDWorld;
import { Consumables, MockOldTrainingGrounds, MockRootGP, MockRootTunnel, MockRootWnD, RiftRoot, RootTunnel, SacrificialAlter } from "../../typechain-types";

export default function() {}

describe("RiftRoot", function () {
    let _ownerWallet: SignerWithAddress;
    let _otherWallet: SignerWithAddress;

    let riftRoot: RiftRoot;
    let rootGP: MockRootGP;
    let rootSacrificialAlter: SacrificialAlter;
    let rootWnD: MockRootWnD;
    let rootConsumables: Consumables;
    let rootTunnel: MockRootTunnel;
    let oldTrainingGrounds: MockOldTrainingGrounds;

    beforeEach(async () => {
        Utilities.changeAutomineEnabled(true);

        let signers = await ethers.getSigners();
        _ownerWallet = signers[0];
        _otherWallet = signers[1];

        await deployments.fixture(['riftroot', 'sacrificialalter', 'consumables'], { fallbackToGlobal: false });

        riftRoot = await Utilities.getDeployedContract<RiftRoot>('RiftRoot', _ownerWallet);
        rootGP = await Utilities.getDeployedContract<MockRootGP>('MockRootGP', _ownerWallet);
        rootSacrificialAlter = await Utilities.getDeployedContract<SacrificialAlter>('SacrificialAlter', _ownerWallet);
        rootWnD = await Utilities.getDeployedContract<MockRootWnD>('MockRootWnD', _ownerWallet);
        rootConsumables = await Utilities.getDeployedContract<Consumables>('Consumables', _ownerWallet);
        rootTunnel = await Utilities.getDeployedContract<MockRootTunnel>('MockRootTunnel', _ownerWallet);
        oldTrainingGrounds = await Utilities.getDeployedContract<MockOldTrainingGrounds>('MockOldTrainingGrounds', _ownerWallet);

        await(await riftRoot.updateStakeSettings(0)).wait();
    });

    it("Should handle pre-deposit transfers", async function () {
        // Mint a bunch of stuff to deposit across to L2.
        await (await rootGP.mint(_ownerWallet.address, 100)).wait();
        await (await rootWnD.mint(_ownerWallet.address, 1)).wait();
        await (await rootSacrificialAlter.mint(1, 100, _ownerWallet.address)).wait();
        await (await rootConsumables.mint(2, 100, _ownerWallet.address)).wait();

        await (await rootSacrificialAlter.setApprovalForAll(riftRoot.address, true)).wait();

        await expect(riftRoot.transferToL2(101, [], [], [], [], []))
            .to.be.revertedWith("ERC20: burn amount exceeds balance");

        // Approve all of the transactions
        await rootWnD.approve(riftRoot.address, 1);
        await rootSacrificialAlter.setApprovalForAll(rootTunnel.address, true);
        await (await riftRoot.transferToL2(100, [1], [1], [100], [2], [100])).wait();

        // The 20's were burned.
        expect(await rootGP.totalSupply())
            .to.eq(0);
        expect(await rootWnD.ownerOf(1))
            .to.equal(riftRoot.address);
        expect(await rootSacrificialAlter.balanceOf(riftRoot.address, 1))
            .to.eq(100);
         expect(await rootConsumables.balanceOf(riftRoot.address, 2))
            .to.eq(100);
    });

    it("Should handle withdrawl transfers", async function () {
        // Mint a bunch of stuff to deposit across to L2.
        await (await rootGP.mint(_ownerWallet.address, 100)).wait();
        await (await rootWnD.mint(_ownerWallet.address, 1)).wait();
        await (await rootSacrificialAlter.mint(1, 100, _ownerWallet.address)).wait();
        await (await rootConsumables.mint(2, 100, _ownerWallet.address)).wait();

        await (await rootSacrificialAlter.setApprovalForAll(riftRoot.address, true)).wait();

        await expect(riftRoot.transferToL2(101, [], [], [], [], []))
            .to.be.revertedWith("ERC20: burn amount exceeds balance");

        // Approve all of the transactions
        await rootWnD.approve(riftRoot.address, 1);
        await rootSacrificialAlter.setApprovalForAll(rootTunnel.address, true);
        await (await riftRoot.transferToL2(100, [1], [1], [100], [2], [100])).wait();

        // Now let's pretend that we need to withdrawl them and transfer back from L2.
        await (await riftRoot.processMessageFromChild(_ownerWallet.address, 100, [1], [1], [100], [2], [100])).wait();

        // The 20's were re-minted
        expect(await rootGP.totalSupply())
            .to.eq(100);
        expect(await rootGP.balanceOf(_ownerWallet.address))
            .to.eq(100);
        expect(await rootWnD.ownerOf(1))
            .to.equal(_ownerWallet.address);
        expect(await rootSacrificialAlter.balanceOf(_ownerWallet.address, 1))
            .to.eq(100);
        expect(await rootConsumables.balanceOf(_ownerWallet.address, 2))
            .to.eq(100);
    });
});