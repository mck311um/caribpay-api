import express from 'express';
import controller from '../controllers/wallet.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/history', controller.getTransactionHistory);

router.post('/transfer', auth, controller.transfer);
router.post('/transfer/internal', auth, controller.internalTransfer);
router.post('/fund', auth, controller.fundAccount);
router.patch('/fund/:id', auth, controller.updateFunding);

export default router;
