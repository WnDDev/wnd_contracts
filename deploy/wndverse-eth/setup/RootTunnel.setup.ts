import { NetworkHelper } from '../../utils/NetworkHelper';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        if(!NetworkHelper.isUnitTests(this.hre?.network)) {
            await this.setAdminsIfNeeded('RootTunnel', this.getContractAddress('RiftRoot'));
        }
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['roottunnel'];
script.setupFunc.dependencies = ['roottunnel-deploy', 'riftroot-deploy'];
script.setupFunc.runAtTheEnd = true;