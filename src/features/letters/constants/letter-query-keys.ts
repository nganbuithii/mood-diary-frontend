export const letterKeys = {
  all: ["letters"] as const,
  list: () => [...letterKeys.all, "list"] as const,
  opened: (id: string) => [...letterKeys.all, "opened", id] as const,
};
