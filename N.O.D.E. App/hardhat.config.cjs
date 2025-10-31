/**
 * Hardhat Configuration for N.O.D.E. Contracts
 * 
 * Compiles Solidity contracts and prepares them for deployment to Hedera
 */

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        hedera_testnet: {
            url: "https://testnet.hashio.io/api",
            chainId: 296,
            accounts: process.env.OPERATOR_PRIVATE_KEY ? [process.env.OPERATOR_PRIVATE_KEY] : [],
        },
        hedera_mainnet: {
            url: "https://mainnet.hashio.io/api",
            chainId: 297,
            accounts: process.env.OPERATOR_PRIVATE_KEY ? [process.env.OPERATOR_PRIVATE_KEY] : [],
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    }
};

