import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/loan/:loanId", ScheduleController.getSchedulesByLoanId);
router.patch("/:id", protect, ScheduleController.updateScheduleStatus);

export default router;
