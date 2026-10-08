"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { TextField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { PasswordField } from "@/components/auth/password-input";
import { ExportDiaryButton } from "@/components/profile/export-diary-button";
import { useDeleteAccount } from "@/features/profile/hooks/use-delete-account";
import {
  DELETE_CONFIRMATION_WORD,
  deleteAccountSchema,
  type DeleteAccountFormValues,
} from "@/features/profile/schemas/delete-account.schema";
import { ApiError, getErrorMessage } from "@/lib/api/http-error";
import { HTTP_STATUS } from "@/lib/api/http-status";

export function DeleteAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const deleteAccount = useDeleteAccount();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "", confirmation: "" },
  });

  const isDeleting = deleteAccount.isPending;

  const handleOpenChange = (open: boolean) => {
    if (isDeleting) return;
    setIsOpen(open);
    if (!open) reset();
  };

  const onSubmit = handleSubmit(async ({ password }) => {
    try {
      await deleteAccount.mutateAsync(password);
      window.location.replace("/");
    } catch (error) {
      if (error instanceof ApiError && error.status === HTTP_STATUS.FORBIDDEN) {
        setError("password", { message: error.message });
        return;
      }
      setError("root", {
        message: getErrorMessage(error, "Couldn't delete your account. Please try again."),
      });
    }
  });

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
      >
        Delete
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={!isDeleting} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This removes your account, every diary page, photo and letter for good — it can&apos;t be undone.
              You may want to keep a copy first.
            </DialogDescription>
            <ExportDiaryButton />
          </DialogHeader>

          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <PasswordField
                id="delete-account-password"
                label="Password"
                icon={<Lock />}
                autoComplete="current-password"
                disabled={isDeleting}
                error={errors.password}
                {...register("password")}
              />

              <TextField
                id="delete-account-confirmation"
                label={
                  <>
                    Type <span className="font-mono font-semibold">{DELETE_CONFIRMATION_WORD}</span> to confirm
                  </>
                }
                autoComplete="off"
                disabled={isDeleting}
                error={errors.confirmation}
                {...register("confirmation")}
              />

              <FieldError errors={[errors.root]} />

              <DialogFooter>
                <Button type="button" variant="outline" disabled={isDeleting} onClick={() => handleOpenChange(false)}>
                  Keep my account
                </Button>
                <SubmitButton
                  variant="destructive"
                  className="sm:w-auto"
                  isPending={isDeleting}
                  pendingLabel="Deleting..."
                >
                  Delete forever
                </SubmitButton>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
