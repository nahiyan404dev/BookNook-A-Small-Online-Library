"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Repeat,
  Sparkles,
  Timer,
} from "lucide-react";
import { toast } from "sonner";

import BookCover from "@/components/BookCover";
import ReadingProgressBar from "@/components/reading/ReadingProgressBar";
import type { Book } from "@/lib/books";
import { isBookBorrowed } from "@/lib/borrows";
import { isBookSaved } from "@/lib/my-books";
import {
  createReadingStore,
  formatReadingDate,
  type ReadingProgress,
} from "@/lib/reading";
import { buildReaderPages, type ReaderPage } from "@/lib/reading-pages";
import { cn } from "@/lib/utils";

const LIBRARY_EVENT = "booknook:library-change";

/** Same-tab notifications; the `storage` event covers other tabs. */
function subscribeToLibrary(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LIBRARY_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LIBRARY_EVENT, callback);
  };
}

const FONT_STYLES = [
  "text-[16.5px] leading-[1.8] sm:text-[17.5px]",
  "text-[18px] leading-[1.85] sm:text-[19px]",
  "text-[20px] leading-[1.85] sm:text-[21px]",
] as const;

function ProgressRing({ percent }: { percent: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="relative size-24 shrink-0">
      <svg
        viewBox="0 0 100 100"
        className="size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-[#ece7dd] dark:stroke-white/10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-[#183d32] transition-[stroke-dashoffset] duration-500 dark:stroke-[#4ADE80]"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold tracking-tight text-[#19152B] tabular-nums dark:text-white">
          {percent}%
        </span>
        <span className="text-[9px] font-semibold tracking-[1.5px] text-[#8B87A0] uppercase dark:text-white/45">
          read
        </span>
      </div>
    </div>
  );
}

function Fact({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-2.5 py-1 text-[11px] font-medium text-[#4B5F56] dark:border-white/10 dark:bg-white/5 dark:text-white/65">
      {icon}
      {children}
    </span>
  );
}

function ReaderPageContent({
  page,
  fontClassName,
}: {
  page: ReaderPage;
  fontClassName: string;
}) {
  return (
    <div>
      {page.eyebrow ? (
        <p className="text-[10px] font-bold tracking-[2px] text-[#2f9e6f] uppercase dark:text-[#4ADE80]">
          {page.eyebrow}
        </p>
      ) : null}

      {page.heading ? (
        <h2 className="mt-1 font-serif text-2xl leading-tight font-bold tracking-tight text-[#19152B] sm:text-3xl dark:text-white">
          {page.heading}
        </h2>
      ) : null}

      <div
        className={cn(
          "mt-5 space-y-5 font-serif text-[#3f3a31] dark:text-white/75",
          fontClassName
        )}
      >
        {page.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {page.bullets?.length ? (
        <ul className="mt-5 space-y-3">
          {page.bullets.map((bullet, index) => (
            <li
              key={index}
              className={cn(
                "flex gap-3 font-serif text-[#3f3a31] dark:text-white/75",
                fontClassName
              )}
            >
              <span
                aria-hidden="true"
                className="mt-3 size-1.5 shrink-0 rounded-full bg-[#183d32] dark:bg-[#4ADE80]"
              />
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}

      {page.facts?.length ? (
        <dl className="mt-6 grid grid-cols-2 gap-2 border-t border-[#f0ece3] pt-5 sm:grid-cols-4 dark:border-white/10">
          {page.facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-lg bg-[#f7f4ec] p-2.5 dark:bg-white/5"
            >
              <dt className="text-[9px] font-semibold tracking-[1px] text-[#8B87A0] uppercase dark:text-white/40">
                {fact.label}
              </dt>
              <dd className="mt-0.5 truncate text-xs font-semibold text-[#19152B] dark:text-white/80">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {page.note ? (
        <p className="mt-6 text-[11px] leading-relaxed text-[#8B87A0] italic dark:text-white/40">
          {page.note}
        </p>
      ) : null}
    </div>
  );
}

function TitlePage({
  book,
  pageCount,
  minutes,
  progress,
  percent,
  isPreview,
  onStart,
}: {
  book: Book;
  pageCount: number;
  minutes: number;
  progress: ReadingProgress | null;
  percent: number;
  isPreview: boolean;
  onStart: () => void;
}) {
  const finished = Boolean(progress?.completedAt);
  const started = percent > 0;
  const actionLabel = finished
    ? "Read again"
    : started
      ? `Continue on page ${progress?.page ?? 2}`
      : "Start reading";

  return (
    <div className="grid gap-8 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)] sm:items-center">
      <div className="mx-auto w-40 shrink-0 sm:mx-0 sm:w-full">
        <div className="overflow-hidden rounded-xl border border-[#e9e4dc] bg-white shadow-lg shadow-[#183d32]/10 dark:border-white/10 dark:bg-[#1F1A33]">
          <BookCover
            src={book.imageUrl}
            alt={`Cover of ${book.name}`}
            priority
            className="aspect-3/4"
          />
        </div>
      </div>

      <div className="min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d7e3da] bg-[#eef5f0] px-3 py-1 text-[10px] font-bold tracking-[1.5px] text-[#183d32] uppercase dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
          <Sparkles size={12} aria-hidden="true" />
          {isPreview ? "Sample preview" : "Reading edition"}
        </span>

        <h1 className="mt-4 font-serif text-3xl leading-tight font-bold tracking-tight text-[#19152B] sm:text-4xl dark:text-white">
          {book.name}
        </h1>

        <p className="mt-2 text-sm text-[#6B7280] dark:text-white/55">
          by{" "}
          <span className="font-semibold text-[#19152B] dark:text-white/85">
            {book.author || "Unknown author"}
          </span>
        </p>

        {book.description ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#4B5563] dark:text-white/65">
            {book.description}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <Fact icon={<BookOpen size={12} aria-hidden="true" />}>
            {pageCount} pages
          </Fact>
          <Fact icon={<Timer size={12} aria-hidden="true" />}>
            ~{minutes} min
          </Fact>
          {book.category ? (
            <Fact icon={<Bookmark size={12} aria-hidden="true" />}>
              {book.category}
            </Fact>
          ) : null}
          {started ? (
            <Fact icon={<Sparkles size={12} aria-hidden="true" />}>
              {percent}% read
            </Fact>
          ) : null}
        </div>

        {started && !finished ? (
          <p className="mt-4 text-xs font-medium text-[#183d32] dark:text-[#9BE7B8]">
            You left off on page {progress?.page}. Your place is saved in this
            browser.
          </p>
        ) : null}

        <button
          type="button"
          onClick={onStart}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#183d32] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0f2b23] focus-visible:ring-2 focus-visible:ring-[#183d32] focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-[#276F4C] dark:hover:bg-[#22594a]"
        >
          {finished ? (
            <Repeat size={16} aria-hidden="true" />
          ) : (
            <ArrowRight size={16} aria-hidden="true" />
          )}
          {actionLabel}
        </button>

        <p className="mt-3 text-[11px] leading-relaxed text-[#8B87A0] dark:text-white/40">
          {isPreview
            ? "Sample pages for the BookNook demo · progress saves automatically."
            : "Progress saves automatically in this browser."}
        </p>
      </div>
    </div>
  );
}

function CompletionPanel({
  finished,
  bookName,
  onFinish,
  onReadAgain,
}: {
  finished: boolean;
  bookName: string;
  onFinish: () => void;
  onReadAgain: () => void;
}) {
  if (finished) {
    return (
      <div className="mt-7 flex flex-col items-start gap-3 rounded-xl border border-[#BEE8D2] bg-[#EFF9F3] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-400/20 dark:bg-emerald-400/10">
        <div className="flex items-start gap-3">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-[#1F7A4D] dark:text-emerald-300"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-bold text-[#14532D] dark:text-emerald-100">
              Finished
            </p>
            <p className="text-xs text-[#2f6b4f] dark:text-emerald-200/70">
              You finished “{bookName}”.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReadAgain}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#BEE8D2] bg-white px-3.5 text-xs font-semibold text-[#183d32] transition-colors hover:border-[#183d32]/40 hover:bg-[#f7fbf8] dark:border-emerald-400/20 dark:bg-white/5 dark:text-emerald-200 dark:hover:bg-white/10"
        >
          <Repeat size={14} aria-hidden="true" />
          Read again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-7 flex flex-col items-start gap-3 rounded-xl border border-[#e9e4dc] bg-[#f7f4ec] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5">
      <div>
        <p className="text-sm font-bold text-[#19152B] dark:text-white">
          That&apos;s the last page
        </p>
        <p className="text-xs text-[#6B7280] dark:text-white/50">
          Mark the book as finished to complete your progress.
        </p>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#183d32] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#0f2b23] dark:bg-[#276F4C] dark:hover:bg-[#22594a]"
      >
        <CheckCircle2 size={14} aria-hidden="true" />
        Mark as finished
      </button>
    </div>
  );
}

export default function Reader({ book }: { book: Book }) {
  const pages = buildReaderPages(book);
  const total = pages.length;
  const isPreview = !book.content?.trim();
  const minutes = Math.max(1, Math.round(total * 1.5));

  const [readingStore] = useState(() => createReadingStore());
  const records = useSyncExternalStore(
    readingStore.subscribe,
    readingStore.getSnapshot,
    readingStore.getServerSnapshot
  );

  const saved = useSyncExternalStore(
    subscribeToLibrary,
    () => isBookSaved(book._id),
    () => false
  );

  const borrowed = useSyncExternalStore(
    subscribeToLibrary,
    () => isBookBorrowed(book._id),
    () => false
  );

  const [pageIndex, setPageIndex] = useState<number | null>(null);
  const [fontStep, setFontStep] = useState(1);

  const ready = records !== null;
  const progress =
    records?.find((record) => record.bookId === book._id) ?? null;

  const resumePage = progress ? progress.page - 1 : 0;
  const current = Math.min(Math.max(pageIndex ?? resumePage, 0), total - 1);
  const page = pages[current];
  const percent =
    total <= 1 ? 100 : Math.round((current / (total - 1)) * 100);
  const finished = Boolean(progress?.completedAt);
  const atStart = current === 0;
  const atEnd = current === total - 1;

  const turnTo = (index: number) => {
    const next = Math.min(Math.max(index, 0), total - 1);

    setPageIndex(next);
    readingStore.savePage(book._id, next + 1, total);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startReading = () => {
    if (finished) {
      readingStore.resetBook(book._id);
      turnTo(1);
      return;
    }

    turnTo(progress && progress.page > 1 ? progress.page - 1 : 1);
  };

  const finishBook = () => {
    readingStore.finishBook(book._id, total);
    setPageIndex(total - 1);

    toast.success("Book finished", {
      description: `You completed “${book.name}”.`,
    });
  };

  const readAgain = () => {
    readingStore.resetBook(book._id);
    setPageIndex(0);

    toast.info("Ready to read again", {
      description: "Starting over from the title page.",
    });
  };

  // Arrow keys turn pages while reading. The effect intentionally has no
  // dependency array so it always sees the current page and handlers.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        turnTo(current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        turnTo(current - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-8 dark:bg-[#141126]">
      <div className="mx-auto w-full max-w-6xl">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/allbooks/${book._id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#183d32] dark:text-white/60 dark:hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Book details
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-3 py-1 text-[10px] font-bold tracking-[1.5px] text-[#183d32] uppercase sm:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-[#9BE7B8]">
              <Sparkles size={12} aria-hidden="true" />
              {isPreview ? "Reading preview" : "Reading"}
            </span>

            <div
              role="group"
              aria-label="Text size"
              className="flex items-center gap-0.5 rounded-full border border-[#e9e4dc] bg-white p-0.5 dark:border-white/10 dark:bg-white/5"
            >
              <button
                type="button"
                onClick={() => setFontStep((step) => Math.max(0, step - 1))}
                disabled={fontStep === 0}
                aria-label="Decrease text size"
                className="flex size-7 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#f2f0ea] hover:text-[#183d32] disabled:cursor-not-allowed disabled:opacity-40 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Minus size={13} aria-hidden="true" />
              </button>

              <span
                aria-hidden="true"
                className="px-1 text-[10px] font-bold text-[#8B87A0] dark:text-white/45"
              >
                Aa
              </span>

              <button
                type="button"
                onClick={() => setFontStep((step) => Math.min(2, step + 1))}
                disabled={fontStep === 2}
                aria-label="Increase text size"
                className="flex size-7 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#f2f0ea] hover:text-[#183d32] disabled:cursor-not-allowed disabled:opacity-40 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Plus size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Book + overall progress */}
        <div className="mt-4">
          <p className="truncate font-serif text-xl font-bold tracking-tight text-[#19152B] sm:text-2xl dark:text-white">
            {book.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-[#6B7280] dark:text-white/50">
            {book.author || "Unknown author"}
            {book.category ? <span> · {book.category}</span> : null}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <ReadingProgressBar
              value={percent}
              tone="green"
              label={`Reading progress for ${book.name}`}
              className="max-w-xs"
            />
            <span className="shrink-0 text-[11px] font-semibold text-[#6B7280] tabular-nums dark:text-white/50">
              {percent}% · Page {current + 1} of {total}
            </span>
          </div>
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
          {/* Reading surface */}
          <div>
            <section
              aria-label={`Page ${current + 1} of ${total}`}
              className="rounded-2xl border border-[#e9e4dc] bg-white p-5 shadow-sm shadow-[#183d32]/5 sm:p-8 lg:p-10 dark:border-white/10 dark:bg-[#1F1A33]"
            >
              {!ready ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="space-y-5"
                  aria-label="Loading your reading place"
                >
                  <span className="sr-only">Loading your reading place…</span>
                  <div className="book-skeleton h-3 w-24 rounded" />
                  <div className="book-skeleton h-8 w-3/4 rounded" />
                  <div className="space-y-3 pt-2">
                    <div className="book-skeleton h-3.5 w-full rounded" />
                    <div className="book-skeleton h-3.5 w-11/12 rounded" />
                    <div className="book-skeleton h-3.5 w-full rounded" />
                    <div className="book-skeleton h-3.5 w-4/5 rounded" />
                  </div>
                </div>
              ) : (
                <div key={current} className="reader-page">
                  {page.kind === "title" ? (
                    <TitlePage
                      book={book}
                      pageCount={total}
                      minutes={minutes}
                      progress={progress}
                      percent={percent}
                      isPreview={isPreview}
                      onStart={startReading}
                    />
                  ) : (
                    <ReaderPageContent
                      page={page}
                      fontClassName={FONT_STYLES[fontStep]}
                    />
                  )}
                </div>
              )}

              {ready && atEnd ? (
                <CompletionPanel
                  finished={finished}
                  bookName={book.name}
                  onFinish={finishBook}
                  onReadAgain={readAgain}
                />
              ) : null}

              <nav
                aria-label="Page navigation"
                className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ece3] pt-5 dark:border-white/10"
              >
                <button
                  type="button"
                  onClick={() => turnTo(current - 1)}
                  disabled={!ready || atStart}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-4 text-xs font-semibold text-[#4B5563] transition-colors hover:border-[#183d32]/40 hover:text-[#183d32] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white/65 dark:hover:border-white/25 dark:hover:text-white"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                  Previous
                </button>

                <p className="order-3 w-full text-center text-[11px] text-[#8B87A0] sm:order-none sm:w-auto dark:text-white/40">
                  Page <span className="font-semibold">{current + 1}</span> of{" "}
                  {total}
                </p>

                <button
                  type="button"
                  onClick={() => turnTo(current + 1)}
                  disabled={!ready || atEnd}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#183d32] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#0f2b23] disabled:cursor-not-allowed disabled:bg-[#e9e4dc] disabled:text-[#8B87A0] dark:bg-[#276F4C] dark:hover:bg-[#22594a] dark:disabled:bg-white/10 dark:disabled:text-white/35"
                >
                  Next
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </nav>
            </section>

            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11px] text-[#8B87A0] dark:text-white/40">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-[#e9e4dc] bg-white px-1.5 py-0.5 font-sans text-[10px] font-semibold text-[#4B5563] dark:border-white/10 dark:bg-white/5 dark:text-white/65">
                  ←
                </kbd>
                <kbd className="rounded border border-[#e9e4dc] bg-white px-1.5 py-0.5 font-sans text-[10px] font-semibold text-[#4B5563] dark:border-white/10 dark:bg-white/5 dark:text-white/65">
                  →
                </kbd>
                turn pages
              </span>
              <span aria-hidden="true">·</span>
              <span>progress saved in this browser</span>
            </p>

            <p aria-live="polite" className="sr-only">
              Page {current + 1} of {total}
              {page.heading ? `: ${page.heading}` : ""}
            </p>
          </div>

          {/* Progress rail */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className="rounded-2xl border border-[#e9e4dc] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
              <div className="flex items-center gap-4">
                <ProgressRing percent={percent} />

                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[1.5px] text-[#8B87A0] uppercase dark:text-white/45">
                    Your progress
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#19152B] dark:text-white">
                    {finished
                      ? "Finished"
                      : percent > 0
                        ? "In progress"
                        : "Ready to start"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6B7280] dark:text-white/50">
                    Page {current + 1} of {total}
                  </p>
                </div>
              </div>

              <ReadingProgressBar
                value={percent}
                tone="green"
                label={`Page ${current + 1} of ${total}`}
                className="mt-4"
              />

              <dl className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-[#f7f4ec] p-2 text-center dark:bg-white/5">
                  <dt className="text-[9px] font-semibold tracking-[1px] text-[#8B87A0] uppercase dark:text-white/40">
                    Pages left
                  </dt>
                  <dd className="mt-0.5 text-base font-bold text-[#19152B] tabular-nums dark:text-white">
                    {Math.max(total - current - 1, 0)}
                  </dd>
                </div>

                <div className="rounded-lg bg-[#f7f4ec] p-2 text-center dark:bg-white/5">
                  <dt className="text-[9px] font-semibold tracking-[1px] text-[#8B87A0] uppercase dark:text-white/40">
                    {isPreview ? "Preview" : "Total"}
                  </dt>
                  <dd className="mt-0.5 text-base font-bold text-[#19152B] tabular-nums dark:text-white">
                    {minutes} min
                  </dd>
                </div>
              </dl>

              {!ready ? (
                <p className="mt-3 text-[10.5px] text-[#8B87A0] dark:text-white/40">
                  Loading your saved place…
                </p>
              ) : progress ? (
                <p className="mt-3 text-[10.5px] text-[#8B87A0] dark:text-white/40">
                  Started {formatReadingDate(progress.startedAt)}
                  {progress.completedAt
                    ? ` · finished ${formatReadingDate(progress.completedAt)}`
                    : ""}
                </p>
              ) : (
                <p className="mt-3 text-[10.5px] text-[#8B87A0] dark:text-white/40">
                  Turn the first page to start tracking.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-[#e9e4dc] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
              <h2 className="text-[10px] font-bold tracking-[1.5px] text-[#8B87A0] uppercase dark:text-white/45">
                Pages
              </h2>

              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {pages.map((_, index) => {
                  const active = index === current;
                  const visited = index < current;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => turnTo(index)}
                      disabled={!ready}
                      aria-label={`Go to page ${index + 1}`}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-9 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                        active
                          ? "border-transparent bg-[#183d32] text-white dark:bg-[#276F4C]"
                          : visited
                            ? "border-[#d7e3da] bg-[#eef5f0] text-[#183d32] dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                            : "border-[#e9e4dc] bg-white text-[#6B7280] hover:border-[#183d32]/40 hover:text-[#183d32] dark:border-white/10 dark:bg-white/5 dark:text-white/55 dark:hover:border-white/25 dark:hover:text-white"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-[10.5px] leading-relaxed text-[#8B87A0] dark:text-white/40">
                Use the arrow keys on your keyboard to turn pages.
              </p>
            </section>

            <section className="rounded-2xl border border-[#e9e4dc] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
              <h2 className="text-[10px] font-bold tracking-[1.5px] text-[#8B87A0] uppercase dark:text-white/45">
                Your shelves
              </h2>

              <div className="mt-3 space-y-1">
                <Link
                  href="/my-books"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-semibold text-[#4B5563] transition-colors hover:bg-[#f7f4ec] hover:text-[#183d32] dark:text-white/65 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <Bookmark size={15} aria-hidden="true" />
                  <span className="flex-1">My Books</span>
                  <span
                    className={cn(
                      "text-[9px] font-bold tracking-[1px] uppercase",
                      saved
                        ? "text-[#1F7A4D] dark:text-emerald-300"
                        : "text-[#8B87A0] dark:text-white/35"
                    )}
                  >
                    {saved ? "Saved" : "Open"}
                  </span>
                </Link>

                <Link
                  href="/my-borrows"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-semibold text-[#4B5563] transition-colors hover:bg-[#f7f4ec] hover:text-[#183d32] dark:text-white/65 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <Repeat size={15} aria-hidden="true" />
                  <span className="flex-1">My Borrows</span>
                  <span
                    className={cn(
                      "text-[9px] font-bold tracking-[1px] uppercase",
                      borrowed
                        ? "text-[#1F7A4D] dark:text-emerald-300"
                        : "text-[#8B87A0] dark:text-white/35"
                    )}
                  >
                    {borrowed ? "On loan" : "Open"}
                  </span>
                </Link>

                <Link
                  href="/allbooks"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-semibold text-[#4B5563] transition-colors hover:bg-[#f7f4ec] hover:text-[#183d32] dark:text-white/65 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <BookOpen size={15} aria-hidden="true" />
                  <span className="flex-1">All books</span>
                  <ChevronRight
                    size={14}
                    className="text-[#8B87A0] dark:text-white/35"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
