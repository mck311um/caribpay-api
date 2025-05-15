import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import walletRoutes from './routes/wallet.routes';
import limiter from './config/limiter.config';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(limiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/wallet', walletRoutes);

export default app;
