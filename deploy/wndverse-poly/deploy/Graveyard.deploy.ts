import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'Graveyard';
});

export default script.deployFunc;
script.deployFunc.tags = ['graveyard-deploy'];
script.deployFunc.dependencies = [];