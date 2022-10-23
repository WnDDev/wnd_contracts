import { NetworkHelper } from '../../utils/NetworkHelper';
import { SetupFunctionBase } from '../../utils/SetupFunctionBase';

const script: SetupFunctionBase = new (class extends SetupFunctionBase {
    public forceSetContracts: boolean = false;

    public async runScript(): Promise<boolean | void> {
        const wndRootAddress = NetworkHelper.isEthMainnet(this.hre?.network) ? '0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab'
          : this.getContractAddress('MockRootWnD');
        const gpRootAddress = NetworkHelper.isEthMainnet(this.hre?.network) ? "0x38Ec27c6F05a169e7eD03132bcA7d0cfeE93C2C5"
          : this.getContractAddress('MockRootGP');
        const saRootAddress = NetworkHelper.isEthMainnet(this.hre?.network) ? "0xFa1A07056C48DCbA4B5E9e71aACC6aa791A93929"
          : this.getContractAddress('SacrificialAlter');
        const oldTrainingGroundsAddress = NetworkHelper.isEthMainnet(this.hre?.network) ? "0xeeA43B892D4593E7C44530dB1f75b0519Db0BD50"
          : this.getContractAddress('MockOldTrainingGrounds');

          const rootTunnelContract = NetworkHelper.isUnitTests(this.hre?.network) ? 'MockRootTunnel' : 'RootTunnel';

        await this.setAdminsIfNeeded('RiftRoot', this.getContractAddress(rootTunnelContract));
        await this.setContractsIfNeeded('RiftRoot', gpRootAddress, wndRootAddress, saRootAddress,
            ...this.getContractAddresses('Consumables', rootTunnelContract), oldTrainingGroundsAddress
        );
        await this.unpauseContractIfNeeded('RiftRoot');
    }
});

export default script.setupFunc;
script.setupFunc.tags = ['riftroot'];
script.setupFunc.dependencies = ['riftroot-deploy', 'roottunnel-deploy', 'consumables-deploy'];
script.setupFunc.runAtTheEnd = true;