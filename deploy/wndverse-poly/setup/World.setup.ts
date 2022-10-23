import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.unpauseContractIfNeeded('World');
        await this.setContractsIfNeeded('World',
            this.getContractAddresses('TrainingGrounds', 'WnD', 'Rift')
        );
        await this.setAdminsIfNeeded('World', 
            this.getContractAddresses('Rift', 'TrainingProficiency', 'TrainingGrounds', 'Graveyard')
        );
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['world'];
script.setupFunc.dependencies = [
    'world-deploy', 'traininggrounds-deploy', 'wndtoken-deploy', 'rift-deploy',
    'trainingproficiency-deploy', 'graveyard-deploy'
];
script.setupFunc.runAtTheEnd = true;