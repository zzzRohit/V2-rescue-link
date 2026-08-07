import {Router} from "express"
import * as reportController from "./report.controller.js"
const router = Router();
router.post('/', reportController.createReport);
export default router;