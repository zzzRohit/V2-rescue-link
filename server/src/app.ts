import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { corsOptions } from "./config/cors.js";
import { errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.route.js";
import reportRoutes from "./modules/reports/report.routes.js";
import userRoutes from "./modules/users/user.routes.js";
export const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/users", userRoutes);
app.use(errorHandler);
