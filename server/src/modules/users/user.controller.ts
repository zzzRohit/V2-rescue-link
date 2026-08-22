import { Request, Response } from "express";
import * as userService from "./user.service.js";
import { AppError } from "../../utils/Apperror.js";

export const updateLocation = async (req: Request, res: Response, next: Function) => {
  try {
    const { longitude, latitude } = req.body ?? {};

    if (longitude === undefined || latitude === undefined) {
      throw new AppError("Latitude and longitude are required", 400);
    }
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("User ID is missing in the request", 400);
    }
    const response = await userService.updateLocation(userId, longitude, latitude);
    return res.status(200).json({ message: "Location updated successfully", data: response });
  } catch (error) {
    console.error("Controller Error:", error);
    next(error); // Pass the error to the error handling middleware
  }
};
export const updateAvailability = async (req: Request, res: Response, next: Function) => {
  try {
    const { isAvailable } = req.body ?? {};

    if (isAvailable === undefined) {
      throw new AppError("Availability status is required", 400);
    }
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("User ID is missing in the request", 400);
    }
    const response = await userService.updateAvailability(userId, isAvailable);
    return res.status(200).json({ message: "Availability updated successfully", data: response });
  }catch(e){
    next(e); // Pass the error to the error handling middleware
  }
}