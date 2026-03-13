import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production" | "test";
}

const localEnvVars = (): EnvConfig => {
  const requeredEnvVariables = ["PORT", "DB_URI", "NODE_ENV"];
  requeredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  });
  return {
    PORT: process.env.PORT || "5000",
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
  };
};

export const evnVars = localEnvVars();
