import { Role } from "../../generated/prisma/enums.js";
import { Request, Response, NextFunction } from "express";
export const authorize = (...requiredRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && requiredRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: You do not have the required role" });
    }
  };
};
