export const DECIMAL = 10;
export const apiRoutes = {
  TRANSFER_BEAN: '/transfer',
  GET_BALANCE: '/balance/:address',
  CONNECT_PRIVATE_KEY: '/connection',
  SET_MIN_FEE: '/fee',
  CREATE_ACCOUNT: '/account',
  GET_TXS: '/transactions/:address',
};
export const scanRoutes = {
  GET_TRANSACTIONS: 'api/txs/listByAccount/',
};
export const SCAN_TESTNET_URL = 'https://scan.testnet.tomochain.com/';
