import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'Traits';
});

export default script.deployFunc;
script.deployFunc.tags = ['traits-deploy'];
script.deployFunc.dependencies = [];