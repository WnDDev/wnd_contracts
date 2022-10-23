import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'WnD';
});

export default script.deployFunc;
script.deployFunc.tags = ['wndtoken-deploy'];
script.deployFunc.dependencies = [];
