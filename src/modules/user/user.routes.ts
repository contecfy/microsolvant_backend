import { Router } from "express";
import { UserController } from "./user.controller";

import { protect, staffOnly } from "../../middlewares/auth.middleware";
const router = Router();

router.get("/", protect, UserController.getUsers);
router.get("/search/:nationalId", protect, staffOnly, UserController.searchGlobally);
router.get("/:id", protect, UserController.getUserById);
router.get("/:id/eligibility", protect, UserController.getEligibility);
router.post("/", UserController.createUser);
router.post("/register-company", UserController.registerCompany);
router.post("/login", UserController.login);
router.post("/logout", protect, UserController.logout);
router.post("/:id/link", protect, staffOnly, UserController.linkToCompany);
router.put("/:id", protect, UserController.updateUser);
router.delete("/:id", protect, UserController.deleteUser);

export default router;
