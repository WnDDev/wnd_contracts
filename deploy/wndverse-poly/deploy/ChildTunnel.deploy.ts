import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunctionBase } from '../../utils/DeployFunctionBase';
import { NetworkHelper } from '../../utils/NetworkHelper';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'ChildTunnel';
    public isProxy: boolean = false;

    public async getConstructorArgs(hre: HardhatRuntimeEnvironment): Promise<any[] | undefined> {
        return [ 
            NetworkHelper.isTestNet(hre.network) ? 
            "0xCf73231F28B7331BBe3124B907840A94851f9f11" : "0x8397259c983751DAf40400790063935a11afa28a"
        ];
    }

    public async deployHook(hre: HardhatRuntimeEnvironment): Promise<void> {
        if(NetworkHelper.isUnitTests(hre.network)) {
            const deployer: string = (await hre.ethers.getSigners())[0].address;
            await this.deployContract(hre, 'MockChildTunnel', deployer, false);
        }
    }
});

export default script.deployFunc;
script.deployFunc.tags = ['childtunnel-deploy'];
script.deployFunc.dependencies = [];