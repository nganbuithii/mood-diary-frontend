"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { compressImage } from "@/lib/image";

export const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_SOURCE_PHOTO_SIZE_BYTES = 25 * 1024 * 1024;

export interface SelectedPhoto {
  file: File;
  previewUrl: string;
}

export function useDiaryPhotos() {
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const photosRef = useRef(photos);
  const isMountedRef = useRef(true);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  const addFiles = async (files: File[]) => {
    if (isProcessing) return;
    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const accepted: File[] = [];
    for (const file of files) {
      if (accepted.length >= remainingSlots) {
        toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
        break;
      }
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose image files only.");
        continue;
      }

      if (file.size > MAX_SOURCE_PHOTO_SIZE_BYTES) {
        toast.error("That photo is too large. Please choose one under 25MB.");
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length === 0) return;

    setIsProcessing(true);
    const compressed = await Promise.all(accepted.map(compressImage));
    if (!isMountedRef.current) return;
    setIsProcessing(false);

    const fitting = compressed.filter((file) => file.size <= MAX_PHOTO_SIZE_BYTES);
    if (fitting.length < compressed.length) {
      toast.error("Some photos are still larger than 5MB after resizing, so they were skipped.");
    }
    if (fitting.length > 0) {
      setPhotos((current) => [
        ...current,
        ...fitting.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
      ]);
    }
  };

  const removePhoto = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    setPhotos((current) => current.filter((photo) => photo.previewUrl !== previewUrl));
  };

  return { photos, addFiles, removePhoto, isProcessing };
}

interface DiaryPhotoPickerProps {
  photos: SelectedPhoto[];
  savedPhotoUrls?: string[];
  disabled?: boolean;
  isProcessing?: boolean;
  onAddFiles: (files: File[]) => void;
  onRemove: (previewUrl: string) => void;
}

export function DiaryPhotoPicker({
  photos,
  savedPhotoUrls = [],
  disabled = false,
  isProcessing = false,
  onAddFiles,
  onRemove,
}: DiaryPhotoPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New photos replace the saved ones, so saved photos show only until the user picks new ones.
  const showSavedPhotos = photos.length === 0 && savedPhotoUrls.length > 0;
  const displayedPhotoCount = showSavedPhotos ? savedPhotoUrls.length : photos.length;
  const canAddPhoto = displayedPhotoCount < MAX_PHOTOS;

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length > 0) onAddFiles(files);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {showSavedPhotos &&
          savedPhotoUrls.map((url) => (
            <div
              key={url}
              className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm sm:size-20"
            >
              <img src={url} alt="" className="size-full object-cover" />
            </div>
          ))}

        {photos.map(({ previewUrl }) => (
          <div
            key={previewUrl}
            className="group/photo relative size-16 shrink-0 overflow-hidden rounded-xl border border-border shadow-sm sm:size-20"
          >
            <img src={previewUrl} alt="" className="size-full object-cover" />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemove(previewUrl)}
              disabled={disabled}
              aria-label="Remove photo"
              className="absolute top-1 right-1 size-5 rounded-full bg-foreground/70 text-background opacity-0 hover:bg-foreground/90 hover:text-background group-hover/photo:opacity-100 focus-visible:opacity-100"
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}

        {isProcessing && (
          <div
            role="status"
            aria-label="Preparing photos"
            className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-border sm:size-20"
          >
            <Spinner size="sm" />
          </div>
        )}

        {canAddPhoto && !isProcessing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="h-16 w-16 flex-col gap-1 border-dashed border-primary/40 px-0 text-primary-hover hover:border-primary hover:bg-primary/5 hover:text-primary-hover sm:h-20 sm:w-20"
          >
            <ImagePlus className="size-5" />
            <span className="text-[0.65rem]">Add</span>
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleFilesSelected}
        disabled={disabled}
      />
    </>
  );
}
