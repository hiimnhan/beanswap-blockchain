const express = require('express');

import { controllers } from '../controllers';
import { apiRoutes } from '../constants';

const router = express.Router();

/**
 * @swagger
 *   /api/account:
 *     post:
 *       summary: create new wallet
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         description: new address
 *                       keystore:
 *                         type: string
 *                         description: keystore of new address
 *                       encryptKey:
 *                         type: string
 *                         description: password for keystore
 *                 example:
 *                   result:
 *                     address: '0xFcE5CDeF114E7f14e1FABDa9dCfb88baEa2c9345'
 *                     keystore: "{\"address\":\"a34996c8213fde3db7224964b2c44f14fb63744c\",\"id\":\"398ccfe5-9436-4f0e-b0ec-4ce6681af75b\",\"version\":3,\"Crypto\":{\"cipher\":\"aes-128-ctr\",\"cipherparams\":{\"iv\":\"de573ca65e4c0478c5e83626cd980bc3\"},\"ciphertext\":\"d45064227d6b0f96f5e77261e18dc47219b319880cc39848016028c2559191f2\",\"kdf\":\"scrypt\",\"kdfparams\":{\"salt\":\"363a697dfb76dcc9151306e8082ee44dab65a8991ab96cd80ad2580f5d59ac89\",\"n\":65536,\"dklen\":32,\"p\":1,\"r\":8},\"mac\":\"aad6a5425e6f616f1f7b9bb84f7cb6b3cdf9083861150f6619db5232e84a0e7b\"},\"x-ethers\":{\"client\":\"ethers.js\",\"gethFilename\":\"UTC--2021-03-01T16-07-33.0Z--a34996c8213fde3db7224964b2c44f14fb63744c\",\"mnemonicCounter\":\"86562309d89ab6ee255009207750608d\",\"mnemonicCiphertext\":\"6ff86abd77008b15728ea50a520aa623\",\"path\":\"m/44'/60'/0'/0/0\",\"locale\":\"en\",\"version\":\"0.1\"}}"
 *                     encryptKey: '0x13356441de3b4ea936f500a3bd88cdbe2231274add00ff079ad5f3fdc2bee918'
 */
router.post(apiRoutes.CREATE_ACCOUNT, controllers.createAccount);

/**
 * @swagger
 *   /api/balances/{address}:
 *     get:
 *       summary: get balance of an address
 *       parameters:
 *         - in: path
 *           name: address
 *           schema:
 *             type: string
 *           required: true
 *           description: address to get balance
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                       balance:
 *                         type: string
 *                 example:
 *                   result:
 *                     address: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *                     balance: 11030
 */

router.get(apiRoutes.GET_BALANCE, controllers.getBalance);

/**
 * @swagger
 *   /api/transactions/{address}?limit:
 *     get:
 *       summary: get transactions of an address with limit chosen
 *       parameters:
 *         - in: path
 *           name: address
 *           schema:
 *             type: string
 *           required: true
 *           description: address to get balance
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: number of txs to get
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result:
 *                     type: object
 *                     properties:
 *                       transactions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             schema:
 *                             type: object
 *
 */
router.get(apiRoutes.GET_TXS, controllers.getTransactions);

/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: transfer bean from one to another address
 *     parameters:
 *       - in: header
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverAddress:
 *                 type: string
 *                 description: address of receiver
 *               amount:
 *                 type: integer
 *                 description: amount of beans to transfer
 *               transactionFee:
 *                 type: integer
 *                 description: txs fee
 *               keystore:
 *                 type: string
 *                 description: keystore of address
 *           example:
 *             receiverAddress: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *             amount: 10
 *             transactionFee: 1
 *             keystore: "{\"address\":\"a34996c8213fde3db7224964b2c44f14fb63744c\",\"id\":\"398ccfe5-9436-4f0e-b0ec-4ce6681af75b\",\"version\":3,\"Crypto\":{\"cipher\":\"aes-128-ctr\",\"cipherparams\":{\"iv\":\"de573ca65e4c0478c5e83626cd980bc3\"},\"ciphertext\":\"d45064227d6b0f96f5e77261e18dc47219b319880cc39848016028c2559191f2\",\"kdf\":\"scrypt\",\"kdfparams\":{\"salt\":\"363a697dfb76dcc9151306e8082ee44dab65a8991ab96cd80ad2580f5d59ac89\",\"n\":65536,\"dklen\":32,\"p\":1,\"r\":8},\"mac\":\"aad6a5425e6f616f1f7b9bb84f7cb6b3cdf9083861150f6619db5232e84a0e7b\"},\"x-ethers\":{\"client\":\"ethers.js\",\"gethFilename\":\"UTC--2021-03-01T16-07-33.0Z--a34996c8213fde3db7224964b2c44f14fb63744c\",\"mnemonicCounter\":\"86562309d89ab6ee255009207750608d\",\"mnemonicCiphertext\":\"6ff86abd77008b15728ea50a520aa623\",\"path\":\"m/44'/60'/0'/0/0\",\"locale\":\"en\",\"version\":\"0.1\"}}"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     sourceAddress:
 *                       type: string
 *                       example: '0x35b02087a0E6A3480fdC08c8A3FEDE2DFB1Ed472'
 *                     destAddress:
 *                       type: string
 *                       example: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *                     txTransferHash:
 *                       type: string
 *                       example: '0xcd7369ae5d2b033463c92c7ac03bd9a5f9294cda110feae1bd039ef8c63cbf2c'
 *                     amount:
 *                       type: integer
 *                       example: 10
 */
router.post(apiRoutes.TRANSFER_BEAN, controllers.transfer);

export default router;
