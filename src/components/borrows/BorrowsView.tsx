"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  History,
  Library,
  Plus,
  Repeat,
  RotateCcw,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import BookCover from "@/components/BookCover";
import { BorrowsBodySkeleton } from "@/components/borrows/BorrowsSkeleton";
import ReadingProgressBar from "@/components/reading/ReadingProgressBar";
import type { Book } from "@/lib/books";
import {
  createBorrowStore,
  createLoan,
  dueLabel,
  formatDay,
  loanStatus,
  LOAN_DAYS,
  type Loan,
} from "@/lib/borrows";
import {
  createReadingStore,
  readingActionLabel,
  readingPercent,
  readingStatusLabel,
  type ReadingProgress,
} from "@/lib/reading";
import { cn } from "@/lib/utils";

type BorrowsViewProps = {
  books: Book[];
  error: string | null;
  backHref: string;
  backLabel: string;
};

type Tab = "active" | "history";

const STAT_TONES = {
  purple:
    "bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]",
  amber:
    "bg-[#FEF4E2] text-[#9A5B00] dark:bg-amber-400/10 dark:text-amber-300",
  red: "bg-[#FDF1F1] text-[#B42318] dark:bg-red-400/10 dark:text-red-300",
  emerald:
    "bg-[#E7F6EE] text-[#1F7A4D] dark:bg-emerald-400/10 dark:text-emerald-300",
} as const;

const STATUS_STYLES = {
  overdue:
    "border-[#F3D6D6] bg-[#FDF1F1] text-[#B42318] dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
  "due-soon":
    "border-[#F5D9A8] bg-[#FEF4E2] text-[#9A5B00] dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  "on-time":
    "border-[#BEE8D2] bg-[#E7F6EE] text-[#1F7A4D] dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
} as const;

const DUE_TEXT = {
  overdue: "text-[#B42318] dark:text-red-300",
  "due-soon": "text-[#9A5B00] dark:text-amber-300",
  "on-time": "text-[#1F7A4D] dark:text-emerald-300",
} as const;

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
  tone: keyof typeof STAT_TONES;
}) {
  return (
    <div className="rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-[#1F1A33]">
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

function LoanStatusBadge({ loan }: { loan: Loan }) {
  const status = loanStatus(loan);
  const label =
    status === "overdue"
      ? "Overdue"
      : status === "due-soon"
        ? "Due soon"
        : "On time";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase",
        STATUS_STYLES[status]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function LoanRow({
  loan,
  progress,
  onReturn,
}: {
  loan: Loan;
  progress: ReadingProgress | null;
  onReturn: (loan: Loan) => void;
}) {
  const status = loanStatus(loan);
  const percent = readingPercent(progress);

  return (
    <li className="p-4 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <Link
          href={`/allbooks/${loan.book._id}`}
          aria-label={`View ${loan.book.name}`}
          className="shrink-0"
        >
          <BookCover
            src={loan.book.imageUrl}
            alt={`Cover of ${loan.book.name}`}
            className="h-[92px] w-16 rounded-lg sm:h-[100px] sm:w-[70px]"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[#19152B] sm:text-base dark:text-white">
                <Link
                  href={`/allbooks/${loan.book._id}`}
                  className="transition-colors hover:text-[#5426B8] dark:hover:text-[#C4B5FD]"
                >
                  {loan.book.name}
                </Link>
              </h3>

              <p className="mt-0.5 truncate text-xs text-[#6B7280] dark:text-white/50">
                {loan.book.author || "Unknown author"}
                {loan.book.category ? (
                  <span className="text-[#B4AEC6] dark:text-white/30">
                    {" "}
                    · {loan.book.category}
                  </span>
                ) : null}
              </p>
            </div>

            <LoanStatusBadge loan={loan} />
          </div>

          <dl className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#6B7280] dark:text-white/45">
            <div className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} aria-hidden="true" />
              <dt className="sr-only">Borrowed</dt>
              <dd>Borrowed {formatDay(loan.borrowedAt)}</dd>
            </div>

            <div className="inline-flex items-center gap-1.5">
              <CalendarClock size={13} aria-hidden="true" />
              <dt className="sr-only">Due</dt>
              <dd>Due {formatDay(loan.dueAt)}</dd>
            </div>
          </dl>

          <div className="mt-2.5 flex items-center gap-2.5">
            <ReadingProgressBar
              value={percent}
              label={`Reading progress for ${loan.book.name}`}
              className="max-w-[180px] flex-1"
            />
            <span className="shrink-0 text-[10.5px] font-semibold text-[#6B5B95] tabular-nums dark:text-white/50">
              {progress
                ? `${readingStatusLabel(progress)} · p. ${progress.page}/${progress.totalPages}`
                : "Not started"}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold",
                DUE_TEXT[status]
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {dueLabel(loan)}
            </p>

            <div className="flex items-center gap-2">
              <Link
                href={`/read/${loan.book._id}`}
                aria-label={`${readingActionLabel(progress)} ${loan.book.name}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#5426B8] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#451D96] focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:outline-none"
              >
                <BookOpen size={14} aria-hidden="true" />
                {readingActionLabel(progress)}
              </Link>

              <button
                type="button"
                onClick={() => onReturn(loan)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E4DFF2] bg-white px-3 text-xs font-semibold text-[#5426B8] transition-colors hover:border-[#5426B8] hover:bg-[#F1EAFF] focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD] dark:hover:border-[#8B5CF6]/50 dark:hover:bg-[#8B5CF6]/15"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function HistoryRow({
  loan,
  progress,
}: {
  loan: Loan;
  progress: ReadingProgress | null;
}) {
  const percent = readingPercent(progress);

  return (
    <li className="flex gap-3 p-4 sm:gap-4 sm:p-5">
      <Link
        href={`/allbooks/${loan.book._id}`}
        aria-label={`View ${loan.book.name}`}
        className="shrink-0"
      >
        <BookCover
          src={loan.book.imageUrl}
          alt={`Cover of ${loan.book.name}`}
          className="h-[76px] w-14 rounded-lg"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-x-3 gap-y-1">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#19152B] dark:text-white">
              <Link
                href={`/allbooks/${loan.book._id}`}
                className="transition-colors hover:text-[#5426B8] dark:hover:text-[#C4B5FD]"
              >
                {loan.book.name}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-xs text-[#6B7280] dark:text-white/50">
              {loan.book.author || "Unknown author"}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#E4DFF2] bg-[#F8F7FC] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#6B5B95] uppercase dark:border-white/10 dark:bg-white/5 dark:text-white/50">
            <CheckCircle2 size={11} aria-hidden="true" />
            Returned
          </span>
        </div>

        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#6B7280] dark:text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} aria-hidden="true" />
            Borrowed {formatDay(loan.borrowedAt)}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <RotateCcw size={13} aria-hidden="true" />
            Returned {loan.returnedAt ? formatDay(loan.returnedAt) : "—"}
          </span>
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="flex min-w-[140px] flex-1 items-center gap-2">
            <ReadingProgressBar
              value={percent}
              label={`Reading progress for ${loan.book.name}`}
              className="max-w-[140px] flex-1"
            />
            <span className="shrink-0 text-[10.5px] font-semibold text-[#6B5B95] dark:text-white/50">
              {readingStatusLabel(progress)}
            </span>
          </span>

          <Link
            href={`/read/${loan.book._id}`}
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#5426B8] transition-colors hover:text-[#451D96] dark:text-[#C4B5FD] dark:hover:text-white"
          >
            {readingActionLabel(progress)}
            <ChevronRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </li>
  );
}

function EmptyLoans() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
        <BookOpen size={26} aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-bold text-[#19152B] dark:text-white">
        No books on loan
      </h3>
      <p className="mt-1 max-w-xs text-sm text-[#6B7280] dark:text-white/50">
        Pick something from the shelf and it will appear here with a due date.
      </p>

      <Link
        href="/allbooks"
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#5426B8] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#451D96]"
      >
        Browse the shelf
        <ChevronRight size={14} aria-hidden="true" />
      </Link>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#F5F3FA] text-[#8B5CF6] dark:bg-white/5 dark:text-[#C4B5FD]">
        <History size={26} aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-bold text-[#19152B] dark:text-white">
        No returns yet
      </h3>
      <p className="mt-1 max-w-xs text-sm text-[#6B7280] dark:text-white/50">
        Finished with a book? Return it and it will move into your history.
      </p>
    </div>
  );
}

export default function BorrowsView({
  books,
  error,
  backHref,
  backLabel,
}: BorrowsViewProps) {
  const [borrowStore] = useState(() => createBorrowStore(books));
  const storedLoans = useSyncExternalStore(
    borrowStore.subscribe,
    borrowStore.getSnapshot,
    borrowStore.getServerSnapshot
  );

  const [readingStore] = useState(() => createReadingStore());
  const readingRecords = useSyncExternalStore(
    readingStore.subscribe,
    readingStore.getSnapshot,
    readingStore.getServerSnapshot
  );

  const [tab, setTab] = useState<Tab>("active");
  const [query, setQuery] = useState("");

  const ready = storedLoans !== null;
  const loans = storedLoans ?? [];

  const progressByBook = new Map(
    (readingRecords ?? []).map((record) => [record.bookId, record])
  );

  const handleBorrow = (book: Book) => {
    if (
      loans.some((loan) => !loan.returnedAt && loan.book._id === book._id)
    ) {
      toast.info("Already on your shelf", {
        description: `"${book.name}" is already borrowed.`,
      });
      return;
    }

    const loan = createLoan(book);
    borrowStore.setLoans([loan, ...loans]);
    setTab("active");

    toast.success(`"${book.name}" borrowed`, {
      description: `Due ${formatDay(loan.dueAt)} — happy reading.`,
    });
  };

  const handleReturn = (loan: Loan) => {
    const before = loans;
    const returnedAt = new Date().toISOString();

    borrowStore.setLoans(
      loans.map((item) =>
        item.id === loan.id ? { ...item, returnedAt } : item
      )
    );

    toast.success("Book returned", {
      description: `"${loan.book.name}" is back on the shelf.`,
      action: {
        label: "Undo",
        onClick: () => borrowStore.setLoans(before),
      },
    });
  };

  const now = new Date();

  const activeLoans = loans
    .filter((loan) => !loan.returnedAt)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const historyLoans = loans
    .filter((loan) => Boolean(loan.returnedAt))
    .sort(
      (a, b) =>
        new Date(b.returnedAt ?? 0).getTime() -
        new Date(a.returnedAt ?? 0).getTime()
    );

  const overdueCount = activeLoans.filter(
    (loan) => loanStatus(loan, now) === "overdue"
  ).length;

  const dueSoonCount = activeLoans.filter(
    (loan) => loanStatus(loan, now) === "due-soon"
  ).length;

  const activeIds = new Set(activeLoans.map((loan) => loan.book._id));
  const normalizedQuery = query.trim().toLowerCase();

  const availableBooks = books
    .filter((book) => !activeIds.has(book._id))
    .filter((book) => {
      if (!normalizedQuery) return true;

      return (
        book.name.toLowerCase().includes(normalizedQuery) ||
        (book.author ?? "").toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const visibleBooks = availableBooks.slice(0, 8);

  const shelfEmptyCopy = error
    ? "Connect the books service to borrow new titles."
    : books.length === 0
      ? "The shelf is empty right now."
      : normalizedQuery
        ? `No books match “${query.trim()}”.`
        : "Every book on the shelf is already on loan.";

  return (
    <div className="min-h-screen bg-[#F8F7FC] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-8 dark:bg-[#141126]">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#5426B8] dark:text-white/60 dark:hover:text-[#C4B5FD]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {backLabel}
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
                <Repeat size={24} aria-hidden="true" />
              </span>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#19152B] sm:text-3xl dark:text-white">
                  My Borrows
                </h1>
                <p className="mt-1 max-w-xl text-sm text-[#6B7280] dark:text-white/55">
                  Track what&apos;s on your shelf, return titles, and borrow
                  something new — all in one place.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#EAE7F2] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#5426B8] uppercase shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD]">
              <Sparkles size={12} aria-hidden="true" />
              {ready ? `${activeLoans.length} on loan` : "Loading loans"}
            </span>
          </div>
        </div>

        {!ready ? (
          <div role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Loading your borrows…</span>
            <BorrowsBodySkeleton />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard
                icon={<BookOpen size={17} aria-hidden="true" />}
                label="On loan"
                value={activeLoans.length}
                hint="Books in your hands"
                tone="purple"
              />
              <StatCard
                icon={<CalendarClock size={17} aria-hidden="true" />}
                label="Due soon"
                value={dueSoonCount}
                hint="Within the next 3 days"
                tone="amber"
              />
              <StatCard
                icon={<TriangleAlert size={17} aria-hidden="true" />}
                label="Overdue"
                value={overdueCount}
                hint="Needs a quick return"
                tone="red"
              />
              <StatCard
                icon={<CheckCircle2 size={17} aria-hidden="true" />}
                label="Returned"
                value={historyLoans.length}
                hint="Completed reads"
                tone="emerald"
              />
            </div>

            {error ? (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-[#F3D6D6] bg-[#FDF5F5] px-4 py-3 text-sm dark:border-red-400/20 dark:bg-red-400/5"
              >
                <TriangleAlert
                  size={18}
                  className="mt-0.5 shrink-0 text-[#B42318] dark:text-red-300"
                  aria-hidden="true"
                />
                <p className="text-[#8A3B36] dark:text-red-200/80">
                  <span className="font-semibold text-[#B42318] dark:text-red-200">
                    The catalogue is unavailable.
                  </span>{" "}
                  {error} Your saved loans are still here.
                </p>
              </div>
            ) : null}

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* Loans / history */}
              <section
                aria-labelledby="borrows-panel-title"
                className="overflow-hidden rounded-2xl border border-[#EAE7F2] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]"
              >
                <div className="flex flex-col gap-3 border-b border-[#EAE7F2] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-white/10">
                  <div>
                    <h2
                      id="borrows-panel-title"
                      className="text-base font-bold text-[#19152B] dark:text-white"
                    >
                      {tab === "active" ? "On loan" : "Return history"}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#6B7280] dark:text-white/50">
                      {tab === "active"
                        ? "Return a book whenever you're finished with it."
                        : "Every book you've sent back to the shelf."}
                    </p>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Borrow records"
                    className="flex w-full gap-1 rounded-xl bg-[#F5F3FA] p-1 sm:w-auto dark:bg-white/5"
                  >
                    <button
                      type="button"
                      role="tab"
                      id="borrows-active-tab"
                      aria-selected={tab === "active"}
                      aria-controls="borrows-active-panel"
                      onClick={() => setTab("active")}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
                        tab === "active"
                          ? "bg-white text-[#5426B8] shadow-sm dark:bg-[#2A2440] dark:text-[#C4B5FD]"
                          : "text-[#6B7280] hover:text-[#19152B] dark:text-white/55 dark:hover:text-white"
                      )}
                    >
                      On loan
                      <span
                        className={cn(
                          "rounded-full px-1.5 text-[10px] tabular-nums",
                          tab === "active"
                            ? "bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/20 dark:text-[#C4B5FD]"
                            : "bg-white/70 text-[#8B87A0] dark:bg-white/10 dark:text-white/50"
                        )}
                      >
                        {activeLoans.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      id="borrows-history-tab"
                      aria-selected={tab === "history"}
                      aria-controls="borrows-history-panel"
                      onClick={() => setTab("history")}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
                        tab === "history"
                          ? "bg-white text-[#5426B8] shadow-sm dark:bg-[#2A2440] dark:text-[#C4B5FD]"
                          : "text-[#6B7280] hover:text-[#19152B] dark:text-white/55 dark:hover:text-white"
                      )}
                    >
                      History
                      <span
                        className={cn(
                          "rounded-full px-1.5 text-[10px] tabular-nums",
                          tab === "history"
                            ? "bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/20 dark:text-[#C4B5FD]"
                            : "bg-white/70 text-[#8B87A0] dark:bg-white/10 dark:text-white/50"
                        )}
                      >
                        {historyLoans.length}
                      </span>
                    </button>
                  </div>
                </div>

                {tab === "active" ? (
                  activeLoans.length > 0 ? (
                    <ul
                      id="borrows-active-panel"
                      role="tabpanel"
                      aria-labelledby="borrows-active-tab"
                      className="divide-y divide-[#F1EEF8] dark:divide-white/[0.06]"
                    >
                      {activeLoans.map((loan) => (
                        <LoanRow
                          key={loan.id}
                          loan={loan}
                          progress={progressByBook.get(loan.book._id) ?? null}
                          onReturn={handleReturn}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div
                      id="borrows-active-panel"
                      role="tabpanel"
                      aria-labelledby="borrows-active-tab"
                    >
                      <EmptyLoans />
                    </div>
                  )
                ) : historyLoans.length > 0 ? (
                  <ul
                    id="borrows-history-panel"
                    role="tabpanel"
                    aria-labelledby="borrows-history-tab"
                    className="divide-y divide-[#F1EEF8] dark:divide-white/[0.06]"
                  >
                    {historyLoans.map((loan) => (
                      <HistoryRow
                        key={loan.id}
                        loan={loan}
                        progress={progressByBook.get(loan.book._id) ?? null}
                      />
                    ))}
                  </ul>
                ) : (
                  <div
                    id="borrows-history-panel"
                    role="tabpanel"
                    aria-labelledby="borrows-history-tab"
                  >
                    <EmptyHistory />
                  </div>
                )}
              </section>

              {/* Borrow shelf */}
              <aside
                aria-labelledby="borrow-shelf-title"
                className="lg:sticky lg:top-24 lg:self-start"
              >
                <div className="overflow-hidden rounded-2xl border border-[#EAE7F2] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
                  <div className="border-b border-[#EAE7F2] p-4 sm:p-5 dark:border-white/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2
                          id="borrow-shelf-title"
                          className="flex items-center gap-2 text-base font-bold text-[#19152B] dark:text-white"
                        >
                          <Library
                            size={17}
                            className="text-[#5426B8] dark:text-[#C4B5FD]"
                            aria-hidden="true"
                          />
                          Borrow a book
                        </h2>
                        <p className="mt-0.5 text-xs text-[#6B7280] dark:text-white/50">
                          Free for {LOAN_DAYS} days · {availableBooks.length}{" "}
                          available
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-3">
                      <Search
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9CA3AF] dark:text-white/30"
                        aria-hidden="true"
                      />
                      <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search the shelf…"
                        aria-label="Search available books"
                        className="h-10 w-full rounded-xl border border-[#E4DFF2] bg-white pr-3 pl-9 text-sm text-[#19152B] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  {visibleBooks.length > 0 ? (
                    <ul className="max-h-[440px] divide-y divide-[#F1EEF8] overflow-y-auto dark:divide-white/[0.06]">
                      {visibleBooks.map((book) => (
                        <li
                          key={book._id}
                          className="flex items-center gap-3 p-3 sm:px-4"
                        >
                          <Link
                            href={`/allbooks/${book._id}`}
                            aria-label={`View ${book.name}`}
                            className="shrink-0"
                          >
                            <BookCover
                              src={book.imageUrl}
                              alt={`Cover of ${book.name}`}
                              className="h-14 w-10 rounded-md"
                            />
                          </Link>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-[#19152B] dark:text-white">
                              {book.name}
                            </p>
                            <p className="truncate text-[11px] text-[#6B7280] dark:text-white/50">
                              {book.author || "Unknown author"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleBorrow(book)}
                            aria-label={`Borrow ${book.name}`}
                            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#5426B8] px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#451D96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
                          >
                            <Plus size={13} aria-hidden="true" />
                            Borrow
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-8 text-center text-xs text-[#6B7280] dark:text-white/45">
                      {shelfEmptyCopy}
                    </p>
                  )}

                  <div className="border-t border-[#EAE7F2] p-3 dark:border-white/10">
                    <Link
                      href="/allbooks"
                      className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#5426B8] transition-colors hover:bg-[#F1EAFF] dark:text-[#C4B5FD] dark:hover:bg-[#8B5CF6]/10"
                    >
                      Browse the full collection
                      <ChevronRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </aside>
            </div>

            <p className="pb-2 text-center text-[11px] leading-relaxed text-[#8B87A0] dark:text-white/40">
              This demo keeps your loans in this browser. Borrowing is free for{" "}
              {LOAN_DAYS} days.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
