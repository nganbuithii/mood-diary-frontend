import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
