import { NetworkHelper } from '../../utils/NetworkHelper';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        if(NetworkHelper.isUnitTests(this.hre?.network)) {
            await this.setAdminsIfNeeded('RandomizerCL', this.getContractAddresses('Rift', 'TrainingGame', 'TrainingGrounds'));
        }
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['randomizercl'];
script.setupFunc.dependencies = [
    'randomizercl-deploy', 'rift-deploy', 'traininggame-deploy', 'traininggrounds-deploy'
];
script.setupFunc.runAtTheEnd = true;