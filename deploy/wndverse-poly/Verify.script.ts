import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    if(hre.network.name === "hardhat") {
        console.log("deploy verify!");
        return;
    }

    try {
        await hre.run("etherscan-verify");
    } catch(error) {
        console.log(`Error verifying: ${error}`);
    }
};

export default func;
func.tags = ['verify'];
func.dependencies = [];
// deploy scripts will be first, wait until all are finished to run a verify
func.runAtTheEnd = true;