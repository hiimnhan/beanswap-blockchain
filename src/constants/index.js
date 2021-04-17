export const DECIMAL = 10;
export const apiRoutes = {
  CREATE_TRANSACTION: '/transactions',
  GET_BALANCE: '/balances/:address',
  CREATE_WALLET: '/wallets',
  GET_TRANSACTIONS: '/transactions/:address',
  MULTI_SEND: '/airdrop',
};
export const scanRoutes = {
  GET_TRANSACTIONS: 'txs/listByAccount/',
  GET_TRANSACTION_DETAIL: 'txs/',
};
export const SCAN_TESTNET_URL = 'https://scan.testnet.tomochain.com/api/';
