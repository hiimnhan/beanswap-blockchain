
const BeanContract = require('../Bean.json');
const EnvConfig = {
    RPC_ENPOINT_TOMO: 'https://rpc.testnet.tomochain.com',
    RPC_ENPOINT_LOCAL: 'HTTP://127.0.0.1:7545',
    CHAIN_ID: 89,
    BEAN_ABI: BeanContract.abi,
    BEAN_ADDRESS: '0xc6849b58D412D3dA5dAb2abe37b99A0237038897',
    SYSTEM_WALLET_ADDRESS: '0xc881070f3cF39B0bEfe1738Fc78D97a90E34a959'
}

module.exports = {EnvConfig}