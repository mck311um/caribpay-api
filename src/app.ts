import express, { Application } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.options("*", cors());

// Routes

export default app;
