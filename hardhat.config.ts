import "dotenv/config";
import {HardhatUserConfig} from "hardhat/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const {subtask} = require("hardhat/config");
const {TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS} = require("hardhat/builtin-tasks/task-names")

subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS)
  .setAction(async (_: any, __: any, runSuper: any) => {
    const paths: any[] = await runSuper();

    return paths.filter(p => !p.endsWith(".t.sol"));
  });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
              "enabled": true,
              "runs": 200
          }
        }
      }
    ]
  },
  networks: {
    mainnet: {
      url: `${process.env.MAINNET_ANKR_URL}`,
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gas: 24000000,
      gasPrice: 220000000000,
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      timeout: 120000,
      live: true,
      saveDeployments: true,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_URL || "",
      timeout: 120000,
      live: true,
      saveDeployments: true,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      timeout: 120000,
      live: true,
      saveDeployments: true,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY
    }
  },
  paths: {
    artifacts: "artifacts",
    cache: "hh-cache",
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
    sources: "contracts",
    tests: "test",
  },
};

export default config;
