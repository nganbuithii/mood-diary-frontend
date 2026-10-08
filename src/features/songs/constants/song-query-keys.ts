export const songKeys = {
  all: ["songs"] as const,
  search: (query: string) => [...songKeys.all, "search", query] as const,
  trending: () => [...songKeys.all, "trending"] as const,
};
