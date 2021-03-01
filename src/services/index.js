require('dotenv').config();
import { ethers } from 'ethers';
import { EnvConfig } from '../configs/env';
import { scanRoutes, SCAN_TESTNET_URL } from '../constants';
import { encryptData } from '../utils';
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
 * @dev create keystore json
 */
const createKeyStoreJson = async () => {
  const wallet = await ethers.Wallet.createRandom().connect(provider);
  const { privateKey } = wallet;
  const encryptedKey = encryptData(privateKey);
  const keystoreJson = await wallet.encrypt(encryptedKey, {
    scrypt: {
      N: 2 ** 16,
    },
  });
  return {
    address: wallet.address,
    keystore: keystoreJson,
    encryptKey: encryptedKey,
  };
};

const readKeyStoreJson = async (json, password) => {
  const wallet = await (
    await ethers.Wallet.fromEncryptedJson(json, password)
  ).connect(provider);
  console.log('wallet', wallet);
  return wallet;
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
  keystore,
  password
) => {
  const options = {
    gasLimit: 150000,
    gasPrice: ethers.utils.parseUnits('14.0', 'gwei'),
  };
  const signer = await readKeyStoreJson(keystore, password);
  const beanContract = await getTokenContract(signer);
  await beanContract.transferWithFee(
    receiverAddress,
    amount,
    transactionFee,
    options
  );
  const txTransferHash = await getTransactionHash(signer.address);
  return {
    sourceAddress: signer.address,
    destAddress: receiverAddress,
    txTransferHash,
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
const getTransactionHash = async (address) => {
  const transaction = await getTransactions(address, 1);
  const txTransferHash = transaction[0].hash;
  return txTransferHash;
};

const getTransactions = async (address, limit) => {
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

export const services = {
  createKeyStoreJson,
  transfer,
  getBalance,
  getTransactions,
  multiSend,
};
