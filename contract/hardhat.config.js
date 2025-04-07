require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

module.exports = {
  solidity: "0.8.28",
  networks: {
    'base-sepolia': {
      url: process.env.ALCHEMY_BASE_SEPOLIA,
      accounts: [ process.env.WALLET_KEY ]
    }
  },
  etherscan: {
   apiKey: {
    "base-sepolia": process.env.BASE_SEPOLIA_ETHERSCAN
   },
   customChains: [
     {
       network: "base-sepolia",
       chainId: 84532,
       urls: {
        apiURL: "https://api-sepolia.basescan.org/api",
        browserURL: "https://sepolia.basescan.org"
       }
     }
   ]
 },
};
