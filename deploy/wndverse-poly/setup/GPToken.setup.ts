import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.setAdminsIfNeeded('GP', 
            ...this.getContractAddresses('Rift', 'World', 'TrainingProficiency', 'TrainingGame', 'TrainingGrounds')
        );
        await this.unpauseContractIfNeeded('GP');
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['gptoken'];
script.setupFunc.dependencies = [
    'gptoken-deploy', 'wndtoken-deploy', 'rift-deploy', 'world-deploy',
    'trainingproficiency-deploy', 'traininggame-deploy', 'traininggrounds-deploy'
];
script.setupFunc.runAtTheEnd = true;