import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber } from 'ethers';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { DeployFunctionBase } from '../../utils/DeployFunctionBase';
import { NetworkHelper } from '../../utils/NetworkHelper';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'SwiperSwiping';

    public async deployHook(hre: HardhatRuntimeEnvironment): Promise<void> {
        if(!NetworkHelper.isEthMainnet(hre.network)) {
            const deployer: string = (await hre.ethers.getSigners())[0].address;
            await this.deployContract(hre, 'MockTower1', deployer, false);
            await this.deployContract(hre, 'MockOldTrainingGrounds', deployer, false);
        }
    }
});

export default script.deployFunc;
script.deployFunc.tags = ['swiperswiping-deploy'];
script.deployFunc.dependencies = [];
script.deployFunc.runAtTheEnd = true;