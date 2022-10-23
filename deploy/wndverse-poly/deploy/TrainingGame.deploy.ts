import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'TrainingGame';
});

export default script.deployFunc;
script.deployFunc.tags = ['traininggame-deploy'];
script.deployFunc.dependencies = [];