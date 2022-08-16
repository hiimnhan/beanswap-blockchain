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
    const { receiverAddress, amount, fee } = req.body;
    const { encryptedkey } = req.headers;
    const transferData = await services.transfer(
      receiverAddress,
      amount,
      fee,
      encryptedkey
    );
    res.status(201).json(transferData);
  } catch (error) {
    next(error);
  }
};

const multiSend = async (req, res, next) => {
  try {
    const { encryptedkey } = req.headers;
    const receiverAddresses = req.body.map(
      ({ receiverAddress }) => receiverAddress
    );
    const amounts = req.body.map(({ amount }) => amount);
    const fees = req.body.map(({ fee }) => fee);
    const transferData = await services.multiSend(
      receiverAddresses,
      amounts,
      fees[0],
      encryptedkey
    );
    res.status(201).json(transferData);
  } catch (error) {
    console.log(error);
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
  multiSend,
};
