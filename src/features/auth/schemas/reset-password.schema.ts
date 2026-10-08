import { z } from "zod";

import { newPasswordField } from "@/features/auth/schemas/fields";

export const resetPasswordSchema = z
  .object({
    newPassword: newPasswordField,
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
