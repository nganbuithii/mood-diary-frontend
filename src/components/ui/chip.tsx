import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const chipVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 border text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 aria-pressed:border-primary/70 aria-pressed:bg-primary/15 aria-pressed:font-medium aria-pressed:text-foreground aria-pressed:shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-muted-foreground hover:text-foreground",
        dashed: "border-dashed border-primary/50 bg-primary/5 text-foreground hover:border-primary hover:bg-primary/15",
      },
      shape: {
        pill: "rounded-full px-3 py-1",
        tile: "flex-col gap-0.5 rounded-2xl px-3 py-2.5",
      },
    },
    defaultVariants: { variant: "default", shape: "pill" },
  },
);

interface ChipProps extends React.ComponentProps<"button">, VariantProps<typeof chipVariants> {
  selected?: boolean;
}

function Chip({ className, variant, shape, selected, type = "button", ...props }: ChipProps) {
  return (
    <button
      type={type}
      data-slot="chip"
      aria-pressed={selected}
      className={cn(chipVariants({ variant, shape }), className)}
      {...props}
    />
  );
}

export { Chip, chipVariants };
