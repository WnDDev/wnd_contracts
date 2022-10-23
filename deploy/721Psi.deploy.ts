import { DeployFunctionBase } from './utils/DeployFunctionBase';

const script: DeployFunctionBase = new (class extends DeployFunctionBase {
    public contractName: string = 'Psi721';
    public isProxy: boolean = false;
});

export default script.deployFunc;
script.deployFunc.tags = ['721psi-deploy'];
script.deployFunc.dependencies = [];
