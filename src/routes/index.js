const express = require('express');

import { controllers } from '../controllers';
import { apiRoutes } from '../constants';

const router = express.Router();

/**
 * @swagger
 * /api/account:
 *   post:
 *     summary: create new account
 *     description: return account address, privateKey
 */
router.post(apiRoutes.CREATE_ACCOUNT, controllers.createAccount);

router.get(apiRoutes.GET_BALANCE, controllers.getBalance);

router.get(apiRoutes.GET_TXS, controllers.getTransactions);

router.post(apiRoutes.TRANSFER_BEAN, controllers.transfer);

export default router;
