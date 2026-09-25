import type { Mood } from "@/components/mood-diary/mood.constants";

export interface Song {
  id: string;
  title: string;
  artist: string;
  mood: Mood;
}

export const SONG_SUGGESTIONS: Song[] = [
  { id: "someone-like-you", title: "Someone Like You", artist: "Adele", mood: "VERY_SAD" },
  { id: "fix-you", title: "Fix You", artist: "Coldplay", mood: "VERY_SAD" },
  { id: "lovely", title: "lovely", artist: "Billie Eilish, Khalid", mood: "SAD" },
  { id: "let-her-go", title: "Let Her Go", artist: "Passenger", mood: "SAD" },
  { id: "banana-pancakes", title: "Banana Pancakes", artist: "Jack Johnson", mood: "NEUTRAL" },
  { id: "sunday-best", title: "Sunday Best", artist: "Surfaces", mood: "NEUTRAL" },
  { id: "good-days", title: "Good Days", artist: "SZA", mood: "HAPPY" },
  { id: "sunflower", title: "Sunflower", artist: "Post Malone, Swae Lee", mood: "HAPPY" },
  { id: "walking-on-sunshine", title: "Walking on Sunshine", artist: "Katrina & The Waves", mood: "VERY_HAPPY" },
  { id: "lover", title: "Lover", artist: "Taylor Swift", mood: "VERY_HAPPY" },
];
