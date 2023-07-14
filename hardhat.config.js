require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
    defaultNetwork: "maticTestNet",
    networks: {
        hardhat: {},
        rinkebyTestNet: {
            url: "https://rinkeby.infura.io/v3/598218e659ac4533b5a468c35759ec86",
            accounts: [PRIVATE_KEY],
            gas: "auto",
            gasPrice: "auto",
        },
        maticMainNet: {
            url: "https://rpc-mainnet.maticvigil.com/v1/179792218d82efa25be815f655d5f76ee12c6bde",
            accounts: [PRIVATE_KEY],
            gas: "auto",
            gasPrice: "auto",
        },
        maticTestNet: {
            url: "https://rpc-mumbai.maticvigil.com/v1/179792218d82efa25be815f655d5f76ee12c6bde",
            accounts: [PRIVATE_KEY],
            gas: "auto",
            gasPrice: "auto",
        },
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    mocha: {
        timeout: 20000,
    },
    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY,
    }
};