import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Utilities } from "../utilities";
import { WnDUtilities } from "../wnd/wndutilities";
import { MerkleTree } from "merkletreejs";
const keccak256 = require("keccak256");
import { Consumables, LootCrates } from "../../typechain-types";
import { BigNumber } from "ethers";

export default function() {}

describe("LootCrates", function () {
    let _ownerWallet: SignerWithAddress;
    let _otherWallet: SignerWithAddress;
    let lootCrates: LootCrates;
    let consumables: Consumables;

    beforeEach(async () => {
        Utilities.changeAutomineEnabled(true);
        await deployments.fixture(['lootcrates', 'consumables'], { fallbackToGlobal: false });

        let signers = await ethers.getSigners();
        _ownerWallet = signers[0];
        _otherWallet = signers[1];

        lootCrates = await Utilities.getDeployedContract<LootCrates>('LootCrates', _ownerWallet);
        consumables = await Utilities.getDeployedContract<Consumables>('Consumables', _ownerWallet);
    });

    it("Should be able to claim a merkle allowed address", async function () {
        const tokenId = 1;
        const amtClaimable: number = 4;
        let wl: [[string, number, number]] = [
            [_otherWallet.address, tokenId, amtClaimable]
        ];

        let wlLeaves = wl.map((item: [string, number, number]) =>
          ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], item)
        );
      
        const merkleTree = new MerkleTree(wlLeaves, keccak256, {
            sortPairs: false,
        });
        const merkleRoot = merkleTree.getHexRoot();
    
        const proofs = [];
        for (let index = 0; index < wlLeaves.length; index++) {
            const leaf = wlLeaves[index];
            const proof = merkleTree.getHexProof(leaf);
        
            proofs.push({
                wallet: wlLeaves[index][0],
                amount: wlLeaves[index][1],
                proof: proof,
            });
        }

        await expect(lootCrates.setMerkleForCrate(tokenId, merkleRoot))
            .to.emit(lootCrates, "MerkleRootSet")
            .withArgs(tokenId, merkleRoot);

        await expect(lootCrates.connect(_otherWallet).claimBoxes(tokenId, amtClaimable, proofs[0].proof))
            .to.emit(lootCrates, "CratesClaimed")
            .withArgs(_otherWallet.address, tokenId, amtClaimable);

        expect(await consumables.balanceOf(_otherWallet.address, tokenId))
            .to.equal(amtClaimable);
        
        await expect(lootCrates.connect(_otherWallet).claimBoxes(tokenId, amtClaimable, proofs[0].proof))
            .to.be.revertedWithCustomError(lootCrates, "NoneToClaimError");
    });

    it("Should be able to finish staking non-gen0 wizard that succeedes", async function () {
    });
});