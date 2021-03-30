require('dotenv').config();
import { ethers } from 'ethers';
import { EnvConfig } from '../configs/env';
import { scanRoutes, SCAN_TESTNET_URL } from '../constants';
import { encryptData, encryptPrivateKey, decryptPrivateKey } from '../utils';
import * as moment from 'moment';
const axios = require('axios');
export const initProvider = () => {
  return new ethers.providers.JsonRpcProvider(EnvConfig.RPC_ENPOINT_TOMO);
};

const provider = initProvider();

const systemWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const getTokenContract = async (signer) => {
  const tokenContract = new ethers.Contract(
    EnvConfig.BEAN_ADDRESS,
    EnvConfig.BEAN_ABI,
    signer
  );
  return tokenContract;
};

/**
 * @dev transfer bean
 * @param {receiver address} receiverAddress
 * @param {amount of bean to transfer} amount
 * @param {who transfer } signer
 */
const transfer = async (
  receiverAddress,
  amount,
  transactionFee,
  encryptedKey
) => {
  const options = {
    gasLimit: 150000,
    gasPrice: ethers.utils.parseUnits('14.0', 'gwei'),
  };
  //const signer = await readKeyStoreJson(keystore, password);
  const SECRET_KEY = process.env.SECRET_KEY;
  const originalKey = decryptPrivateKey(encryptedKey, SECRET_KEY);
  const signer = await new ethers.Wallet(originalKey, provider);
  const beanContract = await getTokenContract(signer);
  await beanContract.transferWithFee(
    receiverAddress,
    amount,
    transactionFee,
    options
  );
  console.log('signer.address', signer.address);
  const txDetail = await getTransactionDetailByAddress(signer.address);
  console.log(txDetail);
  return {
    sourceAddress: signer.address,
    destAddress: receiverAddress,
    txTransferHash: txDetail.hash,
    txTimeStamp: moment.utc(txDetail.timestamp),
    txStatus: txDetail.status,
    amount,
  };
};

/**
 * @dev get balance of address
 * @param {address to get balance} address
 */
const getBalance = async (address) => {
  const beanContract = await getTokenContract(systemWallet);
  const balance = await beanContract.balanceOf(address);
  return balance;
};

/**
 *
 * @param {address to get txId} address
 */
const getTransactionDetailByAddress = async (address) => {
  const transaction = await getTransactionsByAddress(address, 1);
  const txDetail = transaction[0];
  return txDetail;
};

const getTransactionsByAddress = async (address, limit = 20) => {
  const transactions = await axios
    .get(
      `${SCAN_TESTNET_URL}${scanRoutes.GET_TRANSACTIONS}${address}?limit=${limit}`
    )
    .then((res) => res.data.items);
  return transactions;
};

const multiSend = async (addresses, values, fee) => {
  const beanContract = await getTokenContract(systemWallet);
  const count = await beanContract.multiSend(addresses, values, fee);
  return count;
};

const createRandom = async () => {
  const newWallet = await ethers.Wallet.createRandom().connect(provider);
  const { privateKey, address } = newWallet;

  const encryptedKey = encryptPrivateKey(privateKey);

  return {
    address: address,
    encryptedKey: encryptedKey,
  };
};

export const services = {
  //createKeyStoreJson,
  transfer,
  getBalance,
  getTransactionsByAddress,
  multiSend,
  createRandom,
};
