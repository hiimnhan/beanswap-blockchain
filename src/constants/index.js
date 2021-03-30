export const DECIMAL = 10;
export const apiRoutes = {
  CREATE_TRANSACTION: '/transactions',
  GET_BALANCE: '/balances/:address',
  CONNECT_PRIVATE_KEY: '/connection',
  SET_MIN_FEE: '/fee',
  CREATE_WALLET: '/wallets',
  GET_TRANSACTIONS: '/transactions/:address',
};
export const scanRoutes = {
  GET_TRANSACTIONS: 'api/txs/listByAccount/',
};
export const SCAN_TESTNET_URL = 'https://scan.testnet.tomochain.com/';
