"use client";

import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useReminderSettings, useUpdateReminderSettings } from "@/features/profile/hooks/use-reminder-settings";
import type { ReminderSettings } from "@/features/profile/types/reminder.types";
import { getErrorMessage } from "@/lib/api/http-error";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const hourFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric" });

function formatHour(hour: number) {
  return hourFormat.format(new Date(2000, 0, 1, hour));
}

function browserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function ReminderControl() {
  const { data: settings, isPending, isError } = useReminderSettings();
  const updateSettings = useUpdateReminderSettings();

  if (isPending) return <Spinner size="sm" />;
  if (isError || !settings) {
    return <span className="shrink-0 text-xs text-muted-foreground">Unavailable</span>;
  }

  const save = (next: Pick<ReminderSettings, "enabled" | "hour">) =>
    updateSettings.mutate(
      { ...next, timeZone: browserTimeZone() },
      {
        onSuccess: (saved) =>
          toast.success(saved.enabled ? `We'll nudge you at ${formatHour(saved.hour)} ♡` : "Reminder turned off"),
        onError: (error) => toast.error(getErrorMessage(error, "Couldn't save your reminder. Please try again.")),
      },
    );

  const isSaving = updateSettings.isPending;

  return (
    <div className="flex shrink-0 items-center gap-2">
      {settings.enabled && (
        <select
          aria-label="Reminder time"
          value={settings.hour}
          disabled={isSaving}
          onChange={(event) => save({ enabled: true, hour: Number(event.target.value) })}
          className="h-8 rounded-full border border-input bg-surface px-2.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
        >
          {HOURS.map((hour) => (
            <option key={hour} value={hour}>
              {formatHour(hour)}
            </option>
          ))}
        </select>
      )}
      <Switch
        aria-label="Daily check-in reminder"
        checked={settings.enabled}
        disabled={isSaving}
        onCheckedChange={(enabled) => save({ enabled, hour: settings.hour })}
      />
    </div>
  );
}
