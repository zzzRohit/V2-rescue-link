import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/Apperror.js";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "../types/auth.js";

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // No token = anonymous user
  if (!authHeader) {
    return next();
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError("Invalid authorization header", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Token is missing", 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthenticatedUser;

    req.user = decoded;

    next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
};