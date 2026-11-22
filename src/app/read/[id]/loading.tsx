export default function ReadingLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-[#faf9f6] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-8 dark:bg-[#141126]"
    >
      <span className="sr-only">Loading the reading page…</span>

      <div className="mx-auto w-full max-w-6xl animate-pulse">
        <div className="flex items-center justify-between gap-3">
          <div className="h-4 w-28 rounded bg-[#ece7dd] dark:bg-white/5" />
          <div className="h-8 w-32 rounded-full bg-[#ece7dd] dark:bg-white/5" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-7 w-64 max-w-full rounded bg-[#ece7dd] dark:bg-white/5" />
          <div className="h-3 w-40 rounded bg-[#ece7dd] dark:bg-white/5" />
          <div className="mt-3 h-1.5 w-72 max-w-full rounded-full bg-[#ece7dd] dark:bg-white/5" />
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="rounded-2xl border border-[#e9e4dc] bg-white p-5 shadow-sm sm:p-8 lg:p-10 dark:border-white/10 dark:bg-[#1F1A33]">
            <div className="space-y-5">
              <div className="h-3 w-24 rounded bg-[#ece7dd] dark:bg-white/5" />
              <div className="h-8 w-3/4 rounded bg-[#ece7dd] dark:bg-white/5" />
              <div className="space-y-3 pt-2">
                {["w-full", "w-11/12", "w-full", "w-4/5", "w-10/12"].map(
                  (width, index) => (
                    <div
                      key={index}
                      className={`h-3.5 rounded bg-[#ece7dd] ${width} dark:bg-white/5`}
                    />
                  )
                )}
              </div>
              <div className="flex items-center justify-between gap-3 pt-8">
                <div className="h-10 w-24 rounded-full bg-[#ece7dd] dark:bg-white/5" />
                <div className="h-10 w-20 rounded-full bg-[#ece7dd] dark:bg-white/5" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e9e4dc] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
              <div className="flex items-center gap-4">
                <div className="size-24 shrink-0 rounded-full bg-[#ece7dd] dark:bg-white/5" />
                <div className="space-y-2">
                  <div className="h-2.5 w-24 rounded bg-[#ece7dd] dark:bg-white/5" />
                  <div className="h-3.5 w-28 rounded bg-[#ece7dd] dark:bg-white/5" />
                  <div className="h-3 w-20 rounded bg-[#ece7dd] dark:bg-white/5" />
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full rounded-full bg-[#ece7dd] dark:bg-white/5" />
            </div>

            <div className="rounded-2xl border border-[#e9e4dc] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
              <div className="h-2.5 w-16 rounded bg-[#ece7dd] dark:bg-white/5" />
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-9 rounded-lg bg-[#ece7dd] dark:bg-white/5"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
