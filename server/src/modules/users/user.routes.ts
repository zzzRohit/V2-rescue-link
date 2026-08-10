import { Router } from "express";
import * as userController from "./user.controller.js";
import { middleware } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { Role } from "../../../generated/prisma/client.js";

const router = Router();
router.patch("/location", middleware,authorize(Role.RESCUER), userController.updateLocation);

export default router;