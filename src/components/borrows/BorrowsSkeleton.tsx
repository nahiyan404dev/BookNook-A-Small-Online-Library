import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("book-skeleton rounded-md", className)} />;
}

/**
 * Stats + loans + shelf. Used while the client hydrates the saved loans, so
 * the real page header can stay on screen.
 */
export function BorrowsBodySkeleton() {
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
              <Block className="h-7 w-8" />
            </div>
            <Block className="mt-3 h-3 w-20" />
            <Block className="mt-1.5 h-2.5 w-24 max-w-full" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* loans card */}
        <div className="overflow-hidden rounded-2xl border border-[#EAE7F2] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
          <div className="flex flex-col gap-3 border-b border-[#EAE7F2] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-white/10">
            <div className="space-y-2">
              <Block className="h-4 w-24" />
              <Block className="h-2.5 w-40" />
            </div>
            <Block className="h-9 w-full rounded-xl sm:w-52" />
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-3 border-b border-[#F1EEF8] p-4 last:border-0 sm:gap-4 sm:p-5 dark:border-white/[0.06]"
            >
              <Block className="h-[92px] w-16 shrink-0 rounded-lg sm:h-[100px] sm:w-[70px]" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <Block className="h-4 w-2/3" />
                  <Block className="h-5 w-16 shrink-0 rounded-full" />
                </div>
                <Block className="h-3 w-1/3" />

                <div className="flex flex-wrap gap-4 pt-1.5">
                  <Block className="h-3 w-20" />
                  <Block className="h-3 w-20" />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <Block className="h-3 w-24" />
                  <Block className="h-8 w-20 shrink-0 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* borrow shelf card */}
        <div className="overflow-hidden rounded-2xl border border-[#EAE7F2] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
          <div className="border-b border-[#EAE7F2] p-4 sm:p-5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Block className="size-4" />
              <Block className="h-4 w-28" />
            </div>
            <Block className="mt-2 h-2.5 w-3/4" />
            <Block className="mt-3 h-10 w-full rounded-xl" />
          </div>

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-[#F1EEF8] p-3 last:border-0 sm:px-4 dark:border-white/[0.06]"
            >
              <Block className="h-14 w-10 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Block className="h-3 w-3/4" />
                <Block className="h-2.5 w-1/2" />
              </div>
              <Block className="h-8 w-16 shrink-0 rounded-lg" />
            </div>
          ))}

          <div className="border-t border-[#EAE7F2] p-3 dark:border-white/10">
            <Block className="h-8 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Route-level fallback for /my-borrows. Mirrors the page header, stats, loan
 * list and borrow shelf so the swap in feels seamless.
 */
export default function BorrowsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-[#F8F7FC] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-8 dark:bg-[#141126]"
    >
      <span className="sr-only">Loading your borrows…</span>

      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-3" aria-hidden="true">
          <Block className="h-4 w-28" />

          <div className="flex items-start gap-3">
            <Block className="size-11 shrink-0 rounded-xl bg-[#E5DDF7] dark:bg-[#8B5CF6]/20" />

            <div className="space-y-2">
              <Block className="h-7 w-48" />
              <Block className="h-3 w-72 max-w-full" />
            </div>
          </div>
        </div>

        <BorrowsBodySkeleton />
      </div>
    </div>
  );
}
