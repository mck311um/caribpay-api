import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  dbUrl: string;
  jwtSecret: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || "3000"),
  dbUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "secret",
};

export default config;
