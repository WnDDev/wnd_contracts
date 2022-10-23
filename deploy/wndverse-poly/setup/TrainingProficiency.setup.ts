import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.unpauseContractIfNeeded('TrainingProficiency');
        await this.setAdminsIfNeeded('TrainingProficiency', 
            this.getContractAddresses('World', 'Rift', 'TrainingGrounds', 'TrainingGame')
        );
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['trainingproficiency'];
script.setupFunc.dependencies = [
    'trainingproficiency-deploy', 'world-deploy', 'rift-deploy', 'traininggame-deploy', 'traininggrounds-deploy'
];
script.setupFunc.runAtTheEnd = true;