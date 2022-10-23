import { DeployFunctionBase } from '../../utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'TrainingProficiency';
});

export default script.deployFunc;
script.deployFunc.tags = ['trainingproficiency-deploy'];
script.deployFunc.dependencies = [];