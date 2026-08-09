import { NextFunction, Request, Response } from "express";
import * as reportService from "./report.service.js";
import { AppError } from "../../utils/Apperror.js";
export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reportData = await reportService.createReport(req.body , req.user?.userId);
        return res.status(200).json({ message: "Report created successfully", data: reportData });
    } catch (error) {
    console.error("Controller Error:", error);
    next(error); // Pass the error to the error handling middleware
}
}
export const getMyReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("User ID is missing in the request" ,401);
        }
        const reports = await reportService.getMyReports(userId);
        return res.status(200).json({ message: "Reports fetched successfully", data: reports });
    } catch (error) {
       
        next(error); // Pass the error to the error handling middleware
    }
}
  export const testAuth = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "You are authenticated as admin",
      user: req.user,
    });
  };
  export const testAuthRescue = async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "You are authenticated as rescue",
      user: req.user,
    });
  };