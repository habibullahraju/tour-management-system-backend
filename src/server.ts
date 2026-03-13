import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { evnVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(evnVars.DB_URI);

    console.log("connected to MongoDB");
    server = app.listen(evnVars.PORT, () => {
      console.log(`Server is running on port ${evnVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();

process.on("SIGTERM", () => {
  console.log("SIGTERM received!... Server shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandle rejection detected!... Server shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("uncaught exception detected!... Server shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
