import { useEffect, useRef, useState } from "react";

import { Chip } from "@/components/ui/chip";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  addMonthsClamped,
  deliverAtFor,
  earliestDeliveryDay,
  formatOpeningTime,
  latestDeliveryDay,
  timeUntilLabel,
} from "@/features/letters/utils/letter-dates";
import { formatDate, formatDateKey, tryParseDateKey } from "@/lib/date";
import { useToday } from "@/lib/hooks/use-today";

const PRESETS = [
  { label: "1 month", months: 1, emoji: "🌱" },
  { label: "6 months", months: 6, emoji: "🌷" },
  { label: "1 year", months: 12, emoji: "🎂" },
  { label: "5 years", months: 60, emoji: "🌳" },
] as const;

function matchesPreset(day: Date, today: Date) {
  const key = formatDateKey(day);
  return PRESETS.some((preset) => formatDateKey(addMonthsClamped(today, preset.months)) === key);
}

interface DeliveryDayPickerProps {
  value: Date;
  onChange: (day: Date) => void;
}

export function DeliveryDayPicker({ value, onChange }: DeliveryDayPickerProps) {
  const today = useToday();
  const earliest = earliestDeliveryDay(today);
  const latest = latestDeliveryDay(today);
  const selectedKey = formatDateKey(value);

  const [isCustom, setIsCustom] = useState(() => !matchesPreset(value, today));
  const dateInputRef = useRef<HTMLInputElement>(null);
  const shouldOpenPicker = useRef(false);

  useEffect(() => {
    if (!isCustom || !shouldOpenPicker.current) return;
    shouldOpenPicker.current = false;
    const input = dateInputRef.current;
    input?.focus();
    try {
      input?.showPicker();
    } catch {}
  }, [isCustom]);

  const pickCustom = () => {
    shouldOpenPicker.current = true;
    setIsCustom(true);
  };

  return (
    <>
      <div role="group" aria-label="When it arrives" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {PRESETS.map((preset) => {
          const day = addMonthsClamped(today, preset.months);
          return (
            <Chip
              key={preset.label}
              shape="tile"
              selected={!isCustom && formatDateKey(day) === selectedKey}
              onClick={() => {
                setIsCustom(false);
                onChange(day);
              }}
            >
              <span aria-hidden className="text-xl">
                {preset.emoji}
              </span>
              In {preset.label}
              <span className="text-[11px] font-normal text-muted-foreground">{formatDate(day, "shortDate")}</span>
            </Chip>
          );
        })}
        <Chip shape="tile" selected={isCustom} onClick={pickCustom} className="col-span-2 sm:col-span-1">
          <span aria-hidden className="text-xl">
            📅
          </span>
          A special day
          <span className="text-[11px] font-normal text-muted-foreground">
            {isCustom ? formatDate(value, "shortDate") : "Pick any date"}
          </span>
        </Chip>
      </div>

      {isCustom && (
        <Field className="gap-1.5 rounded-2xl bg-muted/40 px-4 py-3">
          <FieldLabel htmlFor="delivery-day">Which day?</FieldLabel>
          <Input
            ref={dateInputRef}
            id="delivery-day"
            type="date"
            value={selectedKey}
            min={formatDateKey(earliest)}
            max={formatDateKey(latest)}
            onChange={(event) => {
              const day = tryParseDateKey(event.target.value);
              if (day && day >= earliest && day <= latest) onChange(day);
            }}
            className="h-10 w-full rounded-full bg-surface px-4 sm:w-56"
          />
          <FieldDescription className="text-xs">
            A birthday, an anniversary, New Year… anytime from tomorrow up to 10 years ahead.
          </FieldDescription>
        </Field>
      )}

      <div
        aria-live="polite"
        className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-5 py-4"
      >
        <span
          aria-hidden
          className="flex size-12 shrink-0 -rotate-6 items-center justify-center rounded-xl bg-surface text-2xl shadow-sm"
        >
          ✉️
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Your letter arrives on</span>
          <span className="font-heading text-lg leading-tight text-foreground">{formatDate(value, "weekdayDate")}</span>
          <span className="text-xs text-muted-foreground">
            at {formatOpeningTime()} · {timeUntilLabel(deliverAtFor(value), today)}
          </span>
        </div>
      </div>
    </>
  );
}
