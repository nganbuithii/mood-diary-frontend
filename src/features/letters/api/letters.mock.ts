import { ApiError } from "@/lib/api/http-error";
import type { Mood } from "@/components/mood-diary/mood.constants";
import {
  MAX_LETTER_LENGTH,
  MAX_SEALED_LETTERS,
  type CreateLetterRequest,
  type LetterStatus,
  type LetterSummaryDto,
  type OpenedLetterDto,
} from "@/features/letters/types/letter.types";

// Stand-in for the /letters API until the backend ships; mirrors its rules.

interface StoredLetter {
  id: string;
  body: string;
  moodAtWriting: Mood | null;
  deliverAt: string;
  createdAt: string;
  openedAt: string | null;
}

const STORAGE_KEY = "moodiary-mock-letters";
const DAY_MS = 86_400_000;
const PREVIEW_LENGTH = 120;

function atEightAm(daysFromNow: number) {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysFromNow, 8).toISOString();
}

function seed(): StoredLetter[] {
  return [
    {
      id: "mock-ready",
      body: "Hi future me,\n\nRight now I'm sitting by the window with a cup of tea, a little nervous about the new job. I hope you're proud of how brave we were. Whatever happened, be kind to yourself today ♡",
      moodAtWriting: "NEUTRAL",
      deliverAt: atEightAm(-1),
      createdAt: atEightAm(-366),
      openedAt: null,
    },
    {
      id: "mock-sealed-soon",
      body: "A surprise for later.",
      moodAtWriting: "HAPPY",
      deliverAt: atEightAm(23),
      createdAt: atEightAm(-40),
      openedAt: null,
    },
    {
      id: "mock-sealed-later",
      body: "See you next year.",
      moodAtWriting: "VERY_HAPPY",
      deliverAt: atEightAm(240),
      createdAt: atEightAm(-5),
      openedAt: null,
    },
    {
      id: "mock-opened",
      body: "Dear me,\n\nYou made it through the exams! Go get that bubble tea you promised yourself.",
      moodAtWriting: "SAD",
      deliverAt: atEightAm(-30),
      createdAt: atEightAm(-200),
      openedAt: atEightAm(-29),
    },
  ];
}

function load(): StoredLetter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredLetter[];
  } catch {
    // fall through to a fresh seed
  }
  const letters = seed();
  save(letters);
  return letters;
}

function save(letters: StoredLetter[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
  } catch {
    // storage blocked: the mock just won't persist
  }
}

function statusOf(letter: StoredLetter, now = Date.now()): LetterStatus {
  if (letter.openedAt) return "opened";
  return new Date(letter.deliverAt).getTime() <= now ? "ready" : "sealed";
}

function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function toSummary(letter: StoredLetter): LetterSummaryDto {
  const status = statusOf(letter);
  return {
    id: letter.id,
    deliverAt: letter.deliverAt,
    createdAt: letter.createdAt,
    status,
    moodAtWriting: letter.moodAtWriting,
    preview: status === "opened" ? letter.body.slice(0, PREVIEW_LENGTH) : null,
  };
}

export async function mockListLetters(): Promise<LetterSummaryDto[]> {
  const letters = load().sort((a, b) => a.deliverAt.localeCompare(b.deliverAt));
  return delay(letters.map(toSummary));
}

export async function mockCreateLetter(input: CreateLetterRequest): Promise<LetterSummaryDto> {
  const body = input.body.trim();
  const deliverAt = new Date(input.deliverAt);
  const now = Date.now();

  if (!body) throw new ApiError(400, "Your letter is empty.");
  if (body.length > MAX_LETTER_LENGTH) throw new ApiError(400, `Letters can be up to ${MAX_LETTER_LENGTH} characters.`);
  if (Number.isNaN(deliverAt.getTime()) || deliverAt.getTime() < now + DAY_MS / 2) {
    throw new ApiError(400, "Pick a day from tomorrow onwards.");
  }
  if (deliverAt.getTime() > now + 10 * 366 * DAY_MS) throw new ApiError(400, "Letters can wait up to 10 years.");

  const letters = load();
  if (letters.filter((letter) => statusOf(letter, now) === "sealed").length >= MAX_SEALED_LETTERS) {
    throw new ApiError(409, `You already have ${MAX_SEALED_LETTERS} sealed letters waiting.`);
  }

  const letter: StoredLetter = {
    id: crypto.randomUUID(),
    body,
    moodAtWriting: input.moodAtWriting ?? null,
    deliverAt: deliverAt.toISOString(),
    createdAt: new Date(now).toISOString(),
    openedAt: null,
  };
  save([...letters, letter]);
  return delay(toSummary(letter), 700);
}

export async function mockOpenLetter(id: string): Promise<OpenedLetterDto> {
  const letters = load();
  const letter = letters.find((item) => item.id === id);
  if (!letter) throw new ApiError(404, "This letter doesn't exist anymore.");

  const opensOn = new Date(letter.deliverAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  if (statusOf(letter) === "sealed") throw new ApiError(403, `This letter opens on ${opensOn}.`);

  letter.openedAt ??= new Date().toISOString();
  save(letters);
  return delay({ ...letter, openedAt: letter.openedAt }, 600);
}

export async function mockDeleteLetter(id: string): Promise<void> {
  const letters = load();
  if (!letters.some((letter) => letter.id === id)) throw new ApiError(404, "This letter doesn't exist anymore.");
  save(letters.filter((letter) => letter.id !== id));
  return delay(undefined, 400);
}
