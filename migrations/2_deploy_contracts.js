const Bean = artifacts.require('Bean');

module.exports = async function(deployer) {
    await deployer.deploy(Bean);
}
// const contract = require('@truffle/contract');
// const ethers = require('ethers');
// const {EnvConfig} = require('../src/configs/env');

// const provider = new ethers.providers.JsonRpcProvider(EnvConfig.RPC_ENPOINT);

// const beanJson = require('../build/contracts/Bean.json');

// const beanContract = contract(beanJson);

// beanContract.setProvider(provider);

// beanContract.new();