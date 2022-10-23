import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunctionBase } from '../../utils/DeployFunctionBase';
import { NetworkHelper } from '../../utils/NetworkHelper';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'RiftRoot';

    public async deployHook(hre: HardhatRuntimeEnvironment): Promise<void> {
        if(!NetworkHelper.isEthMainnet(hre.network)) {
            const deployer: string = (await hre.ethers.getSigners())[0].address;
            await this.deployContract(hre, 'MockRootWnD', deployer, false);
            await this.deployContract(hre, 'SacrificialAlter', deployer, true);
            await this.deployContract(hre, 'MockRootGP', deployer, false);
            await this.deployContract(hre, 'MockOldTrainingGrounds', deployer, false);
        }
    }
});

export default script.deployFunc;
script.deployFunc.tags = ['riftroot-deploy'];
script.deployFunc.dependencies = [];