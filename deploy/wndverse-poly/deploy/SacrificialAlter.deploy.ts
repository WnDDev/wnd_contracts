import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'SacrificialAlter';
});

export default script.deployFunc;
script.deployFunc.tags = ['sacrificialalter-deploy'];
script.deployFunc.dependencies = [];