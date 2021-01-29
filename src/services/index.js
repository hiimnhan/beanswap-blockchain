require('dotenv').config();
import { ethers } from 'ethers';
import EnvConfig from '../configs/env';
import { scanRoutes, SCAN_TESTNET_URL } from '../constants'
const axios = require('axios');
export const initProvider = () => {
    return new ethers.providers.JsonRpcProvider(EnvConfig.RPC_ENPOINT);
}

const provider = initProvider();

const systemWallet = new ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(provider);

export const getTokenContract = async (signer) => {
 
    const tokenContract = new ethers.Contract(
        EnvConfig.BEAN_ADDRESS,
        EnvConfig.BEAN_ABI,
        signer
    )
    return tokenContract;
};

/**
 * @dev create random wallet
 * @returns address, mnemonic, privateKey of wallet
 */
export const createRandomAccount = async () => {
    const wallet = await ethers.Wallet.createRandom().connect(provider);
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    }
}

/**
 * @dev transfer bean
 * @param {receiver address} receiverAddress 
 * @param {amount of bean to transfer} amount 
 * @param {who transfer } signer 
 */
export const transfer = async (receiverAddress, amount, signer) => {
    const options = {
        gasLimit: 150000,
        gasPrice: ethers.utils.parseUnits('14.0', 'gwei'),
    }
    const beanContract = await getTokenContract(signer);
    await beanContract.transfer(receiverAddress, amount, options);
    const transactionId = await getLatestTransactionId(signer.address);
    return {
        sourceAddress: signer.address,
        destAddress: receiverAddress,
        transactionId,
        amount
    }

};

/**
 * @dev get balance of address
 * @param {address to get balance} address 
 */
export const getBalance = async (address) => {
    const beanContract = await getTokenContract(systemWallet);
    const balance = await beanContract.balanceOf(address);      
    return balance;
}

/**
 * @dev adjust min fee
 * @param {new min fee} newMinFee
 */
export const setNewMinFee = async (newMinFee) => {
    const beanContract = await getTokenContract(systemWallet);
    await beanContract.setMinFee(newMinFee);
}

/**
 * @dev connect wallet with mnemonic
 * @param {12 seeds phrase} mnemonic 
 */
export const connectWalletWithMnemonic = async (mnemonic) => {
    await ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

}

/**
 * @dev connect wallet by privateKey
 * @param {private key of wallet } privateKey 
 */
export const connectWalletWithPrivateKey = async (privateKey) => {
    const wallet = await new ethers.Wallet(privateKey, provider);
    return wallet;
}

export const getLatestTransactionId = async (address) => {
    const transactions = await axios.
        get(`${SCAN_TESTNET_URL}${scanRoutes.GET_TRANSACTIONS}${address}`)
            .then(res => res.data.items);
    const latestTransactionId = transactions[0].hash;
    return latestTransactionId;
}


















