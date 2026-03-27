import { Router } from "express";
import { CompanyController } from "./company.controller";
import { protect, adminOnly } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/public/list", CompanyController.getPublicList);

router.get("/", protect, adminOnly, CompanyController.getCompanies);
router.get("/:id", protect, CompanyController.getCompanyById);
router.post("/", protect, adminOnly, CompanyController.createCompany);
router.patch("/:id/interest", protect, adminOnly, CompanyController.updateInterestRate);
router.delete("/:id", protect, adminOnly, CompanyController.deleteCompany);

export default router;
