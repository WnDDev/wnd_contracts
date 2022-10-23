import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Utilities } from "../utilities";
import { WnDUtilities } from "../wnd/wndutilities";
import {MerkleTree} from 'merkletreejs';
const keccak256 = require('keccak256');
import WnDWorld = WnDUtilities.WnDWorld;
import WorldLocation = WnDUtilities.WorldLocation;
import { MockOldTrainingGrounds, MockRandomizerCL, MockTower1, Rift, SacrificialAlter, SwiperSwiping, WnD, World } from "../../typechain-types";
import { BigNumber } from "ethers";

export default function() {}

describe("SwiperSwiping", function () {
    let _ownerWallet: SignerWithAddress;
    let _otherWallet: SignerWithAddress;
    let _unauthWallet: SignerWithAddress;

    let swiper: SwiperSwiping;
    let tower1: MockTower1;
    let oldTrainingGrounds: MockOldTrainingGrounds;
    let wnd: WnD;

    beforeEach(async () => {
        Utilities.changeAutomineEnabled(true);

        let signers = await ethers.getSigners();
        _ownerWallet = signers[0];
        _otherWallet = signers[1];
        _unauthWallet = signers[2];

        const dep = await deployments.fixture(['swiperswiping', 'wndtoken'], { fallbackToGlobal: false });

        swiper = await Utilities.getDeployedContract<SwiperSwiping>('SwiperSwiping', _ownerWallet);
        tower1 = await Utilities.getDeployedContract<MockTower1>('MockTower1', _ownerWallet);
        oldTrainingGrounds = await Utilities.getDeployedContract<MockOldTrainingGrounds>('MockOldTrainingGrounds', _ownerWallet);
        wnd = await Utilities.getDeployedContract<WnD>('WnD', _ownerWallet);

        await wnd.addAdmin(oldTrainingGrounds.address);

    });

    it("Can claim tokens in tower1 contract from merkle", async function () {
        const ownerTokenIds = [1, 44, 45, 46, 43, 33, 34, 35, 36, 66, 65, 64, 63, 500, 9999, 4589];
        const otherTokenIds = [2];
        const unauthTokenIds = [3, 4];
        await mintTokens(tower1.address, ownerTokenIds);
        await mintTokens(tower1.address, otherTokenIds);
        await mintTokens(tower1.address, unauthTokenIds);
        let wallets = [
            { address: _ownerWallet.address, tokenIds: ownerTokenIds},
            { address: _otherWallet.address, tokenIds: otherTokenIds},
        ];
      
        await claimAllForWallets(true, wallets);
    });

    it("Can claim tokens in tower2 contract from merkle", async function () {

        const ownerTokenIds = [1, 44, 45, 46, 43, 33, 34, 35, 36, 66, 65, 64, 63, 500, 9999, 4589];
        const otherTokenIds = [2, 11, 12, 13, 14, 15, 16, 21, 22, 23, 24, 25, 26, 27, 28, 31, 51, 52, 53];
        const unauthTokenIds = [3, 4];
        await mintTokens(oldTrainingGrounds.address, ownerTokenIds);
        await mintTokens(oldTrainingGrounds.address, otherTokenIds);
        await mintTokens(oldTrainingGrounds.address, unauthTokenIds);
        let wallets = [
            { address: _ownerWallet.address, tokenIds: ownerTokenIds},
            { address: _otherWallet.address, tokenIds: otherTokenIds},
        ];
      
        await claimAllForWallets(false, wallets);
    });

    async function claimAllForWallets(isTower1: boolean, wallets: { address: string, tokenIds: number[] }[]) {
        const flattenedList = [];
        for (let i = 0; i < wallets.length; i++) {
            const wallet = wallets[i]
            for (let j = 0; j < wallet.tokenIds.length; j++) {
              const tokenId = wallet.tokenIds[j];
              flattenedList.push({
                address: wallet.address,
                tokenId
              });
            }
        }

        let whitelist = flattenedList.map((item) => 
            ethers.utils.solidityKeccak256(["address", "uint256"], [item.address, item.tokenId])
        );

        const merkleTree = new MerkleTree(whitelist, keccak256, { sortPairs: true });
        const root = merkleTree.getHexRoot();
        
        if(isTower1) {
            await swiper.setMerkleRootTower1(root);
        }
        else {
            await swiper.setMerkleRootTower2(root);
        }

        const towerStartingBalance: BigNumber = await wnd.balanceOf(isTower1 ? tower1.address : oldTrainingGrounds.address);
        let totalTokensToClaim: number = 0;
        const walletBalances: Map<String, number> = new Map();
    
        for (let i = 0; i < whitelist.length; i++) {
            const wallet = flattenedList[i].address;
            const tokenId = BigNumber.from(flattenedList[i].tokenId);
            totalTokensToClaim++;
        
            const leaf = ethers.utils.solidityKeccak256(["address", "uint256"], [wallet, tokenId]);
            expect(leaf).to.equal(whitelist[i]);
            const proof = merkleTree.getHexProof(leaf);

            if(isTower1) {
                await expect(swiper.connect(_unauthWallet).claimTower1([{tokenId, proof}]))
                    .to.be.revertedWith("Proof invalid");
    
                await expect(swiper.connect(ethers.provider.getSigner(wallet)).claimTower2([{tokenId, proof}]))
                    .to.be.revertedWith("no tokens were rescued");

                while((await swiper.getTokenIdsToClaimTower1(wallet, [tokenId])).filter(x => x.toNumber() != 0).length > 0) {
                    await swiper.connect(ethers.provider.getSigner(wallet)).claimTower1([{tokenId, proof}]);
                    walletBalances.set(wallet, (walletBalances.get(wallet) ?? 0) + 1);
                }
            }
            else {
                await expect(swiper.connect(_unauthWallet).claimTower2([{tokenId, proof}]))
                    .to.be.revertedWith("Proof invalid");
    
                await expect(swiper.connect(ethers.provider.getSigner(wallet)).claimTower1([{tokenId, proof}]))
                    .to.be.revertedWith("no tokens were rescued");

                while ((await swiper.getTokenIdsToClaimTower2(wallet, [tokenId])).filter(x => x.toNumber() != 0).length > 0) {
                    await swiper.connect(ethers.provider.getSigner(wallet)).claimTower2([{tokenId, proof}]);
                    walletBalances.set(wallet, (walletBalances.get(wallet) ?? 0) + 1);
                }
            }

            if(isTower1) {
                await expect(swiper.connect(ethers.provider.getSigner(wallet)).claimTower1([{tokenId, proof}]))
                    .to.be.revertedWith("no tokens were rescued");
                expect((await swiper.getTokenIdsToClaimTower1(wallet, [tokenId])).filter(x => x.toNumber() != 0).length, "Number of tokens pending claim")
                    .to.equal(0);
            }
            else {
                await expect(swiper.connect(ethers.provider.getSigner(wallet)).claimTower2([{tokenId, proof}]))
                    .to.be.revertedWith("no tokens were rescued");
                expect((await swiper.getTokenIdsToClaimTower2(wallet, [tokenId])).filter(x => x.toNumber() != 0).length, "Number of tokens pending claim")
                    .to.equal(0);
            }
            
            expect(await wnd.balanceOf(wallet), "Number of tokens in wallet")
                .to.be.equal(walletBalances.get(wallet));
        }
        expect(towerStartingBalance.sub(await wnd.balanceOf(isTower1 ? tower1.address : oldTrainingGrounds.address)), "Number of tokens pulled out of contract")
            .to.be.equal(totalTokensToClaim);
    }

    async function mintTokens(addr: string, tokenIds: number[]) {
        for (let i = 0; i < tokenIds.length; i++) {
            const token = tokenIds[i];
            await wnd.mint(addr, token, WnDUtilities.getWizardDragon(true));
        }
    }
});