import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.setContractsIfNeeded('Graveyard', this.getContractAddresses('WnD', 'Consumables', 'World', 'TrainingGame'));
        await this.setAdminsIfNeeded('Graveyard', this.getContractAddress('TrainingGame'));
        await this.unpauseContractIfNeeded('Graveyard');
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['graveyard'];
script.setupFunc.dependencies = [
    'graveyard-deploy', 'wndtoken-deploy', 'consumables-deploy',
    'world-deploy', 'traininggame-deploy'
];
script.setupFunc.runAtTheEnd = true;