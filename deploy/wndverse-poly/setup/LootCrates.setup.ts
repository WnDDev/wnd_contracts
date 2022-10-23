import { NetworkHelper } from '../../utils/NetworkHelper';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        await this.setContractsIfNeeded('LootCrates', this.getContractAddresses('Consumables'));
        await this.setAdminsIfNeeded('Consumables', this.getContractAddress('LootCrates'));
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['lootcrates'];
script.setupFunc.dependencies = [
    'lootcrates-deploy', 'consumables-deploy'
];
script.setupFunc.runAtTheEnd = true;