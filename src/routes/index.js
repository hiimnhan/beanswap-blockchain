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
 *                       privateKey:
 *                         type: string
 *                         description: privateKey of new address
 *                 example:
 *                   result:
 *                     address: '0xFcE5CDeF114E7f14e1FABDa9dCfb88baEa2c9345'
 *                     privateKey: '0x4f1bfd87c17ef1341d52a9f659130725e165095b85bdf802a14bb5c0dee55ff8'
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
 *               privateKey:
 *                 type: string
 *                 description: privateKey of sender address
 *           example:
 *             receiverAddress: '0x2767B8c9838eDa3010B9e4310d2D1B63469e5F46'
 *             amount: 10
 *             transactionFee: 1
 *             privateKey: '1cb10cefee8ef51c634fe4a0088334ee10094b11387754fa574c5007814c0edf'
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
