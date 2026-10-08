import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getReminderSettings, updateReminderSettings } from "@/features/profile/api/profile.api";
import { profileKeys } from "@/features/profile/constants/profile-query-keys";

export function useReminderSettings() {
  return useQuery({
    queryKey: profileKeys.reminder(),
    queryFn: getReminderSettings,
  });
}

export function useUpdateReminderSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReminderSettings,
    onSuccess: (settings) => queryClient.setQueryData(profileKeys.reminder(), settings),
  });
}
