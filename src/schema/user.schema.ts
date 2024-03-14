import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    }),
    lastName: string({
      required_error: "Last name is required",
    }),
    password: string({
      required_error: "First name is required",
    })
      .min(8, "Password is too short. Minimum 8 characters is required")
      .max(25, "Password must not be more than 25 characters"),
    confirmPassword: string({
      required_error: "Confirm password is required",
    }),
    email: string({
      required_error: "Email is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
