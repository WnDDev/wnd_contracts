import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'Consumables';
});

export default script.deployFunc;
script.deployFunc.tags = ['consumables-deploy'];
script.deployFunc.dependencies = [];