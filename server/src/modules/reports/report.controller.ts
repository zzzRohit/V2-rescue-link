import { Request, Response } from "express";
import * as reportService from "./report.service.js";
export const createReport = async (req: Request, res: Response) => {
    try {
        const reportData = await reportService.createReport(req.body);
        return res.status(200).json({ message: "Report created successfully", data: reportData });
    } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
        error: error instanceof Error ? error.message : error,
    });
}
}
export const testAuth = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Authentication middleware works",
    user: req.user,
  });
};