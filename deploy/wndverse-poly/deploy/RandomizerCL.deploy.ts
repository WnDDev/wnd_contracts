import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunctionBase } from '../../utils/DeployFunctionBase';
import { NetworkHelper } from '../../utils/NetworkHelper';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'RandomizerCL';
    public isProxy: boolean = false;

    public async getConstructorArgs(hre: HardhatRuntimeEnvironment): Promise<any[] | undefined> {
        var vrfCoordinator = NetworkHelper.isTestNet(hre.network)
            ? "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255"
            : "0x3d2341ADb2D31f1c5530cDC622016af293177AE0";

        var linkAddress = NetworkHelper.isTestNet(hre.network)
            ? "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
            : "0xb0897686c545045aFc77CF20eC7A532E3120E0F1";

        var keyHash = NetworkHelper.isTestNet(hre.network)
            ? "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4"
            : "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da";
        return [vrfCoordinator, linkAddress, keyHash];
    }

    public async deployHook(hre: HardhatRuntimeEnvironment): Promise<void> {
        if(NetworkHelper.isUnitTests(hre.network)) {
            const deployer: string = (await hre.ethers.getSigners())[0].address;
            await this.deployContract(hre, 'MockRandomizerCL', deployer, false);
        }
    }
});

export default script.deployFunc;
script.deployFunc.tags = ['randomizercl-deploy'];
script.deployFunc.dependencies = [];