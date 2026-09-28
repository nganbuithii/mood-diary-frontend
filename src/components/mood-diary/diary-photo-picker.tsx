"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export const MAX_PHOTOS = 3;
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export interface SelectedPhoto {
  file: File;
  previewUrl: string;
}

export function useDiaryPhotos() {
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  const addFiles = (files: File[]) => {
    const remainingSlots = MAX_PHOTOS - photos.length;
    if (remainingSlots <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const accepted: SelectedPhoto[] = [];
    for (const file of files) {
      if (accepted.length >= remainingSlots) {
        toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
        break;
      }
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose image files only.");
        continue;
      }

      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        toast.error("Each photo must be smaller than 5MB.");
        continue;
      }
      accepted.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    if (accepted.length > 0) {
      setPhotos((current) => [...current, ...accepted]);
    }
  };

  const removePhoto = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    setPhotos((current) => current.filter((photo) => photo.previewUrl !== previewUrl));
  };

  return { photos, addFiles, removePhoto };
}

interface DiaryPhotoPickerProps {
  photos: SelectedPhoto[];
  savedPhotoUrls?: string[];
  disabled?: boolean;
  onAddFiles: (files: File[]) => void;
  onRemove: (previewUrl: string) => void;
}

export function DiaryPhotoPicker({
  photos,
  savedPhotoUrls = [],
  disabled = false,
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

        {canAddPhoto && (
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
