import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'LootCrates';
});

export default script.deployFunc;
script.deployFunc.tags = ['lootcrates-deploy'];
script.deployFunc.dependencies = [];