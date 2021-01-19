require('dotenv').config();
import { ethers } from 'ethers';
import EnvConfig from '../configs/env';

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
    const beanContract = await getTokenContract(signer);
    await beanContract.transfer(receiverAddress, amount);
};

/**
 * @dev adjust min fee
 * @param {new min fee} newMinFee
 */
export const setNewMinFee = async (newMinFee) => {
    const beanContract = await getTokenContract(systemWallet);
    await beanContract.setMinFee(newMinFee);
}








