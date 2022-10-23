import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'World';
});

export default script.deployFunc;
script.deployFunc.tags = ['world-deploy'];
script.deployFunc.dependencies = [];