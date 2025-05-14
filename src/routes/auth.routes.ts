import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

export default router;
