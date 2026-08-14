import { Router } from "express";
import * as reportController from "./report.controller.js";
import { middleware } from "../../middleware/auth.middleware.js";
import { optionalAuth } from "../../middleware/optional.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();
router.post("/",
    optionalAuth,
    
    reportController.createReport);
router.get("/my",
    middleware,
    reportController.getMyReports);

router.get("/admin-test" , middleware, authorize(Role.ADMIN ) , reportController.testAuth);
router.get(
  "/rescue-test",
  middleware,
  authorize(Role.ADMIN, Role.RESCUER),
  reportController.testAuthRescue
);
router.get(
  "/available",
  middleware,
  authorize(Role.RESCUER),
  reportController.getAvailableReports
);
router.patch("/:id/accept" , middleware, authorize(Role.RESCUER), reportController.acceptReport);

router.patch("/:id/complete" , middleware, authorize(Role.RESCUER), reportController.completeReport);
// router.get("/test-auth", middleware, testAuth);
export default router;
