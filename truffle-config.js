require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const MNEMONIC = process.env.MNEMONIC;
module.exports = {

  networks: {
    developments: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    tomotestnet: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC
          },
          providerOrUrl: 'https://testnet.tomochain.com'
        });
      },
      gas: 2000000,
      gasPrice: 10000000000000,
      network_id: 89,
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
       version: "0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
