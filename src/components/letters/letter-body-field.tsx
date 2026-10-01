"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Sparkles } from "lucide-react";

import { Chip } from "@/components/ui/chip";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { MAX_LETTER_LENGTH } from "@/features/letters/types/letter.types";

const PROMPTS = [
  "Right now, my days look like…",
  "Something I'm worried about is…",
  "I really hope that by now…",
  "A tiny thing that made me smile today:",
  "Please remember that…",
  "Dear me, I'm proud of you for…",
];

const RULED_LINES =
  "[background-attachment:local] [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(2rem-1px),var(--border)_calc(2rem-1px),var(--border)_2rem)]";

interface LetterBodyFieldProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export interface LetterBodyFieldHandle {
  focus: () => void;
}

export const LetterBodyField = forwardRef<LetterBodyFieldHandle, LetterBodyFieldProps>(function LetterBodyField(
  { value, disabled = false, onChange },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus() }), []);

  const isTooLong = value.length > MAX_LETTER_LENGTH;

  const insertPrompt = (prompt: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const separator = before.length === 0 || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const insert = `${separator}${prompt} `;
    onChange(before + insert + value.slice(end));
    requestAnimationFrame(() => {
      const caret = start + insert.length;
      textarea?.focus();
      textarea?.setSelectionRange(caret, caret);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles aria-hidden className="size-3.5 text-primary-hover" /> Stuck? Start with one of these
        </span>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
          {PROMPTS.map((prompt) => (
            <Chip key={prompt} variant="dashed" disabled={disabled} onClick={() => insertPrompt(prompt)}>
              {prompt}
            </Chip>
          ))}
        </div>
      </div>

      <Field
        data-invalid={isTooLong || undefined}
        className="relative rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-foreground/5 sm:p-7"
      >
        <span aria-hidden className="absolute -top-2 left-10 h-4 w-14 -rotate-3 rounded-[2px] bg-accent-green/60" />
        <span aria-hidden className="absolute -top-2 right-10 h-4 w-14 rotate-2 rounded-[2px] bg-secondary/50" />
        <FieldLabel htmlFor="letter-body" className="font-heading text-2xl text-foreground">
          Dear future me,
        </FieldLabel>
        <Textarea
          ref={textareaRef}
          id="letter-body"
          value={value}
          disabled={disabled}
          rows={12}
          aria-invalid={isTooLong || undefined}
          aria-describedby="letter-count"
          placeholder="How are you, really? Today I…"
          onChange={(event) => onChange(event.target.value)}
          className={`min-h-96 resize-y rounded-none border-0 bg-transparent px-0 py-0 font-heading text-lg leading-8 shadow-none focus-visible:ring-0 md:text-lg dark:bg-transparent ${RULED_LINES}`}
        />
        <div className="flex items-center justify-between gap-3">
          <span aria-hidden className="font-heading text-base text-muted-foreground">
            With love, me ♡
          </span>
          <FieldDescription
            id="letter-count"
            className={isTooLong ? "font-medium text-destructive" : "text-xs tabular-nums"}
          >
            {isTooLong && "Too long · "}
            {value.length.toLocaleString()} / {MAX_LETTER_LENGTH.toLocaleString()}
          </FieldDescription>
        </div>
      </Field>
    </>
  );
});
