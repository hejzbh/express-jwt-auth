import { Router } from "express";
import * as AuthController from "@/controllers/auth.js";

const router = Router();

router
  .post("/login", AuthController.login)
  .post("/register", AuthController.register)
  .post("/refresh-token", AuthController.refresh);

export default router;
