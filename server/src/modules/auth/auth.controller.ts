import { Request, Response } from "express";
import * as authService from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  console.log("Request Body:", req.body);
  const result = await authService.register(req.body);

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result,
  });
};
export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
};