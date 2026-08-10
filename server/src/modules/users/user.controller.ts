    import { Request, Response } from "express";
    import * as userService from "./user.service.js";

    export const updateLocation = async (req: Request, res: Response , next: Function) => {
        try{
            const { longitude, latitude } = req.body;
        const userId = req.user?.userId;
        if(!userId) {
            return res.status(400).json({ message: "User ID is missing in the request" });
        }
        const response = await userService.updateLocation(userId, longitude, latitude);
        return res.status(200).json({ message: "Location updated successfully", data: response });
        }catch(error){
            console.error("Controller Error:", error);
            next(error); // Pass the error to the error handling middleware
        }
    }