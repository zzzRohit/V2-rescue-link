import { NextFunction, Request, Response } from "express";
import * as reportService from "./report.service.js";
import { AppError } from "../../utils/Apperror.js";
export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reportData = await reportService.createReport(req.body, req.user?.userId);
    return res.status(200).json({ message: "Report created successfully", data: reportData });
  } catch (error) {
    console.error("Controller Error:", error);
    next(error); // Pass the error to the error handling middleware
  }
};
export const getMyReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("User ID is missing in the request", 401);
    }
    const reports = await reportService.getMyReports(userId);
    return res.status(200).json({ message: "Reports fetched successfully", data: reports });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};
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
export const getAvailableReports = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("User ID is missing in the request", 401);
  }
  try {
    const reports = await reportService.getAvailableReports(userId);
    return res
      .status(200)
      .json({ message: "Available reports fetched successfully", data: reports });
  } catch (error) {
    console.error("Controller Error:", error);
    next(error); // Pass the error to the error handling middleware
  }
};
export const acceptReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reportId = req.params.id;
    const userId = req.user?.userId;
    if (!reportId || Array.isArray(reportId)) {
      throw new AppError("Report ID is missing or invalid", 400);
    }
    if (!userId) {
      throw new AppError("User ID is missing in the request", 401);
    }
    const report = await reportService.acceptReport(reportId, userId);
    return res.status(200).json({ message: "Report accepted successfully", data: report });
  } catch (error) {
    console.error("Controller Error:", error);
    next(error); // Pass the error to the error handling middleware
  }
};
export const completeReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reportId = req.params.id;
    const userId = req.user?.userId;
    if (!reportId || Array.isArray(reportId)) {
      throw new AppError("Report ID is missing or invalid", 400);
    }
    if (!userId) {
      throw new AppError("User ID is missing in the request", 401);
    }
    const report = await reportService.completeReport(reportId, userId);
    return res.status(200).json({ message: "Report completed successfully", data: report });
  } catch (error) {
    console.error("Controller Error:", error);
    next(error); // Pass the error to the error handling middleware
  }
}
