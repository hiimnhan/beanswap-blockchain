import { services } from '../services';
import { ethers } from 'ethers';
import { NotFound, BadRequest } from '../helpers/error';
import { checkValidAddress } from '../utils';
const createAccount = async (req, res, next) => {
  try {
    const accountData = await services.createRandomAccount();
    res.status(200).json({
      result: accountData,
    });
  } catch (error) {
    next(error);
  }
};

const transfer = async (req, res, next) => {
  try {
    const { receiverAddress, amount, transactionFee, signer } = req.body;
    const transferData = await services.transfer(
      receiverAddress,
      amount,
      transactionFee,
      signer
    );
    res.status(200).json({
      result: transferData,
    });
  } catch (error) {
    next(error);
  }
};

const getBalance = async (req, res, next) => {
  try {
    const { address } = req.params;
    if (!checkValidAddress(address)) {
      throw new BadRequest('Invalid address!');
    }
    const balance = await services.getBalance(address);
    res.status(200).json({
      result: balance,
    });
  } catch (error) {
    next(error);
  }
};

const connectWithPrivateKey = async (req, res, next) => {
  try {
    const { privateKey } = req.body;
    if (privateKey.length < 64)
      throw new BadRequest('Invalid format of private key!');
    const signer = await services.connectWalletWithPrivateKey(privateKey);
    res.status(200).json({
      result: signer,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const { address, limit } = req.params;
    if (!checkValidAddress(address)) throw new BadRequest('Invalid address!');
    const transactions = await services.getTransactions(address, limit);
    res.status(200).json({
      result: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const controllers = {
  createAccount,
  connectWithPrivateKey,
  transfer,
  getBalance,
  getTransactions,
};
