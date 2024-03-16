import { Request, Response } from "express";
import {
  CreateUserInput,
  VerifyUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../service/user.service";
import sendEmail from "../utils/mailer";
import log from "../utils/logger";
import { nanoid } from "nanoid";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      to: user.email,
      from: "test@example.com",
      subject: "Verify your email",
      text: `verification code: ${user.verificationCode}. Id: ${user._id}`,
    });

    const userObject: Partial<typeof user> = user.toObject();

    delete userObject.password;

    return res.status(201).json({
      success: true,
      message: "User successfully created",
      error: null,
      payload: userObject,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Account already exists",
        error: error,
        payload: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
      payload: null,
    });
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  const user = findUserById(id);

  if (!user) {
    return res.status(200).json({
      success: false,
      message: "Could not verify user",
      error: null,
      payload: null,
    });
  }

  if (user.verified) {
    return res.status(200).json({
      success: false,
      message: "User is already verified",
      error: null,
      payload: null,
    });
  }

  if (user.verificationCode === verificationCode) {
    user.verified = true;
    user.save();
    return res.status(200).json({
      success: true,
      message: "User successfully verified",
      error: null,
      payload: null,
    });
  }

  return res.status(200).json({
    success: false,
    message: "Could not verify user",
    error: null,
    payload: null,
  });
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const { email } = req.body;

  const message =
    "If a user with this email is registered, you will receive a password reset email";

  const user = findUserByEmail(email);

  if (!user) {
    log.debug(`User with email ${email} does not exist`);
    return res.status(200).json({
      success: true,
      message: message,
      error: null,
      payload: null,
    });
  }

  if (!user.verified) {
    return res.status(200).json({
      success: false,
      message: "User is not verified",
      error: null,
      payload: null,
    });
  }

  const passwordResetCode = nanoid();
  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    to: email,
    from: "test@example.com",
    subject: "Reset Password",
    text: `Password reset code: ${passwordResetCode}. Id: ${user._id}`,
  });

  log.debug(`Reset password email sent to ${email}`);

  return res.status(200).json({
    success: true,
    message: message,
    error: null,
    payload: null,
  });
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).json({
      success: false,
      message: "Could not reset password",
      error: null,
      payload: null,
    });
  }

  user.password = password;
  user.passwordResetCode = null;

  user.save();

  return res.status(200).json({
    success: true,
    message: "Successfully updated password",
    error: null,
    payload: null,
  });
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}
