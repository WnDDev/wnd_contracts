import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.setContractsIfNeeded('WnD',this.getContractAddress('Traits'));
        await this.setAdminsIfNeeded('WnD', 
            ...this.getContractAddresses('Rift', 'World', 'TrainingProficiency', 'TrainingGame', 'TrainingGrounds', 'Graveyard')
        );
        await this.unpauseContractIfNeeded('WnD');
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['wndtoken'];
script.setupFunc.dependencies = [
    'wndtoken-deploy', 'traits-deploy', 'rift-deploy', 'world-deploy', 'trainingproficiency-deploy',
    'traininggame-deploy', 'traininggrounds-deploy', 'graveyard-deploy'
];
script.setupFunc.runAtTheEnd = true;