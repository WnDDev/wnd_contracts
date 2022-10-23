import { NetworkHelper } from '../../utils/NetworkHelper';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        if(!NetworkHelper.isUnitTests(this.hre?.network)) {
            await this.setAdminsIfNeeded('ChildTunnel', this.getContractAddresses('WnD', 'GP', 'SacrificialAlter', 'Consumables', 'Rift'));
        }

        await this.setMessageHandlerIfNeeded(this.getContractAddress('Rift'));
    }

    private async setMessageHandlerIfNeeded(riftAddress: string) {
        if(NetworkHelper.isUnitTests(this.hre?.network)) {
            return;
        }
        const messageHandler = await this.deployments?.read('ChildTunnel', `messageHandler`);
        if(messageHandler === riftAddress) {
            return;
        }

        await this.deployments?.execute(
            'ChildTunnel',
            { from: this.deployer, log: true },
            `setMessageHandler`,
            riftAddress
        );
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['childtunnel'];
script.setupFunc.dependencies = [
    'childtunnel-deploy', 'wndtoken-deploy', 'gptoken-deploy',
    'sacrificialalter-deploy', 'consumables-deploy', 'rift-deploy'
];
script.setupFunc.runAtTheEnd = true;