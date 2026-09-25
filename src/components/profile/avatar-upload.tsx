"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Spinner } from "@/components/ui/spinner";
import { useUploadAvatar } from "@/features/profile/hooks/use-upload-avatar";
import { ApiError } from "@/lib/api/http-error";

interface AvatarUploadProps {
  initial: string;
  avatarUrl?: string | null;
  size?: "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarUploadProps["size"]>, string> = {
  md: "size-20 text-3xl",
  lg: "size-28 text-4xl sm:size-32 sm:text-5xl",
};

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export function AvatarUpload({
  initial,
  avatarUrl = null,
  size = "md",
  className,
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatar();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });

    uploadAvatarMutation.mutate(file, {
      onSuccess: () => {
        setPreviewUrl(null);
        toast.success("Profile photo updated.");
      },
      onError: (uploadError) => {
        setPreviewUrl(null);
        toast.error(
          uploadError instanceof ApiError
            ? uploadError.message
            : "Couldn't upload your photo. Please try again.",
        );
      },
    });
  };

  const isUploading = uploadAvatarMutation.isPending;
  const displayUrl = previewUrl ?? avatarUrl;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative inline-flex">
        <span
          className={cn(
            "flex items-center justify-center overflow-hidden rounded-full bg-primary/20 font-heading text-foreground ring-4 ring-surface",
            SIZE_CLASSES[size],
          )}
        >
          {displayUrl ? (
            <img src={displayUrl} alt="" className="size-full object-cover" />
          ) : (
            initial
          )}
        </span>

        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Spinner size="sm" className="border-white border-t-transparent" />
          </span>
        )}

        <button
          type="button"
          aria-label="Change profile photo"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-50"
        >
          <Camera className="size-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
