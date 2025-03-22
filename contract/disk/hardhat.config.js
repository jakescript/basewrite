require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

module.exports = {
  solidity: "0.8.28",
  networks: {
    'base-sepolia': {
      url: process.env.ALCHEMY_BASE_SEPOLIA,
      accounts: [ process.env.WALLET_KEY ]
    }
  }
};
