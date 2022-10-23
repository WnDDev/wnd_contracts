import { NetworkHelper } from '../../utils/NetworkHelper';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        const childTunnelContract = NetworkHelper.isUnitTests(this.hre?.network) ? 'MockChildTunnel' : 'ChildTunnel';
        const randomizerContract = NetworkHelper.isUnitTests(this.hre?.network) ? 'MockRandomizerCL' : 'RandomizerCL';
        await this.setAdminsIfNeeded('Rift', 
            this.getContractAddresses('World', 'TrainingProficiency', 'TrainingGrounds', 'TrainingGame', 'ChildTunnel')
        );
        await this.setContractsIfNeeded('Rift', 
            this.getContractAddresses('World', 'WnD', 'TrainingProficiency', randomizerContract, childTunnelContract, 'GP', 'SacrificialAlter', 'Consumables')
        );
        await this.unpauseContractIfNeeded('Rift');
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['rift'];
script.setupFunc.dependencies = [
    'rift-deploy', 'world-deploy', 'trainingproficiency-deploy', 'traininggrounds-deploy', 'traininggame-deploy',
    'childtunnel-deploy', 'wndtoken-deploy', 'randomizercl-deploy', 'gptoken-deploy', 'sacrificialalter-deploy',
    'consumables-deploy'
];
script.setupFunc.runAtTheEnd = true;