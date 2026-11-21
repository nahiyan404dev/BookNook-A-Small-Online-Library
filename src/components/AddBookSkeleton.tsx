import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("book-skeleton rounded-md", className)} />;
}

function Field({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Block className="h-3 w-20" />
      <Block className="h-11 rounded-xl" />
    </div>
  );
}

function PreviewLine({ className }: { className?: string }) {
  return <Block className={cn("h-3.5", className)} />;
}

/**
 * Route-level fallback for /Add_new_book. Mirrors the real page's header,
 * form card and live-preview card so the swap in feels seamless.
 */
export default function AddBookSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-[#F8F7FC] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-10 dark:bg-[#141126]"
    >
      <span className="sr-only">Loading the Add Book form…</span>

      <div className="mx-auto w-full max-w-5xl space-y-6" aria-hidden>
        {/* page header */}
        <div className="space-y-3">
          <Block className="h-4 w-28" />

          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center gap-[3px] rounded-xl bg-[#F1EAFF] dark:bg-[#8B5CF6]/15">
              {[0, 1, 2].map((bar) => (
                <span
                  key={bar}
                  className="skeleton-book-bar block w-[4px] rounded-full bg-gradient-to-t from-[#5426B8] to-[#A78BFA] dark:from-[#C4B5FD] dark:to-[#8B5CF6]"
                  style={{
                    height: `${13 + bar * 4}px`,
                    animationDelay: `${bar * 0.13}s`,
                  }}
                />
              ))}
            </span>

            <div className="space-y-2">
              <Block className="h-6 w-44" />
              <Block className="h-3 w-60" />
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* form card */}
          <div className="overflow-hidden rounded-2xl border border-[#EAE7F2] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
            <div className="flex items-start justify-between gap-3 border-b border-[#EAE7F2] px-4 py-4 sm:px-6 sm:py-5 dark:border-white/10">
              <div className="space-y-2">
                <Block className="h-4 w-32" />
                <Block className="h-3 w-52 sm:w-64" />
              </div>

              <span className="hidden shrink-0 items-center gap-2 rounded-full border border-[#EAE7F2] bg-[#FBFAFE] px-3 py-1 text-[9.5px] font-semibold tracking-[0.16em] text-[#6B7280] uppercase sm:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-white/50">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8B5CF6] opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[#5426B8] dark:bg-[#C4B5FD]" />
                </span>
                Preparing your shelf
              </span>
            </div>

            <div className="space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
              <Field />

              <div className="grid grid-cols-2 gap-5">
                <Field />
                <Field />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field />
                <Field />
              </div>

              <div className="space-y-2">
                <Block className="h-3 w-20" />
                <Block className="h-11 rounded-xl" />
                <Block className="h-2.5 w-56" />
              </div>

              <div className="space-y-2">
                <Block className="h-3 w-24" />
                <Block className="h-32 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Block className="h-3 w-24" />
                <Block className="h-11 rounded-xl" />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Block className="h-11 w-full rounded-xl sm:w-24" />
                <Block className="h-11 w-full rounded-xl bg-[#E5DDF7] sm:w-32 dark:bg-[#8B5CF6]/20" />
              </div>
            </div>
          </div>

          {/* live preview card */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-[#1F1A33]">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Block className="size-4 rounded" />
                  <Block className="h-3.5 w-24" />
                </div>
                <Block className="h-5 w-16 rounded-full" />
              </div>

              <div className="mb-4 flex h-44 items-center justify-center overflow-hidden rounded-xl border border-[#EAE7F2] bg-[#F5F4FA] dark:border-white/10 dark:bg-white/5">
                <span className="book-skeleton flex size-12 rounded-xl" />
              </div>

              <Block className="h-5 w-3/4" />
              <PreviewLine className="mt-2 w-1/2" />
              <PreviewLine className="mt-3 w-full" />
              <PreviewLine className="mt-1.5 w-5/6" />

              <Block className="mt-3 h-6 w-20 rounded-full" />

              <div className="mt-3 flex items-center justify-between gap-2">
                <Block className="h-5 w-24" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Block key={star} className="size-3.5 rounded-full" />
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#EAE7F2] pt-3 dark:border-white/10">
                <Block className="h-2.5 w-full" />
                <Block className="h-2.5 w-2/3" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
