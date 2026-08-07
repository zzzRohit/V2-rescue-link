import type { ErrorRequestHandler } from "express";

type ErrorWithCode = Error & { code?: string };

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const code = (error as ErrorWithCode).code;

  if (code === "ETIMEDOUT" || code === "ECONNREFUSED" || code === "P1001") {
    console.error("Database connection error:", error);
    res.status(503).json({
      success: false,
      message: "Database is temporarily unavailable. Please try again shortly.",
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
