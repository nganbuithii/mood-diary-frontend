export const healthKeys = {
  all: ["health"] as const,
  wakeUp: () => [...healthKeys.all, "wake-up"] as const,
};
