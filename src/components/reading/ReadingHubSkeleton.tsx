import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("book-skeleton rounded-md", className)} />;
}

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-[#e9e4dc] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
      <div className="flex items-center justify-between gap-2">
        <Block className="size-9 rounded-xl" />
        <Block className="h-7 w-9" />
      </div>
      <Block className="mt-3 h-3 w-20" />
      <Block className="mt-1.5 h-2.5 w-24 max-w-full" />
    </div>
  );
}

function PanelHeadingSkeleton() {
  return (
    <div className="flex items-start gap-2.5">
      <Block className="size-8 shrink-0 rounded-lg" />
      <div className="space-y-2">
        <Block className="h-4 w-32" />
        <Block className="h-2.5 w-48 max-w-full" />
      </div>
    </div>
  );
}

function ContinueCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-[#e9e4dc] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
      <Block className="h-[108px] w-[76px] shrink-0 rounded-lg" />

      <div className="min-w-0 flex-1 space-y-2">
        <Block className="h-2.5 w-16 rounded-full" />
        <Block className="h-4 w-4/5" />
        <Block className="h-3 w-2/5" />

        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between gap-2">
            <Block className="h-2.5 w-24" />
            <Block className="h-2.5 w-14" />
          </div>
          <Block className="h-1.5 w-full rounded-full" />
          <div className="flex items-center justify-between gap-2">
            <Block className="h-2.5 w-24" />
            <Block className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListPanelSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
      <div className="border-b border-[#f0ece3] p-4 dark:border-white/10">
        <PanelHeadingSkeleton />
      </div>

      <div className="divide-y divide-[#f1eee8] dark:divide-white/[0.06]">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex gap-3 p-4">
            <Block className="h-[84px] w-[60px] shrink-0 rounded-md" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Block className="h-3.5 w-3/4" />
                  <Block className="h-2.5 w-2/5" />
                </div>
                <Block className="h-5 w-16 rounded-full" />
              </div>
              <Block className="h-1.5 w-3/5 rounded-full" />
              <div className="flex items-center justify-between gap-2">
                <Block className="h-2.5 w-28" />
                <Block className="h-3 w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Stats and shelves. Used inside the hub while local storage hydrates, so the
 * real page header can stay on screen.
 */
export function ReadingHubBodySkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      {/* stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatSkeleton key={index} />
        ))}
      </div>

      {/* continue reading */}
      <div>
        <PanelHeadingSkeleton />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ContinueCardSkeleton />
          <ContinueCardSkeleton />
        </div>
      </div>

      {/* loans + shelf */}
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <ListPanelSkeleton />
        <ListPanelSkeleton />
      </div>

      {/* browse */}
      <div>
        <PanelHeadingSkeleton />
        <Block className="mt-4 h-10 w-full max-w-sm rounded-xl" />

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#e9e4dc] bg-white p-2.5 dark:border-white/10 dark:bg-[#1F1A33]"
            >
              <Block className="aspect-3/4 rounded-md" />
              <Block className="mt-3 h-3.5 w-4/5" />
              <Block className="mt-1.5 h-2.5 w-2/5" />
              <Block className="mt-4 h-1.5 w-full rounded-full" />
              <Block className="mt-2 h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Route-level fallback for /read. Mirrors the page header, stats and shelves so
 * the swap in feels seamless while the catalogue loads.
 */
export default function ReadingHubSkeleton() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-[#faf9f6] px-4 py-8 transition-colors sm:px-6 sm:py-10 lg:px-8 dark:bg-[#141126]"
    >
      <span className="sr-only">Loading the reading room…</span>

      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Block className="h-6 w-44 rounded-full" />
            <Block className="h-9 w-52" />
            <Block className="h-3.5 w-96 max-w-full" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Block className="h-9 w-28 rounded-full" />
            <Block className="h-9 w-32 rounded-full" />
            <Block className="h-9 w-28 rounded-full" />
          </div>
        </div>

        <div className="mt-8">
          <ReadingHubBodySkeleton />
        </div>
      </div>
    </main>
  );
}
