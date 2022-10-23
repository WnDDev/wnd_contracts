import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'GP';
});

export default script.deployFunc;
script.deployFunc.tags = ['gptoken-deploy'];
script.deployFunc.dependencies = [];