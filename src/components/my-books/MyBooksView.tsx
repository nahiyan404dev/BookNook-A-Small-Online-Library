"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Eye,
  Library,
  Plus,
  Search,
  Sparkles,
  Star,
  Tags,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import BookCover from "@/components/BookCover";
import { MyBooksBodySkeleton } from "@/components/my-books/MyBooksSkeleton";
import ReadingProgressBar from "@/components/reading/ReadingProgressBar";
import {
  formatPrice,
  matchesSearch,
  normalizeCategory,
  type Book,
} from "@/lib/books";
import { createMyBooksStore, type OwnedBook } from "@/lib/my-books";
import {
  createReadingStore,
  readingActionLabel,
  readingPercent,
  readingStatusLabel,
  type ReadingProgress,
} from "@/lib/reading";
import { cn } from "@/lib/utils";

type MyBooksViewProps = {
  books: Book[];
  error: string | null;
  backHref: string;
  backLabel: string;
};

const STAT_TONES = {
  purple:
    "bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]",
  amber:
    "bg-[#FEF4E2] text-[#9A5B00] dark:bg-amber-400/10 dark:text-amber-300",
  emerald:
    "bg-[#E7F6EE] text-[#1F7A4D] dark:bg-emerald-400/10 dark:text-emerald-300",
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
  value: number | string;
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

function OwnedBookCard({
  book,
  progress,
  onRemove,
}: {
  book: Book;
  progress: ReadingProgress | null;
  onRemove: (book: Book) => void;
}) {
  const rating = Number(book.rating);
  const detailsHref = `/allbooks/${book._id}`;
  const percent = readingPercent(progress);

  return (
    <article className="group flex flex-col overflow-hidden border border-[#EAE7F2] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#5426B8]/30 hover:shadow-lg hover:shadow-[#5426B8]/10 dark:border-white/10 dark:bg-[#1F1A33] dark:hover:border-[#8B5CF6]/40">
      <Link href={detailsHref} aria-label={`View details for ${book.name}`}>
        <BookCover
          src={book.imageUrl}
          alt={`Cover of ${book.name}`}
          className="aspect-3/4"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-3">
        {book.category ? (
          <span className="mb-1.5 w-fit rounded-full bg-[#F1EAFF] px-2 py-0.5 text-[10px] font-semibold text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
            {normalizeCategory(book.category)}
          </span>
        ) : null}

        <h3 className="line-clamp-2 text-[15px] leading-snug font-bold tracking-tight text-[#19152B] sm:text-base dark:text-white">
          <Link
            href={detailsHref}
            className="transition-colors hover:text-[#5426B8] dark:hover:text-[#C4B5FD]"
          >
            {book.name}
          </Link>
        </h3>

        <p className="mt-1 line-clamp-1 text-xs font-medium text-[#6B7280] dark:text-white/55">
          {book.author || "Unknown author"}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="text-lg font-extrabold tracking-tight text-[#19152B] sm:text-xl dark:text-white">
            {formatPrice(book.price)}
          </span>

          {Number.isFinite(rating) && rating > 0 ? (
            <span
              aria-label={`Rated ${rating} out of 5`}
              className="flex shrink-0 items-center gap-1 rounded-md bg-[#183d32] px-2 py-1 text-xs font-bold text-white tabular-nums"
            >
              <Star size={11} className="fill-current" aria-hidden="true" />
              {rating.toFixed(1).replace(/\.0$/, "")}
            </span>
          ) : null}
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 text-[10.5px] font-semibold">
            <span
              className={cn(
                "inline-flex items-center gap-1",
                progress?.completedAt
                  ? "text-[#1F7A4D] dark:text-emerald-300"
                  : percent > 0
                    ? "text-[#5426B8] dark:text-[#C4B5FD]"
                    : "text-[#8B87A0] dark:text-white/40"
              )}
            >
              {progress?.completedAt ? (
                <CheckCircle2 size={12} aria-hidden="true" />
              ) : (
                <BookOpen size={12} aria-hidden="true" />
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
            label={`Reading progress for ${book.name}`}
            className="mt-1.5"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            href={`/read/${book._id}`}
            aria-label={`${readingActionLabel(progress)} ${book.name}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#5426B8] px-3 py-2 text-xs font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#451D96]"
          >
            <BookOpen size={14} aria-hidden="true" />
            {readingActionLabel(progress)}
          </Link>

          <Link
            href={detailsHref}
            aria-label={`View details for ${book.name}`}
            title="View details"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E4DFF2] text-[#6B7280] transition-colors hover:border-[#5426B8]/40 hover:bg-[#F1EAFF] hover:text-[#5426B8] dark:border-white/10 dark:text-white/50 dark:hover:border-[#8B5CF6]/40 dark:hover:bg-[#8B5CF6]/15 dark:hover:text-[#C4B5FD]"
          >
            <Eye size={15} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => onRemove(book)}
            aria-label={`Remove ${book.name} from My Books`}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E4DFF2] text-[#6B7280] transition-colors hover:border-[#F3D6D6] hover:bg-[#FDF1F1] hover:text-[#B42318] dark:border-white/10 dark:text-white/50 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-300"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyLibrary() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4DFF2] bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#1F1A33]">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
        <Bookmark size={26} aria-hidden="true" />
      </span>

      <h2 className="mt-4 text-lg font-bold text-[#19152B] dark:text-white">
        Your library is waiting
      </h2>
      <p className="mt-1 max-w-sm text-sm text-[#6B7280] dark:text-white/55">
        Add a book with the Add New Book form and it will show up on this shelf,
        ready to manage.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/Add_new_book"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#5426B8] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#451D96]"
        >
          <Plus size={14} aria-hidden="true" />
          Add your first book
        </Link>
        <Link
          href="/allbooks"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DFF2] bg-white px-4 py-2 text-xs font-semibold text-[#5426B8] transition-colors hover:border-[#5426B8] hover:bg-[#F1EAFF] dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD] dark:hover:border-[#8B5CF6]/50 dark:hover:bg-[#8B5CF6]/15"
        >
          Browse the shelf
        </Link>
      </div>
    </div>
  );
}

function NoMatches({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4DFF2] bg-white px-6 py-14 text-center dark:border-white/10 dark:bg-[#1F1A33]">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#F5F3FA] text-[#8B5CF6] dark:bg-white/5 dark:text-[#C4B5FD]">
        <Search size={26} aria-hidden="true" />
      </span>

      <h2 className="mt-4 text-base font-bold text-[#19152B] dark:text-white">
        No books match your filters
      </h2>
      <p className="mt-1 max-w-xs text-sm text-[#6B7280] dark:text-white/55">
        Try a different title, author, or category.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-full border border-[#E4DFF2] px-4 py-1.5 text-xs font-semibold text-[#5426B8] transition-colors hover:border-[#5426B8] hover:bg-[#F1EAFF] dark:border-white/10 dark:text-[#C4B5FD] dark:hover:border-[#8B5CF6]/50 dark:hover:bg-[#8B5CF6]/15"
      >
        Clear filters
      </button>
    </div>
  );
}

function CatalogueError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#F3D6D6] bg-[#FDF5F5] px-6 py-16 text-center dark:border-red-400/20 dark:bg-red-400/5">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#FBE6E6] text-[#B42318] dark:bg-red-400/10 dark:text-red-300">
        <TriangleAlert size={26} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-bold text-[#19152B] dark:text-white">
        Couldn&apos;t load your books
      </h2>
      <p className="mt-1 max-w-md text-sm text-[#6B7280] dark:text-white/55">
        {message} Make sure the books service is running on port 5000, then try
        again.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-5 rounded-full bg-[#5426B8] px-5 py-2 text-xs font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#451D96]"
      >
        Try again
      </button>
    </div>
  );
}

export default function MyBooksView({
  books,
  error,
  backHref,
  backLabel,
}: MyBooksViewProps) {
  const [store] = useState(() => createMyBooksStore());
  const stored = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const [readingStore] = useState(() => createReadingStore());
  const readingRecords = useSyncExternalStore(
    readingStore.subscribe,
    readingStore.getSnapshot,
    readingStore.getServerSnapshot
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const ready = stored !== null;
  const entries = stored ?? [];

  const progressByBook = new Map(
    (readingRecords ?? []).map((record) => [record.bookId, record])
  );

  const bookById = new Map(books.map((book) => [book._id, book]));

  // Entries are stored newest first, so the grid keeps that order.
  const library = entries
    .map((entry) => ({ entry, book: bookById.get(entry.id) }))
    .filter(
      (item): item is { entry: OwnedBook; book: Book } => Boolean(item.book)
    );

  const categories = [
    ...new Set(library.map(({ book }) => normalizeCategory(book.category))),
  ].sort((a, b) => a.localeCompare(b));

  const visible = library.filter(({ book }) => {
    const inCategory =
      category === "All" || normalizeCategory(book.category) === category;

    return inCategory && matchesSearch(book, query);
  });

  const ratings = library
    .map(({ book }) => Number(book.rating))
    .filter((rating) => Number.isFinite(rating) && rating > 0);

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
      : null;

  const readingNow = library.filter(({ book }) => {
    const progress = progressByBook.get(book._id);

    return Boolean(progress && progress.page > 1 && !progress.completedAt);
  }).length;

  const handleRemove = (book: Book) => {
    const before = entries;

    store.setBooks(entries.filter((entry) => entry.id !== book._id));

    toast.success(`Removed “${book.name}”`, {
      description: "It is off your personal shelf.",
      action: {
        label: "Undo",
        onClick: () => store.setBooks(before),
      },
    });
  };

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
                <Bookmark size={24} aria-hidden="true" />
              </span>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#19152B] sm:text-3xl dark:text-white">
                  My Books
                </h1>
                <p className="mt-1 max-w-xl text-sm text-[#6B7280] dark:text-white/55">
                  Every book you&apos;ve added to BookNook, collected on one
                  shelf you can search and manage.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#EAE7F2] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#5426B8] uppercase shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD]">
                <Sparkles size={12} aria-hidden="true" />
                {ready ? `${library.length} in your library` : "Loading library"}
              </span>

              <Link
                href="/Add_new_book"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#5426B8] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#451D96]"
              >
                <Plus size={14} aria-hidden="true" />
                Add a book
              </Link>
            </div>
          </div>
        </div>

        {!ready ? (
          <div role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Loading your books…</span>
            <MyBooksBodySkeleton />
          </div>
        ) : error ? (
          <CatalogueError message={error} />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard
                icon={<BookOpen size={17} aria-hidden="true" />}
                label="Books"
                value={library.length}
                hint="In your library"
                tone="purple"
              />
              <StatCard
                icon={<Tags size={17} aria-hidden="true" />}
                label="Categories"
                value={categories.length}
                hint="Genres you collect"
                tone="emerald"
              />
              <StatCard
                icon={<Star size={17} aria-hidden="true" />}
                label="Avg rating"
                value={averageRating ? averageRating.toFixed(1) : "—"}
                hint="Across your books"
                tone="amber"
              />
              <StatCard
                icon={<Bookmark size={17} aria-hidden="true" />}
                label="Reading now"
                value={readingNow}
                hint="Continue where you left off"
                tone="purple"
              />
            </div>

            {/* Search + category filters */}
            <div className="rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-[#1F1A33]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-bold text-[#19152B] dark:text-white">
                    <Library
                      size={17}
                      className="text-[#5426B8] dark:text-[#C4B5FD]"
                      aria-hidden="true"
                    />
                    Your shelf
                  </h2>
                  <p className="mt-0.5 text-xs text-[#6B7280] dark:text-white/50">
                    {library.length} {library.length === 1 ? "book" : "books"} ·
                    newest first
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search
                    size={15}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#9CA3AF] dark:text-white/30"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search your books…"
                    aria-label="Search your books"
                    className="h-10 w-full rounded-xl border border-[#E4DFF2] bg-white pr-3 pl-9 text-sm text-[#19152B] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              {categories.length > 0 ? (
                <div
                  role="group"
                  aria-label="Filter your books by category"
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {["All", ...categories].map((name) => {
                    const active = name === category;

                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setCategory(name)}
                        aria-pressed={active}
                        className={cn(
                          "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all duration-200 sm:text-xs",
                          active
                            ? "border-transparent bg-[#5426B8] font-semibold text-white dark:bg-[#8B5CF6] dark:text-white"
                            : "border-[#E4DFF2] bg-white text-[#3F3D56] hover:border-[#5426B8]/30 hover:bg-[#F8F7FC] hover:text-[#5426B8] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:border-white/25 dark:hover:bg-white/[0.08] dark:hover:text-white"
                        )}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* Books */}
            {library.length === 0 ? (
              <EmptyLibrary />
            ) : visible.length === 0 ? (
              <NoMatches
                onClear={() => {
                  setQuery("");
                  setCategory("All");
                }}
              />
            ) : (
              <section aria-label="My books">
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {visible.map(({ book }) => (
                    <OwnedBookCard
                      key={book._id}
                      book={book}
                      progress={progressByBook.get(book._id) ?? null}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </section>
            )}

            <p className="pb-2 text-center text-[11px] leading-relaxed text-[#8B87A0] dark:text-white/40">
              This demo keeps your personal library in this browser.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
