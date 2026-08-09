import { Router } from "express";
import * as reportController from "./report.controller.js";
import { middleware } from "../../middleware/auth.middleware.js";
import { testAuth } from "./report.controller.js";
import { optionalAuth } from "../../middleware/optional.middleware.js";
const router = Router();
router.post("/",
    optionalAuth,
     reportController.createReport);
// router.get("/test-auth", middleware, testAuth);
export default router;
