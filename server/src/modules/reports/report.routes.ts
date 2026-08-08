import { Router } from "express";
import * as reportController from "./report.controller.js";
import { middleware } from "../../middleware/auth.middleware.js";
import { testAuth } from "./report.controller.js";
const router = Router();
router.post("/", reportController.createReport);
router.get("/test-auth", middleware, testAuth);
export default router;
