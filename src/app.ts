import cookiesParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { router } from "./app/routes";
const app = express();
//middleware
app.use(express.json());
app.use(cors());
app.use(cookiesParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Welcome to the Tour Management System API" });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
