const express = require('express');

import { controllers } from '../controllers';
import { apiRoutes } from '../constants';

const router = express.Router();

/**
 * @swagger
 *   /api/account:
 *     post:
 *       summary: Create new wallet
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
 *                       walletAddress:
 *                         type: string
 *                         description: new address
 *                       walletPrivateKey:
 *                         type: string
 *                         description: password for keystore
 *                 example:
 *                   result:
 *                     walletAddress: '0x12F78Ae8805A1A346816E7878D1Bac1708C5F303'
 *                     walletPrivateKey: 'U2FsdGVkX1+XUm+Lx7wpTmuJsdE6q5WhxNlh09qFxs5reccTOXa533wRiIPkZQcN3J8sOxDc0cAgMCee/MSlYAiSD0exapeJWC/Iz4xg8pkCWDIpwX1gIIMULGbkHZNo'
 */
router.post(apiRoutes.CREATE_ACCOUNT, controllers.createAccount);

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
 *       requestBody:
 *         required: false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 limit:
 *                   type: number
 *                   description: number of txs to get
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
router.get(apiRoutes.GET_TXS, controllers.getTransactionsByAddress);

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
 *           example:
 *             receiverAddress: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *             amount: 10
 *             transactionFee: 1
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
 *                     txTimestamp:
 *                       type: string
 *                       example: '2021-03-05T14:59:41.000Z'
 *                     txStatus:
 *                       type: boolean
 *                       example: true
 *                     amount:
 *                       type: integer
 *                       example: 10
 */
router.post(apiRoutes.TRANSFER_BEAN, controllers.transfer);

export default router;
