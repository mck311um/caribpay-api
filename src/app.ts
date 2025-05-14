import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import authRoutes from './routes/auth.routes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Routes
app.use('/api/v1/auth', authRoutes);

export default app;
