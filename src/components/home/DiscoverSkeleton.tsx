import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <span className={cn("panel-skeleton block rounded-md", className)} />;
}

const PILL_WIDTHS = ["w-14", "w-24", "w-16", "w-16", "w-20", "w-12"];

/**
 * Fallback for the home page "Discover" panel. Mirrors the real section's
 * categories, cover rail, journey columns and community card so the swap in
 * is invisible.
 */
export default function DiscoverSkeleton() {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading the latest arrivals"
      className="py-6 sm:py-8"
    >
      <span className="sr-only">Loading the latest arrivals…</span>

      <div className="mx-auto w-full max-w-3xl" aria-hidden>
        {/* categories */}
        <Block className="h-5 w-36" />

        <div className="mt-3 flex gap-2 overflow-hidden">
          {PILL_WIDTHS.map((width, index) => (
            <Block
              key={index}
              className={cn(
                "h-7 shrink-0 rounded-full",
                width,
                index === 0
                  ? "bg-[#183d32]/15 dark:bg-white/12"
                  : "bg-[#e9e4dc] dark:bg-white/[0.06]"
              )}
            />
          ))}
        </div>

        {/* new arrivals */}
        <div className="mt-7">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-2">
              <Block className="h-5 w-28" />
              <Block className="h-2.5 w-40" />
            </div>

            <Block className="h-2.5 w-14" />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((cover) => (
              <div key={cover}>
                <Block className="aspect-2/3 w-full rounded-lg sm:rounded-xl" />
                <Block className="mt-2 h-2.5 w-2/3" />
              </div>
            ))}
          </div>
        </div>

        {/* journey + why */}
        <div className="mt-8 border-t border-[#e9e4dc] pt-6 sm:mt-10 sm:pt-8 dark:border-white/10">
          <div className="grid gap-7 sm:grid-cols-2 sm:gap-10">
            {[0, 1].map((column) => (
              <div key={column}>
                <Block className="h-4 w-32" />
                <Block className="mt-2 h-2.5 w-full max-w-48" />
                <Block className="mt-1.5 h-2.5 w-2/3 max-w-40" />
                <Block
                  className={cn(
                    "mt-4 h-8 w-28 rounded-full",
                    column === 0
                      ? "bg-[#1F5B3E]/45"
                      : "bg-[#e9e4dc] dark:bg-white/[0.06]"
                  )}
                />
              </div>
            ))}
          </div>

          {/* community */}
          <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-[#e9e4dc] bg-[linear-gradient(135deg,#F2F7F3,#F6F2FC)] px-4 py-4 sm:px-6 sm:py-5 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(74,222,128,0.07),rgba(139,92,246,0.09))]">
            <div className="space-y-2">
              <Block className="h-4 w-48 max-w-full sm:h-5" />
              <Block className="h-2.5 w-36" />
            </div>

            <Block className="size-9 shrink-0 rounded-full bg-[#e9e4dc] dark:bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </section>
  );
}
