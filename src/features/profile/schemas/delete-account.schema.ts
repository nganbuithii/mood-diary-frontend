import { z } from "zod";

export const DELETE_CONFIRMATION_WORD = "DELETE";

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmation: z.string().refine((value) => value.trim() === DELETE_CONFIRMATION_WORD, {
    message: `Type ${DELETE_CONFIRMATION_WORD} to confirm`,
  }),
});

export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;
