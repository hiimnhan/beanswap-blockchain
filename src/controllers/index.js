import { services } from '../services';
import { BadRequest } from '../helpers/error';
import { checkValidAddress, convertBigNumberToNumber } from '../utils';
const BigInt = require('big-integer');
const createWallet = async (req, res, next) => {
  try {
    const walletData = await services.createRandom();
    res.status(201).json(walletData);
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { receiverAddress, amount, transactionFee } = req.body;
    const { encryptedKey } = req.headers;
    const transferData = await services.transfer(
      receiverAddress,
      amount,
      transactionFee,
      encryptedKey
    );
    res.status(201).json(transferData);
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
    const data = await services.getBalance(address);
    const balance = BigInt(data.toString()).toJSNumber();
    res.status(200).json({
      address,
      balance,
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionsByAddress = async (req, res, next) => {
  try {
    const { address } = req.params;
    const { limit } = req.query;
    if (!checkValidAddress(address)) throw new BadRequest('Invalid address!');
    const transactions = await services.getTransactionsByAddress(
      address,
      limit
    );
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

export const controllers = {
  createWallet,
  createTransaction,
  getBalance,
  getTransactionsByAddress,
};
