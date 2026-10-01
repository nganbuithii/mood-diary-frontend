import { useEffect, useRef, useState } from "react";

// Shared across every preview button so starting one song stops whichever was playing.
let currentAudio: HTMLAudioElement | null = null;

export function useSongPreview(previewUrl: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      if (currentAudio === audio) currentAudio = null;
    };
  }, []);

  const toggle = async () => {
    if (!previewUrl) return;

    let audio = audioRef.current;
    if (!audio) {
      // Created on first play so a page full of songs doesn't download any audio up front.
      audio = new Audio(previewUrl);
      audio.addEventListener("play", () => setIsPlaying(true));
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current = audio;
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }
    if (currentAudio && currentAudio !== audio) currentAudio.pause();
    currentAudio = audio;
    await audio.play();
  };

  return { isPlaying, toggle, canPlay: previewUrl !== null };
}
