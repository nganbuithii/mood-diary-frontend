import type { Mood } from "@/components/mood-diary/mood.constants";
import { formatDateKey } from "@/components/calendar/calendar.utils";
import type { DiaryEntryDto } from "@/features/diary/api/diary-entry.types";
import type { DiaryFeedPageDto, DiaryFeedQuery } from "@/features/diary/api/diary-feed.types";

// TODO: remove once GET /diaries/feed exists — swap getDiaryFeedMock for the real API call in use-diary-feed.ts.

const MOODS: Mood[] = ["VERY_HAPPY", "HAPPY", "HAPPY", "NEUTRAL", "NEUTRAL", "SAD", "VERY_SAD"];

const NOTES = [
  "Coffee with an old friend, felt so nice.",
  "Finished my side project demo!",
  "Quiet day, lots of rain.",
  "Missed the bus twice, rough morning.",
  "Baked cookies and they actually turned out great.",
  "Long walk by the lake after work.",
  "Too many meetings, need a nap.",
  "Found a new favourite song on the way home.",
  "Mom called, we talked for an hour.",
  "Tried a new ramen place — 10/10.",
  "Felt a bit lonely tonight.",
  "Cleaned my whole room, feels like a fresh start.",
  null,
];

const SONGS = [
  { id: "1445931937", title: "Sunflower", artist: "Post Malone & Swae Lee" },
  { id: "1440818839", title: "Lovely", artist: "Billie Eilish & Khalid" },
  { id: "1542172213", title: "Golden Hour", artist: "JVKE" },
];

// Small deterministic PRNG so the mock scrapbook looks the same on every render.
function createRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1_103_515_245 + 12_345) % 2_147_483_648;
    return value / 2_147_483_648;
  };
}

function buildMockEntries(today = new Date()): DiaryEntryDto[] {
  const random = createRandom(42);
  const entries: DiaryEntryDto[] = [];

  for (let daysAgo = 1; daysAgo <= 150; daysAgo += 1) {
    if (random() < 0.3) continue;
    const date = formatDateKey(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo),
    );
    const song = random() < 0.3 ? SONGS[Math.floor(random() * SONGS.length)] : null;

    entries.push({
      id: `mock-${date}`,
      date,
      mood: MOODS[Math.floor(random() * MOODS.length)],
      note: NOTES[Math.floor(random() * NOTES.length)],
      photoUrls: [],
      song: song && { ...song, artworkUrl: null, previewUrl: null },
      createdAt: `${date}T12:00:00.000Z`,
      updatedAt: `${date}T12:00:00.000Z`,
    });
  }
  return entries;
}

const MOCK_ENTRIES = buildMockEntries();

export async function getDiaryFeedMock({
  mood,
  month,
  limit,
  cursor,
}: DiaryFeedQuery): Promise<DiaryFeedPageDto> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Keyset pagination like the real API would do: cursor = date of the last item already returned.
  const matching = MOCK_ENTRIES.filter(
    (entry) =>
      (!mood || entry.mood === mood) &&
      (!month || entry.date.startsWith(month)) &&
      (!cursor || entry.date < cursor),
  );
  const items = matching.slice(0, limit);
  const hasMore = matching.length > limit;

  return { items, nextCursor: hasMore ? items[items.length - 1].date : null };
}
