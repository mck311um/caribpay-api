import express from 'express';
import controller from '../controllers/account.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, controller.getAccounts);
router.get('/peers', auth, controller.getPeers);
router.get(':accountNumber/balance', auth, controller.getAccountBalance);

router.post('/', auth, controller.addAccount);
router.post('/peer', auth, controller.addPeer);

router.delete('/:accountNumber', auth, controller.deleteAccount);

export default router;
