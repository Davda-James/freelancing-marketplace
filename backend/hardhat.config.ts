import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50,
      },
    },
  },
  networks: {
    localhost: {
      url: process.env.RPC_URL,
    },
    arbitrumSepolia: {
      url: process.env.RPC_URL,
      // accounts: [process.env.PRIVATE_KEY!],
      chainId: 421614
    },
  },
};

export default config;
