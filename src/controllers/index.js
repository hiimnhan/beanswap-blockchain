import { services } from '../services';
import { BadRequest } from '../helpers/error';
import { checkValidAddress, convertBigNumberToNumber } from '../utils';
const createAccount = async (req, res, next) => {
  try {
    const accountData = await services.createKeyStoreJson();
    res.status(200).json({
      result: accountData,
    });
  } catch (error) {
    next(error);
  }
};

const transfer = async (req, res, next) => {
  try {
    const { receiverAddress, amount, transactionFee, keystore } = req.body;
    const { password } = req.headers;
    const transferData = await services.transfer(
      receiverAddress,
      amount,
      transactionFee,
      keystore,
      password
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
    const data = await services.getBalance(address);
    console.log(data);
    const balance = convertBigNumberToNumber(data);
    res.status(200).json({
      result: {
        address,
        balance,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const { address } = req.params;
    const { limit } = req.query;
    if (!checkValidAddress(address)) throw new BadRequest('Invalid address!');
    const transactions = await services.getTransactions(address, limit);
    res.status(200).json({
      result: {
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const controllers = {
  createAccount,
  transfer,
  getBalance,
  getTransactions,
};
