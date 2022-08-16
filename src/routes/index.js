const express = require('express');

import { controllers } from '../controllers';
import { apiRoutes } from '../constants';

const router = express.Router();

/**
 * @swagger
 *   /api/wallets:
 *     post:
 *       summary: Create new wallet
 *       responses:
 *         201:
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     description: wallet address
 *                   encryptedKey:
 *                     type: string
 *                     description: wallet encrypted key
 *                 example:
 *                   address: '0x12F78Ae8805A1A346816E7878D1Bac1708C5F303'
 *                   encryptedKey: 'U2FsdGVkX1+XUm+Lx7wpTmuJsdE6q5WhxNlh09qFxs5reccTOXa533wRiIPkZQcN3J8sOxDc0cAgMCee/MSlYAiSD0exapeJWC/Iz4xg8pkCWDIpwX1gIIMULGbkHZNo'
 */
router.post(apiRoutes.CREATE_WALLET, controllers.createWallet);

/**
 * @swagger
 *   /api/balances/{address}:
 *     get:
 *       summary: Get balance of an address
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
 *                   address:
 *                     type: string
 *                   balance:
 *                     type: string
 *                 example:
 *                   address: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *                   balance: 11030
 */

router.get(apiRoutes.GET_BALANCE, controllers.getBalance);

/**
 * @swagger
 *   /api/transactions/{address}:
 *     get:
 *       summary: Get transactions of an address with limit chosen
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
 *             type: number
 *           description: number of transactions to get
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     schema:
 *                     type: object
 *
 */
router.get(apiRoutes.GET_TRANSACTIONS, controllers.getTransactionsByAddress);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: transfer bean from one to another address
 *     parameters:
 *       - in: header
 *         name: encryptedKey
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
 *               fee:
 *                 type: integer
 *                 description: txs fee
 *           example:
 *             receiverAddress: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *             amount: 1000
 *             fee: 100
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sourceAddress:
 *                     type: string
 *                     example: '0x35b02087a0E6A3480fdC08c8A3FEDE2DFB1Ed472'
 *                   destAddress:
 *                     type: string
 *                     example: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *                   txTransferHash:
 *                     type: string
 *                     example: '0xcd7369ae5d2b033463c92c7ac03bd9a5f9294cda110feae1bd039ef8c63cbf2c'
 *                   txTimestamp:
 *                     type: string
 *                     example: '2021-03-05T14:59:41.000Z'
 *                   txStatus:
 *                     type: boolean
 *                     example: true
 *                   amount:
 *                     type: integer
 *                     example: 10
 *                   fee:
 *                     type: integer
 *                     example: 0
 */
// router.post(apiRoutes.CREATE_TRANSACTION, controllers.createTransaction);
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: transfer bean from one to other addresses
 *     parameters:
 *       - in: header
 *         name: encryptedKey
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 receiverAddress:
 *                   type: string
 *                   example: "0xBd7DF81B7C2ED9930DeC8774EB76c648079C4230"
 *                 amount:
 *                   type: integer
 *                   example: 2000
 *                 fee:
 *                   type: integer
 *                   example: 200
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sourceAddress:
 *                     type: string
 *                     example: '0x35b02087a0E6A3480fdC08c8A3FEDE2DFB1Ed472'
 *                   destAddress:
 *                     type: string
 *                     example: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *                   txTransferHash:
 *                     type: string
 *                     example: '0xcd7369ae5d2b033463c92c7ac03bd9a5f9294cda110feae1bd039ef8c63cbf2c'
 *                   txTimestamp:
 *                     type: string
 *                     example: '2021-03-05T14:59:41.000Z'
 *                   txStatus:
 *                     type: boolean
 *                     example: true
 *                   amount:
 *                     type: integer
 *                     example: 10
 *                   fee:
 *                     type: integer
 *                     example: 0
 */
router.post(apiRoutes.CREATE_TRANSACTION, controllers.multiSend);

export default router;
