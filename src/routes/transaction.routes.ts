import express from 'express';
import controller from '../controllers/transaction.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/history', controller.getTransactions);
router.get('/history/:accountNumber', controller.getTransactionHistory);

router.post('/transfer', auth, controller.transfer);
router.post('/transfer/internal', auth, controller.internalTransfer);
router.post('/fund', auth, controller.fundAccount);

router.patch('/fund/:id', auth, controller.updateFunding);

export default router;
