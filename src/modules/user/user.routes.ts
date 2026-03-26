import { Router } from "express";
import { UserController } from "./user.controller";

import { protect } from "../../middlewares/auth.middleware";
const router = Router();

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);
router.get("/:id/eligibility", protect, UserController.getEligibility);
router.post("/", UserController.createUser);
router.post("/register-company", UserController.registerCompany);
router.post("/login", UserController.login);
router.post("/logout", protect, UserController.logout);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
