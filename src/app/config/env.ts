import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production" | "test";
  JWT_ACCESS_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_SALD_ROUND: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
}

const localEnvVars = (): EnvConfig => {
  const requeredEnvVariables = [
    "PORT",
    "DB_URI",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
    "JWT_EXPIRES_IN",
    "BCRYPT_SALD_ROUND",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
  ];
  requeredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  });
  return {
    PORT: process.env.PORT || "5000",
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    BCRYPT_SALD_ROUND: process.env.BCRYPT_SALD_ROUND as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
  };
};

export const evnVars = localEnvVars();
