import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
   PORT: string,
   DB_URL: string,
   NODE_ENV: "development" | "production"
}

const loadEnvVariables = (): EnvConfig => {
   const reuqiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV"];
   reuqiredEnvVariables.forEach(key => {
      if (!process.env[key]) {
         throw new Error(`Missing require environment variables ${key}`);
      }
   })

   return {
      PORT: process.env.PORT!,
      DB_URL: process.env.DB_URL!,
      NODE_ENV: process.env.NODE_ENV as "development" | "production"
   }
}

export const envVars = loadEnvVariables();

