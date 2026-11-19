export default function BookDetailsLoading() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 transition-colors sm:px-6 sm:py-10 lg:px-8 dark:bg-[#141126]">
      <div className="mx-auto w-full max-w-6xl animate-pulse">
        {/* Breadcrumb */}
        <div className="h-3 w-48 rounded bg-[#ece7dd] dark:bg-white/5" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* Cover */}
          <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="aspect-3/4 rounded-2xl bg-[#ece7dd] dark:bg-white/5" />
            <div className="mt-4 flex justify-center gap-2">
              <div className="h-6 w-32 rounded-full bg-[#ece7dd] dark:bg-white/5" />
              <div className="h-6 w-24 rounded-full bg-[#ece7dd] dark:bg-white/5" />
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex gap-2">
              <div className="h-6 w-28 rounded-full bg-[#ece7dd] dark:bg-white/5" />
              <div className="h-6 w-24 rounded-full bg-[#ece7dd] dark:bg-white/5" />
            </div>

            <div className="mt-5 h-10 w-4/5 rounded bg-[#ece7dd] dark:bg-white/5" />
            <div className="mt-3 h-4 w-40 rounded bg-[#ece7dd] dark:bg-white/5" />
            <div className="mt-4 h-4 w-32 rounded bg-[#ece7dd] dark:bg-white/5" />

            <div className="mt-6 h-24 rounded-2xl bg-[#ece7dd] dark:bg-white/5" />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="h-12 flex-1 rounded-xl bg-[#ece7dd] sm:w-40 sm:flex-none dark:bg-white/5" />
              <div className="h-12 flex-1 rounded-xl bg-[#ece7dd] sm:w-40 sm:flex-none dark:bg-white/5" />
              <div className="h-12 w-full rounded-xl bg-[#ece7dd] sm:w-12 dark:bg-white/5" />
            </div>

            <div className="mt-8 h-5 w-40 rounded bg-[#ece7dd] dark:bg-white/5" />
            <div className="mt-3 space-y-2">
              <div className="h-3.5 w-full rounded bg-[#ece7dd] dark:bg-white/5" />
              <div className="h-3.5 w-11/12 rounded bg-[#ece7dd] dark:bg-white/5" />
              <div className="h-3.5 w-3/4 rounded bg-[#ece7dd] dark:bg-white/5" />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 rounded-xl bg-[#ece7dd] dark:bg-white/5"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
