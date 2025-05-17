import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';
import adminRoutes from './routes/admin.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/transaction', transactionRoutes);
app.use('/api/v1/admin', adminRoutes);

export default app;
