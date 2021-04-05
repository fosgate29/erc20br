import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "solidity-coverage"

/*const ALCHEMY_API_KEY = "";
const RINKEBY_PRIVATE_KEY =
  "";*/

const config: HardhatUserConfig = {
  solidity: {
    version: "0.7.6",
  },
  networks: {
    hardhat: {},
    /*rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
    },*/
    coverage: {
      url: 'http://localhost:5458',
    },
  },
  paths: {
    sources: "src",
  },
};

export default config;