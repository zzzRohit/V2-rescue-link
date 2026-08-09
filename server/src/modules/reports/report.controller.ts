import { NextFunction, Request, Response } from "express";
import * as reportService from "./report.service.js";
export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reportData = await reportService.createReport(req.body , req.user?.userId);
        return res.status(200).json({ message: "Report created successfully", data: reportData });
    } catch (error) {
    console.error("Controller Error:", error);
    next(error); // Pass the error to the error handling middleware
}
}
export const testAuth = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Authentication middleware works",
    user: req.user,
  });
};