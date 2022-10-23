import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunctionBase } from '../../utils/DeployFunctionBase';
import { NetworkHelper } from '../../utils/NetworkHelper';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'RootTunnel';
    public isProxy: boolean = false;

    public async getConstructorArgs(hre: HardhatRuntimeEnvironment): Promise<any[] | undefined> {
        return [
            NetworkHelper.isTestNet(hre.network) ? 
                "0x2890bA17EfE978480615e330ecB65333b880928e" : "0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287",
            NetworkHelper.isTestNet(hre.network) ? 
                "0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA" : "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
        ];
    }

    public async deployHook(hre: HardhatRuntimeEnvironment): Promise<void> {
        if(NetworkHelper.isUnitTests(hre.network)) {
            const deployer: string = (await hre.ethers.getSigners())[0].address;
            await this.deployContract(hre, 'MockRootTunnel', deployer, false);
        }
    }
});

export default script.deployFunc;
script.deployFunc.tags = ['roottunnel-deploy'];
script.deployFunc.dependencies = [];