export const achievementKeys = {
  all: ["achievements"] as const,
  summary: (date: string) => [...achievementKeys.all, "summary", date] as const,
};
