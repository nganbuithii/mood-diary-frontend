import { useMutation } from "@tanstack/react-query";

import { exportAccount } from "@/features/profile/api/profile.api";
import { formatDateKey } from "@/lib/date";
import { downloadJson } from "@/lib/download";

export function useExportAccount() {
  return useMutation({
    mutationFn: exportAccount,
    onSuccess: (data) => downloadJson(data, `moodiary-export-${formatDateKey(new Date())}.json`),
  });
}
