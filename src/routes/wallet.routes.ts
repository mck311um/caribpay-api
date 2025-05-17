import express from 'express';
import controller from '../controllers/wallet.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, controller.getAccounts);
router.get(':accountNumber/history', controller.getTransactionHistory);
router.get(':accountNumber/balance', auth, controller.getAccountBalance);

router.post('/transfer', auth, controller.transfer);
router.post('/transfer/internal', auth, controller.internalTransfer);
router.post('/fund', auth, controller.fundAccount);

router.patch('/fund/:id', auth, controller.updateFunding);

router.delete('/:accountNumber', auth, controller.deleteAccount);

export default router;
