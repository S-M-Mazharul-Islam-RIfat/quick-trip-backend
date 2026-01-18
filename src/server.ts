/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
   try {
      console.log(envVars.NODE_ENV);
      await mongoose.connect(envVars.DB_URL)

      console.log("Connected to DB!!!");

      server = app.listen(envVars.PORT, () => {
         console.log(`Server is listening to port ${envVars.PORT}`);
      })
   }
   catch (error) {
      console.log(error);
   }
}

startServer();

process.on("SIGTERM", () => {
   console.log("SIGTERM signal received detected...server is shutting down.");
   if (server) {
      server.close(() => {
         process.exit(1);
      });
   }
   process.exit(1);
})

process.on("unhandledRejection", () => {
   console.log("Unhandled rejection detected...server is shutting down.");
   if (server) {
      server.close(() => {
         process.exit(1);
      });
   }
   process.exit(1);
})

process.on("uncaughtException", () => {
   console.log("Uncaught exception detected...server is shutting down.");
   if (server) {
      server.close(() => {
         process.exit(1);
      });
   }
   process.exit(1);
})





