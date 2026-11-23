"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  Library,
  Plus,
  Repeat,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import BookCover from "@/components/BookCover";
import { ReadingHubBodySkeleton } from "@/components/reading/ReadingHubSkeleton";
import ReadingProgressBar from "@/components/reading/ReadingProgressBar";
import { matchesSearch, normalizeCategory, type Book } from "@/lib/books";
import {
  createBorrowStore,
  dueLabel,
  formatDay,
  loanStatus,
  type Loan,
  type LoanStatus,
} from "@/lib/borrows";
import { createMyBooksStore, type OwnedBook } from "@/lib/my-books";
import {
  createReadingStore,
  formatReadingDate,
  readingActionLabel,
  readingPercent,
  readingStatusLabel,
  type ReadingProgress,
} from "@/lib/reading";
import { cn } from "@/lib/utils";

type ReadingHubProps = {
  books: Book[];
  error: string | null;
};

const STAT_TONES = {
  green:
    "bg-[#eef5f0] text-[#183d32] dark:bg-emerald-400/10 dark:text-emerald-300",
  amber:
    "bg-[#fef4e2] text-[#9a5b00] dark:bg-amber-400/10 dark:text-amber-300",
  rose: "bg-[#FCEFF0] text-[#A03A4A] dark:bg-rose-400/10 dark:text-rose-300",
} as const;

const LOAN_BADGES: Record<LoanStatus, string> = {
  overdue:
    "border-[#f3d6d6] bg-[#fdf1f1] text-[#b42318] dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
  "due-soon":
    "border-[#f5d9a8] bg-[#fef4e2] text-[#9a5b00] dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  "on-time":
    "border-[#bee8d2] bg-[#e7f6ee] text-[#1f7a4d] dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
};

const LOAN_LABELS: Record<LoanStatus, string> = {
  overdue: "Overdue",
  "due-soon": "Due soon",
  "on-time": "On time",
};

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint: string;
  tone: keyof typeof STAT_TONES;
}) {
  return (
    <div className="rounded-2xl border border-[#e9e4dc] bg-white p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-[#1F1A33]">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            STAT_TONES[tone]
          )}
        >
          {icon}
        </span>

        <span className="text-2xl font-extrabold tracking-tight text-[#19152B] tabular-nums dark:text-white">
          {value}
        </span>
      </div>

      <p className="mt-3 text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase dark:text-white/50">
        {label}
      </p>
      <p className="mt-0.5 text-[11px] text-[#8B87A0] dark:text-white/40">
        {hint}
      </p>
    </div>
  );
}

function SectionHeading({
  id,
  icon,
  title,
  description,
  action,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f4f1ea] text-[#8B5CF6] dark:bg-white/5 dark:text-[#8B5CF6]">
          {icon}
        </span>

        <div>
          <h2
            id={id}
            className="text-base font-bold tracking-tight text-[#19152B] sm:text-lg dark:text-white"
          >
            {title}
          </h2>
          <p className="mt-0.5 max-w-xl text-xs text-[#6B7280] dark:text-white/50">
            {description}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}

function ContinueCard({
  book,
  progress,
}: {
  book: Book;
  progress: ReadingProgress;
}) {
  const percent = readingPercent(progress);

  return (
    <article className="flex gap-4 rounded-2xl border border-[#e9e4dc] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8B5CF6] hover:shadow-md dark:border-white/10 dark:bg-[#1F1A33] dark:hover:border-[#8B5CF6]">
      <Link
        href={`/allbooks/${book._id}`}
        aria-label={`View details for ${book.name}`}
        className="shrink-0"
      >
        <BookCover
          src={book.imageUrl}
          alt={`Cover of ${book.name}`}
          className="h-[108px] w-[76px] rounded-lg"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        {book.category ? (
          <span className="w-fit rounded-full bg-[#f4f1ea] px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-[#8B5CF6] uppercase dark:bg-white/5 dark:text-[#8B5CF6]">
            {normalizeCategory(book.category)}
          </span>
        ) : null}

        <h3 className="mt-1 line-clamp-2 text-sm leading-snug font-bold tracking-tight text-[#19152B] sm:text-[15px] dark:text-white">
          <Link
            href={`/allbooks/${book._id}`}
            className="transition-colors hover:text-[#8B5CF6] dark:hover:text-[#8B5CF6]"
          >
            {book.name}
          </Link>
        </h3>

        <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-[#6B7280] dark:text-white/55">
          {book.author || "Unknown author"}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between gap-2 text-[10.5px] font-semibold">
            <span className="inline-flex items-center gap-1 text-[#8B5CF6] dark:text-[#8B5CF6]">
              <BookOpen size={12} aria-hidden="true" />
              {readingStatusLabel(progress)}
            </span>

            <span className="shrink-0 text-[#8B87A0] tabular-nums dark:text-white/40">
              p. {progress.page}/{progress.totalPages}
            </span>
          </div>

          <ReadingProgressBar
            value={percent}
            tone="green"
            label={`Reading progress for ${book.name}`}
            className="mt-1.5"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-[#8B87A0] dark:text-white/40">
              <Clock size={11} aria-hidden="true" />
              Last read {formatReadingDate(progress.updatedAt)}
            </span>

            <Link
              href={`/read/${book._id}`}
              aria-label={`${readingActionLabel(progress)} ${book.name}`}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#8B5CF6] px-3 text-[11px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#8B5CF6] focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:outline-none dark:bg-[#8B5CF6] dark:hover:bg-[#8B5CF6]"
            >
              {readingActionLabel(progress)}
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function FinishedChip({
  book,
  progress,
}: {
  book: Book;
  progress: ReadingProgress;
}) {
  return (
    <Link
      href={`/read/${book._id}`}
      aria-label={`Read ${book.name} again`}
      className="group flex items-center gap-2.5 rounded-full border border-[#bee8d2] bg-[#eff9f3] p-1.5 pr-3 transition-colors hover:border-[#8B5CF6] hover:bg-[#e7f6ee] dark:border-[#5d24e2] dark:bg-[#8B5CF6] dark:hover:bg-[#8B5CF6]"
    >
      <BookCover
        src={book.imageUrl}
        alt=""
        className="h-9 w-7 shrink-0 rounded"
      />

      <span className="min-w-0">
        <span className="block max-w-[150px] truncate text-[11px] font-bold text-[#8B5CF6] dark:text-emerald-100">
          {book.name}
        </span>
        <span className="block text-[9.5px] font-medium text-[#8B5CF6] dark:text-emerald-200/70">
          Finished {formatReadingDate(progress.completedAt)}
        </span>
      </span>

      <span className="ml-1 inline-flex shrink-0 items-center gap-1 text-[9px] font-bold tracking-wide text-[#8B5CF6] uppercase dark:text-[#5d24e2]">
        Read again
        <Repeat
          size={11}
          className="transition-transform group-hover:-rotate-12"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

function LoanRow({
  loan,
  book,
  progress,
}: {
  loan: Loan;
  book: Pick<Book, "_id" | "name" | "author" | "category" | "imageUrl">;
  progress: ReadingProgress | null;
}) {
  const status = loanStatus(loan);
  const percent = readingPercent(progress);

  return (
    <li className="flex gap-3 p-4">
      <Link
        href={`/allbooks/${book._id}`}
        aria-label={`View ${book.name}`}
        className="shrink-0"
      >
        <BookCover
          src={book.imageUrl}
          alt={`Cover of ${book.name}`}
          className="h-[84px] w-[60px] rounded-md"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-x-2 gap-y-1">
          <div className="min-w-0">
            <h3 className="truncate text-xs font-bold text-[#19152B] sm:text-sm dark:text-white">
              <Link
                href={`/allbooks/${book._id}`}
                className="transition-colors hover:text-[#8B5CF6] dark:hover:text-[#9BE7B8]"
              >
                {book.name}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-[#6B7280] dark:text-white/50">
              {book.author || "Unknown author"}
            </p>
          </div>

          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase",
              LOAN_BADGES[status]
            )}
          >
            <span className="size-1 rounded-full bg-current" />
            {LOAN_LABELS[status]}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <ReadingProgressBar
            value={percent}
            tone="green"
            label={`Reading progress for ${book.name}`}
            className="max-w-[150px] flex-1"
          />
          <span className="shrink-0 text-[10px] font-semibold text-[#6B7280] dark:text-white/50">
            {readingStatusLabel(progress)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6B7280] dark:text-white/45">
            <CalendarClock size={11} aria-hidden="true" />
            {dueLabel(loan)} · {formatDay(loan.dueAt)}
          </span>

          <Link
            href={`/read/${book._id}`}
            aria-label={`${readingActionLabel(progress)} ${book.name}`}
            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#8B5CF6] transition-colors hover:text-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:text-white"
          >
            {readingActionLabel(progress)}
            <ChevronRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </li>
  );
}

function ShelfRow({
  book,
  progress,
}: {
  book: Book;
  progress: ReadingProgress | null;
}) {
  const percent = readingPercent(progress);

  return (
    <li className="flex items-center gap-3 p-4">
      <Link
        href={`/allbooks/${book._id}`}
        aria-label={`View ${book.name}`}
        className="shrink-0"
      >
        <BookCover
          src={book.imageUrl}
          alt={`Cover of ${book.name}`}
          className="h-[72px] w-[52px] rounded-md"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xs font-bold text-[#19152B] sm:text-sm dark:text-white">
          <Link
            href={`/allbooks/${book._id}`}
            className="transition-colors hover:text-[#8B5CF6] dark:hover:text-[#8B5CF6]"
          >
            {book.name}
          </Link>
        </h3>
        <p className="mt-0.5 truncate text-[11px] text-[#6B7280] dark:text-white/50">
          {book.author || "Unknown author"}
        </p>

        <div className="mt-1.5 flex items-center gap-2">
          <ReadingProgressBar
            value={percent}
            tone="green"
            label={`Reading progress for ${book.name}`}
            className="max-w-[120px] flex-1"
          />
          <span className="shrink-0 text-[10px] font-semibold text-[#6B7280] dark:text-white/50">
            {readingStatusLabel(progress)}
          </span>
        </div>
      </div>

      <Link
        href={`/read/${book._id}`}
        aria-label={`${readingActionLabel(progress)} ${book.name}`}
        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-[#e9e4dc] bg-white px-2.5 text-[10px] font-bold tracking-wide text-[#8B5CF6] uppercase transition-colors hover:border-[#8B5CF6] hover:bg-[#f7f4ec] dark:border-white/10 dark:bg-white/5 dark:text-[#8B5CF6] dark:hover:border-[#8B5CF6] dark:hover:bg-white/10"
      >
        {readingActionLabel(progress)}
      </Link>
    </li>
  );
}

function CatalogueCard({
  book,
  progress,
}: {
  book: Book;
  progress: ReadingProgress | null;
}) {
  const percent = readingPercent(progress);

  return (
    <article className="group flex flex-col overflow-hidden border border-[#e9e4dc] bg-white p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#8B5CF6] hover:shadow-lg hover:shadow-[#8B5CF6] dark:border-white/10 dark:bg-[#1F1A33] dark:hover:border-[#8B5CF6]">
      <Link
        href={`/allbooks/${book._id}`}
        aria-label={`View details for ${book.name}`}
      >
        <BookCover
          src={book.imageUrl}
          alt={`Cover of ${book.name}`}
          className="aspect-3/4 rounded-md"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-2.5">
        <h3 className="line-clamp-2 text-xs leading-snug font-bold tracking-tight text-[#19152B] sm:text-[13px] dark:text-white">
          <Link
            href={`/allbooks/${book._id}`}
            className="transition-colors hover:text-[#8B5CF6] dark:hover:text-[#8B5CF6]"
          >
            {book.name}
          </Link>
        </h3>

        <p className="mt-0.5 line-clamp-1 text-[10.5px] font-medium text-[#6B7280] dark:text-white/50">
          {book.author || "Unknown author"}
        </p>

        <div className="mt-auto pt-2.5">
          <div className="flex items-center justify-between gap-1 text-[9.5px] font-semibold">
            <span
              className={cn(
                "inline-flex min-w-0 items-center gap-1 truncate",
                progress?.completedAt
                  ? "text-[#8B5CF6] dark:text-[#8B5CF6]"
                  : percent > 0
                    ? "text-[#8B5CF6] dark:text-[#8B5CF6]"
                    : "text-[#8B87A0] dark:text-white/40"
              )}
            >
              {progress?.completedAt ? (
                <CheckCircle2 size={10} aria-hidden="true" />
              ) : (
                <BookOpen size={10} aria-hidden="true" />
              )}
              {readingStatusLabel(progress)}
            </span>

            {progress ? (
              <span className="shrink-0 text-[#8B87A0] tabular-nums dark:text-white/40">
                p. {progress.page}/{progress.totalPages}
              </span>
            ) : null}
          </div>

          <ReadingProgressBar
            value={percent}
            tone="green"
            label={`Reading progress for ${book.name}`}
            className="mt-1"
          />

          <Link
            href={`/read/${book._id}`}
            aria-label={`${readingActionLabel(progress)} ${book.name}`}
            className="mt-2 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#5d24e2] text-[10px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#8B5CF6] focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:outline-none dark:bg-[#5d24e2] dark:hover:bg-[#8B5CF6]"
          >
            <BookOpen size={12} aria-hidden="true" />
            {readingActionLabel(progress)}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ReadingHub({ books, error }: ReadingHubProps) {
  const [readingStore] = useState(() => createReadingStore());
  const records = useSyncExternalStore(
    readingStore.subscribe,
    readingStore.getSnapshot,
    readingStore.getServerSnapshot
  );

  const [myBooksStore] = useState(() => createMyBooksStore());
  const ownedEntries = useSyncExternalStore(
    myBooksStore.subscribe,
    myBooksStore.getSnapshot,
    myBooksStore.getServerSnapshot
  );

  // Never seed demo loans from the hub: opening the reading room should not
  // create borrow records. Existing loans from My Borrows still show up.
  const [borrowStore] = useState(() => createBorrowStore(books, { seed: false }));
  const loans = useSyncExternalStore(
    borrowStore.subscribe,
    borrowStore.getSnapshot,
    borrowStore.getServerSnapshot
  );

  const [query, setQuery] = useState("");

  const ready = records !== null && ownedEntries !== null && loans !== null;

  const progressByBook = new Map(
    (records ?? []).map((record) => [record.bookId, record])
  );
  const bookById = new Map(books.map((book) => [book._id, book]));

  const continueItems = (records ?? [])
    .filter((record) => record.page > 1 && !record.completedAt)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .map((progress) => ({ progress, book: bookById.get(progress.bookId) }))
    .filter(
      (item): item is { progress: ReadingProgress; book: Book } =>
        Boolean(item.book)
    );

  const finishedItems = (records ?? [])
    .filter((record) => Boolean(record.completedAt))
    .sort(
      (a, b) =>
        new Date(b.completedAt ?? 0).getTime() -
        new Date(a.completedAt ?? 0).getTime()
    )
    .map((progress) => ({ progress, book: bookById.get(progress.bookId) }))
    .filter(
      (item): item is { progress: ReadingProgress; book: Book } =>
        Boolean(item.book)
    );

  const activeLoans = (loans ?? [])
    .filter((loan) => !loan.returnedAt)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const shelfItems = (ownedEntries ?? [])
    .map((entry) => ({ entry, book: bookById.get(entry.id) }))
    .filter(
      (item): item is { entry: OwnedBook; book: Book } => Boolean(item.book)
    );

  const visibleBooks = books.filter((book) => matchesSearch(book, query));

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 transition-colors sm:px-6 sm:py-10 lg:px-8 dark:bg-[#141126]">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e9e4dc] bg-white px-3 py-1 text-[11px] font-semibold tracking-[1.5px] text-[#8B5CF6] uppercase dark:border-white/10 dark:bg-white/5 dark:text-[#8B5CF6]">
              <BookOpen size={13} aria-hidden="true" />
              Your reading room
            </span>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#19152B] sm:text-4xl dark:text-white">
              Read Books
            </h1>

            <p className="mt-2 max-w-xl text-sm text-[#6B7280] sm:text-base dark:text-white/60">
              Pick up where you left off, keep an eye on your loans, and find
              your next page-turner. Every page you read is saved automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/my-books"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#8B5CF6] shadow-sm transition-colors hover:border-[#8B5CF6] hover:bg-[#f7f4ec] dark:border-white/10 dark:bg-white/5 dark:text-[#8B5CF6] dark:hover:border-[#8B5CF6] dark:hover:bg-white/10"
            >
              <Bookmark size={14} aria-hidden="true" />
              My Books
            </Link>

            <Link
              href="/my-borrows"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#8B5CF6] shadow-sm transition-colors hover:border-[#8B5CF6] hover:bg-[#f7f4ec] dark:border-white/10 dark:bg-white/5 dark:text-[#8B5CF6] dark:hover:border-[#8B5CF6] dark:hover:bg-white/10"
            >
              <Repeat size={14} aria-hidden="true" />
              My Borrows
            </Link>

            <Link
              href="/allbooks"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#8B5CF6] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#8B5CF6] dark:bg-[#5d24e2] dark:hover:bg-[#8B5CF6]"
            >
              <Library size={14} aria-hidden="true" />
              All books
            </Link>
          </div>
        </header>

        {!ready ? (
          <div role="status" aria-live="polite" aria-busy="true" className="mt-8">
            <span className="sr-only">Loading your reading room…</span>
            <ReadingHubBodySkeleton />
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard
                icon={<BookOpen size={17} aria-hidden="true" />}
                label="In progress"
                value={continueItems.length}
                hint="Books you've started"
                tone="green"
              />
              <StatCard
                icon={<CheckCircle2 size={17} aria-hidden="true" />}
                label="Finished"
                value={finishedItems.length}
                hint="Books completed"
                tone="green"
              />
              <StatCard
                icon={<CalendarClock size={17} aria-hidden="true" />}
                label="On loan"
                value={activeLoans.length}
                hint="Borrowed right now"
                tone="amber"
              />
              <StatCard
                icon={<Bookmark size={17} aria-hidden="true" />}
                label="In My Books"
                value={shelfItems.length}
                hint="On your personal shelf"
                tone="rose"
              />
            </div>

            {error ? (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-[#f3d6d6] bg-[#fdf5f5] px-4 py-3 text-sm dark:border-red-400/20 dark:bg-red-400/5"
              >
                <TriangleAlert
                  size={18}
                  className="mt-0.5 shrink-0 text-[#b42318] dark:text-red-300"
                  aria-hidden="true"
                />
                <p className="text-[#8A3B36] dark:text-red-200/80">
                  <span className="font-semibold text-[#b42318] dark:text-red-200">
                    The catalogue is unavailable.
                  </span>{" "}
                  {error} Your saved reading progress and loans are still here.
                </p>
              </div>
            ) : null}

            {/* Continue reading */}
            <section aria-labelledby="continue-reading-title">
              <SectionHeading
                id="continue-reading-title"
                icon={<BookOpen size={16} aria-hidden="true" />}
                title="Continue reading"
                description="Your open books, most recently read first."
                action={
                  continueItems.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-3 py-1 text-[10px] font-bold tracking-wide text-[#8B5CF6] uppercase dark:border-white/10 dark:bg-white/5 dark:text-[#8B5CF6]">
                      <Sparkles size={11} aria-hidden="true" />
                      {continueItems.length} open
                    </span>
                  ) : null
                }
              />

              <div className="mt-4">
                {continueItems.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {continueItems.map(({ book, progress }) => (
                      <ContinueCard
                        key={book._id}
                        book={book}
                        progress={progress}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9d3c6] bg-white px-6 py-10 text-center dark:border-white/10 dark:bg-[#1F1A33]">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#eef5f0] text-[#8B5CF6] dark:bg-[#8B5CF6] dark:text-[#8B5CF6]">
                      <BookOpen size={24} aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-[#19152B] dark:text-white">
                      Your next chapter starts here
                    </h3>
                    <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#6B7280] dark:text-white/50">
                      Open any book below and your place will be saved here
                      automatically — page by page.
                    </p>
                    <Link
                      href="#browse"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#8B5CF6] px-4 py-2 text-[11px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#8B5CF6] dark:bg-[#8B5CF6] dark:hover:bg-[#8B5CF6]"
                    >
                      Find a book
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>

              {finishedItems.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-[#e9e4dc] bg-white p-4 dark:border-white/10 dark:bg-[#1F1A33]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[1.5px] text-[#8B5CF6] uppercase dark:text-emerald-300">
                      <CheckCircle2 size={13} aria-hidden="true" />
                      Recently finished
                    </h3>
                    <span className="text-[10.5px] text-[#8B87A0] dark:text-white/40">
                      Read again any time
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {finishedItems.map(({ book, progress }) => (
                      <FinishedChip
                        key={book._id}
                        book={book}
                        progress={progress}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            {/* Loans + shelf */}
            <div className="grid items-start gap-4 lg:grid-cols-2">
              <section
                aria-labelledby="reading-loans-title"
                className="overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]"
              >
                <div className="border-b border-[#f0ece3] p-4 dark:border-white/10">
                  <SectionHeading
                    id="reading-loans-title"
                    icon={<CalendarClock size={16} aria-hidden="true" />}
                    title="On loan"
                    description="Books in your hands, sorted by due date."
                    action={
                      <Link
                        href="/my-borrows"
                        className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#8B5CF6] transition-colors hover:text-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:text-white"
                      >
                        Manage
                        <ChevronRight size={12} aria-hidden="true" />
                      </Link>
                    }
                  />
                </div>

                {activeLoans.length > 0 ? (
                  <ul className="divide-y divide-[#f1eee8] dark:divide-white/[0.06]">
                    {activeLoans.map((loan) => (
                      <LoanRow
                        key={loan.id}
                        loan={loan}
                        book={bookById.get(loan.book._id) ?? loan.book}
                        progress={progressByBook.get(loan.book._id) ?? null}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="px-5 py-9 text-center">
                    <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[#fef4e2] text-[#9a5b00] dark:bg-amber-400/10 dark:texT-[#8B5CF6]">
                      <Repeat size={22} aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-[#19152B] dark:text-white">
                      No books on loan
                    </p>
                    <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#6B7280] dark:text-white/50">
                      Borrow a title from My Borrows and it will appear here
                      with its due date.
                    </p>
                    <Link
                      href="/my-borrows"
                      className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#e9e4dc] px-3.5 py-1.5 text-[11px] font-semibold text-[#8B5CF6] transition-colors hover:border-[#8B5CF6] hover:bg-[#f7f4ec] dark:border-white/10 dark:text-[#8B5CF6] dark:hover:border-[#8B5CF6] dark:hover:bg-white/10"
                    >
                      Borrow a book
                      <ChevronRight size={12} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </section>

              <section
                aria-labelledby="reading-shelf-title"
                className="overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]"
              >
                <div className="border-b border-[#f0ece3] p-4 dark:border-white/10">
                  <SectionHeading
                    id="reading-shelf-title"
                    icon={<Bookmark size={16} aria-hidden="true" />}
                    title="In My Books"
                    description="Titles you've saved to your personal shelf."
                    action={
                      <Link
                        href="/my-books"
                        className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#8B5CF6] transition-colors hover:text-[#8B5CF6] dark:text-[#8B5CF6] dark:hover:text-white"
                      >
                        Open shelf
                        <ChevronRight size={12} aria-hidden="true" />
                      </Link>
                    }
                  />
                </div>

                {shelfItems.length > 0 ? (
                  <ul className="divide-y divide-[#f1eee8] dark:divide-white/[0.06]">
                    {shelfItems.slice(0, 5).map(({ book }) => (
                      <ShelfRow
                        key={book._id}
                        book={book}
                        progress={progressByBook.get(book._id) ?? null}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="px-5 py-9 text-center">
                    <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[#FCEFF0] text-[#A03A4A] dark:bg-rose-400/10 dark:text-rose-300">
                      <Bookmark size={22} aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-[#19152B] dark:text-white">
                      Your shelf is empty
                    </p>
                    <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#6B7280] dark:text-white/50">
                      Save books to My Books and they will show up here, ready
                      to read.
                    </p>
                    <Link
                      href="/Add_new_book"
                      className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#e9e4dc] px-3.5 py-1.5 text-[11px] font-semibold text-[#8B5CF6] transition-colors hover:border-[#8B5CF6] hover:bg-[#f7f4ec] dark:border-white/10 dark:text-[#8B5CF6] dark:hover:border-[#8B5CF6] dark:hover:bg-white/10"
                    >
                      <Plus size={12} aria-hidden="true" />
                      Add a book
                    </Link>
                  </div>
                )}

                {shelfItems.length > 5 ? (
                  <div className="border-t border-[#f0ece3] p-3 dark:border-white/10">
                    <Link
                      href="/my-books"
                      className="flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-semibold text-[#8B5CF6] transition-colors hover:bg-[#f7f4ec] dark:text-[#8B5CF6] dark:hover:bg-white/5"
                    >
                      View all {shelfItems.length} saved books
                      <ChevronRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                ) : null}
              </section>
            </div>

            {/* Catalogue */}
            <section id="browse" aria-labelledby="browse-title" className="scroll-mt-24">
              <SectionHeading
                id="browse-title"
                icon={<Library size={16} aria-hidden="true" />}
                title="Browse the library"
                description="Every BookNook title, with your place in each one."
                action={
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-3 py-1 text-[10px] font-bold tracking-wide text-[#8B5CF6] uppercase dark:border-white/10 dark:bg-white/5 dark:text-[#8B5CF6]">
                    {books.length} {books.length === 1 ? "title" : "titles"}
                  </span>
                }
              />

              {!error && books.length > 0 ? (
                <div className="relative mt-4 max-w-sm">
                  <Search
                    size={15}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9CA3AF] dark:text-white/30"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search titles or authors…"
                    aria-label="Search the reading library"
                    className="h-10 w-full rounded-xl border border-[#e9e4dc] bg-white pr-3 pl-9 text-sm text-[#19152B] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6] dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-emerald-400"
                  />
                </div>
              ) : null}

              {error ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-[#f3d6d6] bg-[#fdf5f5] px-6 py-12 text-center dark:border-red-400/20 dark:bg-red-400/5">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fbe6e6] text-[#b42318] dark:bg-red-400/10 dark:text-red-300">
                    <TriangleAlert size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-[#19152B] dark:text-white">
                    Couldn&apos;t load the library
                  </h3>
                  <p className="mt-1 max-w-md text-xs leading-relaxed text-[#6B7280] dark:text-white/55">
                    Make sure the books service is running on port 5000, then
                    refresh the page.
                  </p>
                </div>
              ) : books.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9d3c6] bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-[#1F1A33]">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f4f1ea] text-[#8B5CF6] dark:bg-white/5 dark:text-[#8B5CF6]">
                    <Library size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-[#19152B] dark:text-white">
                    The shelves are empty
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-[#6B7280] dark:text-white/50">
                    Add the first book and it will appear here, ready to read.
                  </p>
                </div>
              ) : visibleBooks.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9d3c6] bg-white px-6 py-12 text-center dark:border-white/10 dark:bg-[#1F1A33]">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f4f1ea] text-[#8B5CF6] dark:bg-white/5 dark:text-[#8B5CF6]">
                    <Search size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-[#19152B] dark:text-white">
                    No books found
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-[#6B7280] dark:text-white/50">
                    Nothing matches “{query.trim()}”. Try another title or
                    author.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-4 rounded-full border border-[#e9e4dc] px-4 py-1.5 text-[11px] font-semibold text-[#8B5CF6]transition-colors hover:border-[#8B5CF6] hover:bg-[#f7f4ec] dark:border-white/10 dark:text-[#8B5CF6] dark:hover:bg-white/10"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                  {visibleBooks.map((book) => (
                    <CatalogueCard
                      key={book._id}
                      book={book}
                      progress={progressByBook.get(book._id) ?? null}
                    />
                  ))}
                </div>
              )}
            </section>

            <p className="pb-2 text-center text-[11px] leading-relaxed text-[#8B87A0] dark:text-white/40">
              Reading progress, loans, and your shelf are kept in this browser
              for the demo.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
