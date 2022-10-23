import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'Rift';
});

export default script.deployFunc;
script.deployFunc.tags = ['rift-deploy'];
script.deployFunc.dependencies = [];