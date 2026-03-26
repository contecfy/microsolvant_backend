import { Router } from "express";
import UserRoutes from "./modules/user/user.routes";
import InvestmentRoutes from "./modules/investment/investment.routes";
import LoanRoutes from "./modules/loan/loan.routes";
import CollateralRoutes from "./modules/collateral/collateral.routes";
import RepaymentRoutes from "./modules/repayment/repayment.routes";
import ReportRoutes from "./modules/report/report.routes";
import ScheduleRoutes from "./modules/schedule/schedule.routes";
import CompanyRoutes from "./modules/company/company.routes";

const router = Router();

router.use("/users", UserRoutes);
router.use("/investments", InvestmentRoutes);
router.use("/loans", LoanRoutes);
router.use("/collateral", CollateralRoutes);
router.use("/repayments", RepaymentRoutes);
router.use("/reports", ReportRoutes);
router.use("/schedules", ScheduleRoutes);
router.use("/companies", CompanyRoutes);

export default router;
