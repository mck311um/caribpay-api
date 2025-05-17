import express from 'express';
import controller from '../controllers/admin.controller';

const router = express.Router();

router.get('/', controller.getData);

export default router;
