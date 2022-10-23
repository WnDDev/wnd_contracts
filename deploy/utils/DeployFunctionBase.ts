import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, Deployment, DeploymentsExtension } from 'hardhat-deploy/types';

export abstract class DeployFunctionBase {
    public abstract contractName: string;
    public isProxy: boolean = true;

    public deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
        const deployer: string = (await hre.ethers.getSigners())[0].address;

        await this.deployContract(hre, this.contractName, deployer, this.isProxy, await this.getConstructorArgs(hre));

        await this.deployHook(hre);
    };

    public async deployContract(hre: HardhatRuntimeEnvironment, contract: string, deployer: string, isProxy: boolean, ...args: any[]): Promise<void> {
        if(args.length > 0 && Array.isArray(args[0])) {
            args = args[0];
        }
        await hre.deployments.deploy(contract, {
            from: deployer,
            log: true,
            proxy: isProxy ? {
                owner: deployer,
                proxyContract: 'OpenZeppelinTransparentProxy',
                execute: {
                    init: {
                        methodName: "initialize",
                        args: []
                    }
                }
            } : undefined,
            args: args.length == 0 || args[0] === undefined ? undefined : args
        });
    }

    public async getConstructorArgs(hre: HardhatRuntimeEnvironment): Promise<any[] | undefined> {
        return undefined;
    }

    public async deployHook(hre: HardhatRuntimeEnvironment): Promise<void> {}
}