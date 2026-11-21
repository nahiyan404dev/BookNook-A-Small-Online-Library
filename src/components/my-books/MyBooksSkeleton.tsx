import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("book-skeleton rounded-md", className)} />;
}

/**
 * Stats, filters and book grid. Used while the client hydrates the saved
 * library, so the real page header can stay on screen.
 */
export function MyBooksBodySkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]"
          >
            <div className="flex items-center justify-between gap-2">
              <Block className="size-9 rounded-xl" />
              <Block className="h-7 w-10" />
            </div>
            <Block className="mt-3 h-3 w-20" />
            <Block className="mt-1.5 h-2.5 w-24 max-w-full" />
          </div>
        ))}
      </div>

      {/* toolbar */}
      <div className="rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-[#1F1A33]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Block className="h-4 w-28" />
            <Block className="h-2.5 w-44 max-w-full" />
          </div>
          <Block className="h-10 w-full rounded-xl sm:w-64" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["w-16", "w-20", "w-24", "w-16", "w-20"].map((width, index) => (
            <Block key={index} className={cn("h-7 rounded-full", width)} />
          ))}
        </div>
      </div>

      {/* book grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-[#e9e4dc] bg-white p-3 dark:border-white/10 dark:bg-[#1F1A33]"
          >
            <div className="aspect-3/4 bg-[#f1ede5] dark:bg-white/5" />
            <div className="mt-4 h-4 w-4/5 bg-[#f1ede5] dark:bg-white/5" />
            <div className="mt-2 h-3 w-2/5 bg-[#f1ede5] dark:bg-white/5" />
            <div className="mt-4 flex items-center justify-between">
              <div className="h-6 w-16 bg-[#f1ede5] dark:bg-white/5" />
              <div className="h-6 w-10 bg-[#f1ede5] dark:bg-white/5" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-9 flex-1 bg-[#f1ede5] dark:bg-white/5" />
              <div className="h-9 w-10 bg-[#f1ede5] dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Route-level fallback for /my-books. Mirrors the page header, stats, filters
 * and grid so the swap in feels seamless.
 */
export default function MyBooksSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-[#F8F7FC] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-8 dark:bg-[#141126]"
    >
      <span className="sr-only">Loading your books…</span>

      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-3" aria-hidden="true">
          <Block className="h-4 w-28" />

          <div className="flex items-start gap-3">
            <Block className="size-11 shrink-0 rounded-xl bg-[#E5DDF7] dark:bg-[#8B5CF6]/20" />

            <div className="space-y-2">
              <Block className="h-7 w-40" />
              <Block className="h-3 w-72 max-w-full" />
            </div>
          </div>
        </div>

        <MyBooksBodySkeleton />
      </div>
    </div>
  );
}
