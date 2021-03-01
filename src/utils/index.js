import { ethers, BigNumber, utils } from 'ethers';
import { DECIMAL } from '../constants';

const calculateMinFee = (total, percent = 10) => {
  const minFee = Math.round((total * percent) / 100);
  return minFee;
};

const parseAmount = (amount, decimal) => {
  const converted = ethers.BigNumber.toString(amount);
  return converted;
};

const convertBigNumberToNumber = (number) => {
  const bigNum = BigNumber.from(number);
  const num = bigNum.toNumber(bigNum);
  return num;
};

const formatCurrency = (value, decimals = DECIMAL, unit) => {
  const formatted = ethers.utils.formatUnits(value, decimals) + ` ${unit}`;
  return formatted;
};

const checkValidAddress = (address) => {
  return ethers.utils.isAddress(address);
};

const encryptData = (value) => {
  let encrypted;
  if (typeof value === 'string') {
    encrypted = ethers.utils.keccak256(utils.toUtf8Bytes(value));
  }
  encrypted = ethers.utils.keccak256(value);
  return encrypted;
};

export {
  calculateMinFee,
  parseAmount,
  convertBigNumberToNumber,
  formatCurrency,
  checkValidAddress,
  encryptData,
};
