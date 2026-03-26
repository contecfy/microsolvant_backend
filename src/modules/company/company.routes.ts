import { Router } from "express";
import { CompanyController } from "./company.controller";

const router = Router();

router.get("/", CompanyController.getCompanies);
router.get("/:id", CompanyController.getCompanyById);
router.post("/", CompanyController.createCompany);
router.patch("/:id/interest", CompanyController.updateInterestRate);
router.delete("/:id", CompanyController.deleteCompany);

export default router;
