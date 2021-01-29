
const BeanContract = require('../../build/contracts/Bean.json')
const EnvConfig = {
    RPC_ENPOINT: 'https://rpc.testnet.tomochain.com',
    CHAIN_ID: 89,
    BEAN_ABI: BeanContract.abi,
    BEAN_ADDRESS: '0xDDa24f226581b248B8a25BdE913D419891A8C4F3',
    SYSTEM_WALLET_ADDRESS: '0xc881070f3cF39B0bEfe1738Fc78D97a90E34a959'
}

module.exports = {EnvConfig}