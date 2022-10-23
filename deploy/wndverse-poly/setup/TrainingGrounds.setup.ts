import { NetworkHelper } from '../../utils/NetworkHelper';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        const randomizerContract = NetworkHelper.isUnitTests(this.hre?.network) ? 'MockRandomizerCL' : 'RandomizerCL';
        await this.unpauseContractIfNeeded('TrainingGrounds');
        await this.setContractsIfNeeded('TrainingGrounds', 
            this.getContractAddresses('World', 'SacrificialAlter', 'GP', 'TrainingProficiency', 'TrainingGame', randomizerContract)
        );
        await this.setAdminsIfNeeded('TrainingGrounds', 
            this.getContractAddresses('World', 'Rift', 'TrainingProficiency', 'TrainingGame')
        );
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['traininggrounds'];
script.setupFunc.dependencies = [
    'traininggrounds-deploy', 'gptoken-deploy', 'rift-deploy', 'world-deploy',
    'trainingproficiency-deploy', 'traininggame-deploy', 'randomizercl-deploy',
    'sacrificialalter-deploy'
];
script.setupFunc.runAtTheEnd = true;