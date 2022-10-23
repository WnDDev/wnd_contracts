import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'TrainingGrounds';
});

export default script.deployFunc;
script.deployFunc.tags = ['traininggrounds-deploy'];
script.deployFunc.dependencies = [];