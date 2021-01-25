require('dotenv').config();
import { ethers } from 'ethers';
import { NonceManager } from '@ethersproject/experimental';
import EnvConfig from '../configs/env';
import {parseAmount}  from '../utils';
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
        mnemonic: wallet.mnemonic,
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
        //nonce: currentNonce + 1
    }
    const beanContract = await getTokenContract(signer);
    await beanContract.transfer(receiverAddress, amount, options);

};

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

export const connectWalletWithPrivateKey = async (privateKey) => {
    const wallet = await new ethers.Wallet(privateKey, provider);
    return wallet;
}
















