
const BeanContract = require('../../build/contracts/MyTRC21Mintable.json')
const EnvConfig = {
    RPC_ENPOINT: 'https://rpc.testnet.tomochain.com',
    CHAIN_ID: 89,
    BEAN_ABI: BeanContract.abi,
    BEAN_ADDRESS: '0xdEC5505c38A6b61502136a16951d33781E4C1D40',
    SYSTEM_WALLET_ADDRESS: '0xc881070f3cF39B0bEfe1738Fc78D97a90E34a959'
}

export default EnvConfig;