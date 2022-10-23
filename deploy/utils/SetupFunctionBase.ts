import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, Deployment, DeploymentsExtension } from 'hardhat-deploy/types';
import { NetworkHelper } from './NetworkHelper';

export abstract class SetupFunctionBase {
    public abstract runScript(): Promise<void | boolean>;
    public abstract forceSetContracts: boolean;
    protected hre?: HardhatRuntimeEnvironment;
    protected deployments?: DeploymentsExtension;
    protected deployer: string = '';
    protected deployedAddresses: { [contractName: string]: Deployment} = {};

    public setupFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
        this.hre = hre;
        ({ deployments: this.deployments } = hre);
        this.deployer = (await hre.ethers.getSigners())[0].address;
        await this.fillAddresses();
        await this.runScript();
    };

    protected async fillAddresses(): Promise<void> {
        if(this.deployments === undefined) {
            throw new Error(`Deployments not found, invalid state.`);
        }
        this.deployedAddresses = await this.deployments.all();
    }

    public getContractAddresses(...contracts: string[]): string[] {
        let ret: string[] = [];
        contracts.forEach(contract => {
            if(this.deployedAddresses[contract] === undefined) {
                throw Error(`Contract: ${contract} was not found in list of deployments.`);
            }
            ret = [...ret, this.deployedAddresses[contract].address];
        });
        return ret;
    }

    public getContractAddress(contract: string): string {
        if(this.deployedAddresses[contract] === undefined) {
            throw Error(`Contract: ${contract} was not found in list of deployments.`);
        }
        return this.deployedAddresses[contract].address;
    }

    public async setContractsIfNeeded(contract: string, ...args: any[]): Promise<void> {
        if(args.length > 0 && Array.isArray(args[0])) {
            args = args[0];
        }
        if(this.forceSetContracts || !(await this.deployments?.read(contract, `areContractsSet`))) {
            await this.deployments?.execute(
                contract,
                { from: this.deployer, log: true },
                `setContracts`,
                ...args
            );
        }
    }

    public async setAdminsIfNeeded(contract: string, ...args: any[]): Promise<void> {
        if(args.length > 0 && Array.isArray(args[0])) {
            args = args[0];
        }
        var addressesToAdd = new Array<string>();
        for(var i = 0; i < args.length; i++) {
            let address = args[i];

            if(!(await this.deployments?.read(contract, `isAdmin`, address))) {
                addressesToAdd.push(address);
            }
        }

        if(addressesToAdd.length > 0) {
            await this.deployments?.execute(
                contract,
                { from: this.deployer, log: true },
                `addAdmins`,
                addressesToAdd
            );
        }
    }

    public async unpauseContractIfNeeded(contract: string): Promise<any> {
        if(await this.deployments?.read(contract, `paused`)) {
            await this.deployments?.execute(
                contract,
                { from: this.deployer, log: true },
                `setPause`,
                false
            );
        }
    }
}
