"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "cn";

interface AvatarUploadProps {
  initial: string;
  size?: "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarUploadProps["size"]>, string> = {
  md: "size-20 text-3xl",
  lg: "size-28 text-4xl sm:size-32 sm:text-5xl",
};

export function AvatarUpload({
  initial,
  size = "md",
  className,
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;


    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <span
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-full bg-primary/20 font-heading text-foreground ring-4 ring-surface",
          SIZE_CLASSES[size],
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not an optimizable remote asset
          <img
            src={previewUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          initial
        )}
      </span>

      <button
        type="button"
        aria-label="Change profile photo"
        onClick={() => fileInputRef.current?.click()}
        className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
      >
        <Camera className="size-4" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
}
