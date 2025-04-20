import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email().min(1),
    password: z
      .string()
      .min(5)
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
