import express from 'express';
import controller from '../controllers/user.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, controller.getUser);

router.patch('/update', auth, controller.updateUser);

export default router;
