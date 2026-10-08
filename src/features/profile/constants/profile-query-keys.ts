export const profileKeys = {
  all: ["profile"] as const,
  reminder: () => [...profileKeys.all, "reminder"] as const,
};
