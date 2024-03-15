import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";
import sendEmail from "../utils/mailer";

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
