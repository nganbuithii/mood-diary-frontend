import { z } from "zod";

import { emailField } from "@/features/auth/schemas/fields";

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
