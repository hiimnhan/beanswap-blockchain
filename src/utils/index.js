import { ethers, BigNumber } from 'ethers';
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

export {
  calculateMinFee,
  parseAmount,
  convertBigNumberToNumber,
  formatCurrency,
  checkValidAddress,
};
