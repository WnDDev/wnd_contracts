import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber } from 'ethers';
import { MerkleTree } from "merkletreejs";
const keccak256 = require("keccak256");
const fsPromises = require("fs/promises");

import { NetworkHelper } from '../../utils/NetworkHelper';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
      console.log("SwiperSwiping setup");
      await this.unpauseContractIfNeeded('SwiperSwiping');

      const wndRootAddress = NetworkHelper.isEthMainnet(this.hre?.network) ? '0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab'
        : this.getContractAddress('WnD');
      const tower1Address = NetworkHelper.isEthMainnet(this.hre?.network) ? "0xF042A49FB03cb9D98CbA9DEf8711CEE85dC72281"
        : this.getContractAddress('MockTower1');
      const trainingGroundsAddress = NetworkHelper.isEthMainnet(this.hre?.network) ? "0xeeA43B892D4593E7C44530dB1f75b0519Db0BD50"
        : this.getContractAddress('MockOldTrainingGrounds');

      await this.setContractsIfNeeded('SwiperSwiping', wndRootAddress, tower1Address, trainingGroundsAddress);
      await this.setAdminsIfNeeded('WnD', this.getContractAddress('SwiperSwiping'));

      if(!NetworkHelper.isUnitTests(this.hre?.network)) {
        await this.setMerkles();
      }
    }

    private async setMerkles(): Promise<void> {
      if(this.hre === undefined) {
        throw new Error('Critical error: hre not set');
      }
      const hre: HardhatRuntimeEnvironment = this.hre;
      const { read, execute } = hre.deployments;
      const tower1Buffer: any[] = await fsPromises.readFile(`./data/analytics/walletsInTower1Verified.json`);
      const tower1List: [ {
        address: string,
        tokenIds: number[]
      } ] = JSON.parse(tower1Buffer.toString());

      const tgBuffer: any[] = await fsPromises.readFile(`./data/analytics/walletsInTower2Verified.json`);
      const tgList: [ {
        address: string,
        tokenIds: number[]
      } ] = JSON.parse(tgBuffer.toString());

      const flattenedTower1List: { address: string, tokenId: number }[] = [];
      for (let i = 0; i < tower1List.length; i++) {
        const wallet = tower1List[i];
        for (let j = 0; j < wallet.tokenIds.length; j++) {
          const tokenId = wallet.tokenIds[j];
          flattenedTower1List.push({
            address: wallet.address,
            tokenId
          });
        }
      }

      const flattenedTower2List: { address: string, tokenId: number }[] = [];
      for (let i = 0; i < tgList.length; i++) {
        const wallet = tgList[i];
        for (let j = 0; j < wallet.tokenIds.length; j++) {
          const tokenId = wallet.tokenIds[j];
          flattenedTower2List.push({
            address: wallet.address,
            tokenId
          });
        }
      }

      let whitelistTower1 = flattenedTower1List.map((item) =>
          hre.ethers.utils.solidityKeccak256(["address", "uint256"], [item.address, item.tokenId])
      );

      let whitelistTG = flattenedTower2List.map((item) =>
          hre.ethers.utils.solidityKeccak256(["address", "uint256"], [item.address, item.tokenId])
      );

      const merkleTreeTower1 = new MerkleTree(whitelistTower1, keccak256, {
          sortPairs: true,
      });
      const merkleTreeTG = new MerkleTree(whitelistTG, keccak256, {
          sortPairs: true,
      });

      const rootTower1 = merkleTreeTower1.getHexRoot();
      const rootTG = merkleTreeTG.getHexRoot();

      if(await read("SwiperSwiping", "merkleRootTower1") != rootTower1) {
          await execute(
            "SwiperSwiping",
            { from: this.deployer, log: true },
            "setMerkleRootTower1",
            rootTower1
          );
      }

      if(await read("SwiperSwiping", "merkleRootTower2") != rootTG) {
          await execute(
            "SwiperSwiping",
            { from: this.deployer, log: true },
            "setMerkleRootTower2",
            rootTG
          );
      }

      const proofsTower1 = [];
  
      for (let i = 0; i < whitelistTower1.length; i++) {
        const leaf = whitelistTower1[i];
        const proof = merkleTreeTower1.getHexProof(leaf);
  
        proofsTower1.push({
          wallet: flattenedTower1List[i].address,
          tokenId: flattenedTower1List[i].tokenId,
          proof: proof,
        });
      }

      const proofsTG = [];
  
      for (let i = 0; i < whitelistTG.length; i++) {
        const leaf = whitelistTG[i];
        const proof = merkleTreeTG.getHexProof(leaf);
  
        proofsTG.push({
          wallet: flattenedTower2List[i].address,
          tokenId: flattenedTower2List[i].tokenId,
          proof: proof,
        });
      }
  
      await fsPromises.writeFile("./data/proofs/tower1ClaimSingleToken.json", JSON.stringify(proofsTower1));
      await fsPromises.writeFile("./data/proofs/tower2ClaimSingleToken.json", JSON.stringify(proofsTG));
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['swiperswiping'];
script.setupFunc.dependencies = [
    'swiperswiping-deploy', 'wndtoken-deploy'
];
script.setupFunc.runAtTheEnd = true;