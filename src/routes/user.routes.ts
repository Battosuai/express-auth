import express from "express";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../schema/user.schema";
import {
  createUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controller/user.controller";
import requireUser from "../middleware/requireUser";

const router = express.Router();

router.post("/user", validateResource(createUserSchema), createUserHandler);

router.post(
  "/user/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

router.post(
  "/user/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

router.post(
  "/user/reset-password/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

router.get("/users/me", requireUser, getCurrentUserHandler);

export default router;
