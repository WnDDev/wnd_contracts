import { BigNumber } from 'ethers';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.setupConsumableIdsIfNeeded();

        await this.setAdminsIfNeeded('Consumables', this.getContractAddresses('RootTunnel', 'RiftRoot'));
        await this.unpauseContractIfNeeded('Consumables');
    }

    private async setupConsumableIdsIfNeeded() {
        for(var i = 1; i <= 6; i++) {
            let typeInfo = await this.deployments?.read('Consumables', `typeInfo`, i);
            if(!typeInfo.maxSupply.eq(0)) {
                continue;
            }

            await this.deployments?.execute(
                'Consumables',
                { from: this.deployer, log: true },
                `setType`,
                i,
                BigNumber.from("0xffffffffffffffffffffffffffffffff")
            );
        }
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['consumables'];
script.setupFunc.dependencies = ['consumables-deploy', 'roottunnel-deploy', 'riftroot-deploy'];
script.setupFunc.runAtTheEnd = true;