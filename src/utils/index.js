import {ethers} from 'ethers';

const calculateMinFee = (total, percent = 10) => {
    const minFee = Math.round(total * percent / 100);
    return minFee;
}

const parseAmount = (amount, decimal) => {
    const converted = ethers.BigNumber.toString(amount);
    return converted;
}

export {
    calculateMinFee,
    parseAmount
}