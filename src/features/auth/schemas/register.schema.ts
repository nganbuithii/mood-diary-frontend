import { z } from "zod";

import { emailField, newPasswordField } from "@/features/auth/schemas/fields";

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(1, "Display name is required")
      .max(100, "Display name must be at most 100 characters"),
    email: emailField,
    password: newPasswordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
