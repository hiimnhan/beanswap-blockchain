require('dotenv').config();
import { ethers } from 'ethers';
import { NonceManager } from '@ethersproject/experimental';
import { EnvConfig } from '../configs/env';
import { scanRoutes, SCAN_TESTNET_URL } from '../constants';
import { encryptData, encryptPrivateKey, decryptPrivateKey } from '../utils';
import * as moment from 'moment';
import { BadRequest } from '../helpers/error';
import axios from 'axios';

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

const getNonce = async (signer) => {
  const nonceManager = new NonceManager(signer);
  nonceManager.incrementTransactionCount();
  const nonce = await signer.getTransactionCount();

  return nonce;
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
  const originalKey = await decryptPrivateKey(encryptedKey);
  const { privateKey } = JSON.parse(originalKey);
  let mainTx;
  let feeTx;
  let options = {};
  let nonce = 0;
  const signer = await new ethers.Wallet(privateKey, provider);
  if (receiverAddress === signer.address) {
    throw new BadRequest('Cannot transfer to same address');
  }

  const beanContract = await getTokenContract(signer);
  if (transactionFee === 0) {
    nonce = await getNonce(signer);
    options = {
      gasLimit: 150000,
      gasPrice: ethers.utils.parseUnits('14.0', 'gwei'),
      nonce,
    };
    const mainTx = await beanContract.transfer(
      receiverAddress,
      amount,
      options
    );
    const mainTxDetail = await getTransactionDetail(mainTx.hash);
    return [
      {
        sourceAddress: signer.address,
        destAddress: receiverAddress,
        txTransferHash: mainTxDetail?.hash,
        txTimeStamp: moment.utc(mainTxDetail?.timestamp).local(),
        txStatus: mainTxDetail?.status,
        amount,
      },
    ];
  } else {
    nonce = await getNonce(signer);
    options = {
      gasLimit: 150000,
      gasPrice: ethers.utils.parseUnits('14.0', 'gwei'),
      nonce,
    };
    const mainTx = await beanContract.transfer(
      receiverAddress,
      amount,
      options
    );
    const mainTxDetail = await getTransactionDetail(mainTx.hash);
    nonce = await getNonce(signer);
    options = {
      gasLimit: 150000,
      gasPrice: ethers.utils.parseUnits('14.0', 'gwei'),
      nonce,
    };
    const feeTx = await beanContract.transfer(
      systemWallet.address,
      transactionFee,
      options
    );
    const feeTxDetail = await getTransactionDetail(feeTx.hash);
    return [
      {
        sourceAddress: signer.address,
        destAddress: receiverAddress,
        txTransferHash: mainTxDetail?.hash,
        txTimeStamp: moment.utc(mainTxDetail?.timestamp).local(),
        txStatus: mainTxDetail?.status,
        amount,
      },
      {
        sourceAddress: signer.address,
        destAddress: systemWallet.address,
        txTransferHash: feeTxDetail?.hash,
        txTimeStamp: moment.utc(feeTxDetail?.timestamp).local(),
        txStatus: feeTxDetail?.status,
        amount: transactionFee,
      },
    ];
  }
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
    .then((res) => res.data.items)
    .catch((error) => console.log(error));
  return transactions;
};

const multiSend = async (addresses, values, fee, encryptedKey) => {
  const options = {
    gasLimit: 150000,
    gasPrice: ethers.utils.parseUnits('14.0', 'gwei'),
  };

  const originalKey = await decryptPrivateKey(encryptedKey);
  const { privateKey } = JSON.parse(originalKey);

  const signer = await new ethers.Wallet(privateKey, provider);
  const actualFee = fee * addresses.length;
  const beanContract = await getTokenContract(signer);
  const data = await beanContract.multiSend(
    addresses,
    values,
    actualFee,
    options
  );
  const actualAmount = values[0] * values.length + actualFee;
  const txDetail = await getTransactionDetail(data.hash);
  return {
    sourceAddress: signer.address,
    destAddresses: addresses,
    amount: actualAmount,
    fee: actualFee,
    txTransferHash: data?.hash,
    txTimeStamp: moment.utc(txDetail?.timestamp).local(),
    txStatus: txDetail?.status,
  };
};

const getTransactionDetail = async (tx) => {
  const detail = await axios.get(
    `${SCAN_TESTNET_URL}${scanRoutes.GET_TRANSACTION_DETAIL}${tx}`
  );
  return detail;
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

console.log('key', encryptPrivateKey(process.env.PRIVATE_KEY));

export const services = {
  transfer,
  getBalance,
  getTransactionsByAddress,
  multiSend,
  createRandom,
  getTransactionDetail,
};
