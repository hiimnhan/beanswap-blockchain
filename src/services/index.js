require('dotenv').config();
import { ethers } from 'ethers';
import { EnvConfig } from '../configs/env';
import { scanRoutes, SCAN_TESTNET_URL } from '../constants';
const axios = require('axios');
export const initProvider = () => {
  return new ethers.providers.JsonRpcProvider(EnvConfig.RPC_ENPOINT_TOMO);
};

const provider = initProvider();

const systemWallet = new ethers.Wallet.fromMnemonic(
  process.env.MNEMONIC
).connect(provider);

const getTokenContract = async (signer) => {
  const tokenContract = new ethers.Contract(
    EnvConfig.BEAN_ADDRESS,
    EnvConfig.BEAN_ABI,
    signer
  );
  return tokenContract;
};

/**
 * @dev create random wallet
 * @returns address, mnemonic, privateKey of wallet
 */
const createRandomAccount = async () => {
  const wallet = await ethers.Wallet.createRandom().connect(provider);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

/**
 * @dev transfer bean
 * @param {receiver address} receiverAddress
 * @param {amount of bean to transfer} amount
 * @param {who transfer } signer
 */
const transfer = async (receiverAddress, amount, transactionFee, signer) => {
  const options = {
    gasLimit: 150000,
    gasPrice: ethers.utils.parseUnits('14.0', 'gwei'),
  };
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
 * @dev adjust min fee
 * @param {new min fee} newMinFee
 */
const setNewMinFee = async (newMinFee) => {
  const beanContract = await getTokenContract(systemWallet);
  await beanContract.setMinFee(newMinFee);
};

/**
 * @dev connect wallet with mnemonic
 * @param {12 seeds phrase} mnemonic
 */
const connectWalletWithMnemonic = async (mnemonic) => {
  await ethers.Wallet.fromMnemonic(mnemonic).connect(provider);
};

/**
 * @dev connect wallet by privateKey
 * @param {private key of wallet } privateKey
 */
const connectWalletWithPrivateKey = async (privateKey) => {
  const signer = await new ethers.Wallet(privateKey, provider);
  return signer;
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

// transfer('0x9690A80821874D10136D19092C9C06e596b1FE85', 10000, 100, systemWallet)
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

// getTransactionId(systemWallet.address).then((data) =>
//   console.log('tx: ', data)
// );

export const services = {
  createRandomAccount,
  transfer,
  getBalance,
  connectWalletWithPrivateKey,
  getTransactions,
  multiSend,
};
