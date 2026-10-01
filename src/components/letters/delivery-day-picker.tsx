import { Chip } from "@/components/ui/chip";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  addMonthsClamped,
  deliverAtFor,
  earliestDeliveryDay,
  fromDateInputValue,
  latestDeliveryDay,
  opensInLabel,
  toDateInputValue,
} from "@/features/letters/utils/letter-dates";

const PRESETS = [
  { label: "1 month", months: 1, emoji: "🌱" },
  { label: "6 months", months: 6, emoji: "🌷" },
  { label: "1 year", months: 12, emoji: "🎂" },
  { label: "5 years", months: 60, emoji: "🌳" },
] as const;

export function formatDeliveryDay(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

interface DeliveryDayPickerProps {
  value: Date;
  onChange: (day: Date) => void;
}

export function DeliveryDayPicker({ value, onChange }: DeliveryDayPickerProps) {
  const today = new Date();
  const earliest = earliestDeliveryDay(today);
  const latest = latestDeliveryDay(today);
  const selectedKey = toDateInputValue(value);

  return (
    <>
      <div role="group" aria-label="Quick picks" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRESETS.map((preset) => {
          const day = addMonthsClamped(today, preset.months);
          return (
            <Chip
              key={preset.label}
              shape="tile"
              selected={toDateInputValue(day) === selectedKey}
              onClick={() => onChange(day)}
            >
              <span aria-hidden className="text-xl">
                {preset.emoji}
              </span>
              In {preset.label}
            </Chip>
          );
        })}
      </div>

      <Field orientation="horizontal" className="flex-wrap gap-2">
        <FieldLabel htmlFor="delivery-day" className="font-normal text-muted-foreground">
          Or pick a special day
        </FieldLabel>
        <Input
          id="delivery-day"
          type="date"
          value={selectedKey}
          min={toDateInputValue(earliest)}
          max={toDateInputValue(latest)}
          onChange={(event) => {
            const day = fromDateInputValue(event.target.value);
            if (day && day >= earliest && day <= latest) onChange(day);
          }}
          className="h-9 w-auto rounded-full bg-surface px-3"
        />
        <span className="text-xs text-muted-foreground">(a birthday, an anniversary, New Year…)</span>
      </Field>

      <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3">
        <span aria-hidden className="-rotate-6 text-2xl">
          ✉️
        </span>
        <p className="text-sm text-foreground">
          Arrives <span className="font-medium">{formatDeliveryDay(value)}</span> at 8:00 am
          <span className="block text-xs text-muted-foreground">{opensInLabel(deliverAtFor(value))}</span>
        </p>
      </div>
    </>
  );
}
