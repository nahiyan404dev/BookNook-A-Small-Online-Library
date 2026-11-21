"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  Library,
  Search,
  Sparkles,
  Star,
  Tags,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import BookCover from "@/components/BookCover";
import { WishlistBodySkeleton } from "@/components/wishlist/WishlistSkeleton";
import {
  formatPrice,
  matchesSearch,
  normalizeCategory,
  type Book,
} from "@/lib/books";
import { createWishlistStore, type WishlistBook } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

type WishlistViewProps = {
  books: Book[];
  error: string | null;
  backHref: string;
  backLabel: string;
};

const STAT_TONES = {
  rose: "bg-[#FDF1F5] text-[#E11D48] dark:bg-[#E11D48]/15 dark:text-[#FB7185]",
  purple:
    "bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]",
  amber:
    "bg-[#FEF4E2] text-[#9A5B00] dark:bg-amber-400/10 dark:text-amber-300",
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

function WishlistCard({
  book,
  onRemove,
}: {
  book: Book;
  onRemove: (book: Book) => void;
}) {
  const rating = Number(book.rating);
  const detailsHref = `/allbooks/${book._id}`;

  return (
    <article className="group flex flex-col overflow-hidden border border-[#EAE7F2] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E11D48]/25 hover:shadow-lg hover:shadow-[#E11D48]/10 dark:border-white/10 dark:bg-[#1F1A33] dark:hover:border-[#E11D48]/35">
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

        <div className="mt-3 flex gap-2">
          <Link
            href={detailsHref}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#183d32] px-3 py-2 text-xs font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#0f2b23]"
          >
            View
            <ChevronRight size={14} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => onRemove(book)}
            aria-label={`Remove ${book.name} from wishlist`}
            title="Remove from wishlist"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E11D48]/20 bg-[#FDF1F5] text-[#E11D48] transition-colors hover:bg-[#E11D48] hover:text-white dark:border-[#E11D48]/30 dark:bg-[#E11D48]/15 dark:text-[#FB7185] dark:hover:bg-[#E11D48] dark:hover:text-white"
          >
            <Heart size={15} className="fill-current" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4DFF2] bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#1F1A33]">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-[#FDF1F5] text-[#E11D48] dark:bg-[#E11D48]/15 dark:text-[#FB7185]">
        <Heart size={26} aria-hidden="true" />
      </span>

      <h2 className="mt-4 text-lg font-bold text-[#19152B] dark:text-white">
        No favourites yet
      </h2>
      <p className="mt-1 max-w-sm text-sm text-[#6B7280] dark:text-white/55">
        Tap the heart on any book to save it here, and your next great read will
        always be one click away.
      </p>

      <Link
        href="/allbooks"
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#5426B8] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#451D96]"
      >
        Browse books
        <ChevronRight size={14} aria-hidden="true" />
      </Link>
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
        No favourites match your filters
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
        Couldn&apos;t load your wishlist
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

export default function WishlistView({
  books,
  error,
  backHref,
  backLabel,
}: WishlistViewProps) {
  const [store] = useState(() => createWishlistStore());
  const stored = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const ready = stored !== null;
  const entries = stored ?? [];

  const bookById = new Map(books.map((book) => [book._id, book]));

  // Entries are stored newest first, so the grid keeps that order.
  const favourites = entries
    .map((entry) => ({ entry, book: bookById.get(entry.id) }))
    .filter(
      (item): item is { entry: WishlistBook; book: Book } => Boolean(item.book)
    );

  const categories = [
    ...new Set(favourites.map(({ book }) => normalizeCategory(book.category))),
  ].sort((a, b) => a.localeCompare(b));

  const visible = favourites.filter(({ book }) => {
    const inCategory =
      category === "All" || normalizeCategory(book.category) === category;

    return inCategory && matchesSearch(book, query);
  });

  const ratings = favourites
    .map(({ book }) => Number(book.rating))
    .filter((rating) => Number.isFinite(rating) && rating > 0);

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
      : null;

  const handleRemove = (book: Book) => {
    const before = entries;

    store.setBooks(entries.filter((entry) => entry.id !== book._id));

    toast.success(`Removed “${book.name}” from wishlist`, {
      description: "It is no longer one of your favourites.",
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
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#E11D48] dark:text-white/60 dark:hover:text-[#FB7185]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {backLabel}
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FDF1F5] text-[#E11D48] dark:bg-[#E11D48]/15 dark:text-[#FB7185]">
                <Heart size={24} aria-hidden="true" />
              </span>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#19152B] sm:text-3xl dark:text-white">
                  Wishlist
                </h1>
                <p className="mt-1 max-w-xl text-sm text-[#6B7280] dark:text-white/55">
                  Your favourite books, saved in one place. Tap the heart on any
                  book to add it here.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#F3D6DE] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#E11D48] uppercase shadow-sm dark:border-[#E11D48]/30 dark:bg-white/5 dark:text-[#FB7185]">
                <Sparkles size={12} aria-hidden="true" />
                {ready
                  ? `${favourites.length} ${favourites.length === 1 ? "favourite" : "favourites"}`
                  : "Loading wishlist"}
              </span>

              <Link
                href="/allbooks"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#5426B8] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#451D96]"
              >
                Browse books
              </Link>
            </div>
          </div>
        </div>

        {!ready ? (
          <div role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Loading your wishlist…</span>
            <WishlistBodySkeleton />
          </div>
        ) : error ? (
          <CatalogueError message={error} />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              <StatCard
                icon={<Heart size={17} aria-hidden="true" />}
                label="Saved books"
                value={favourites.length}
                hint="Your favourites"
                tone="rose"
              />
              <StatCard
                icon={<Tags size={17} aria-hidden="true" />}
                label="Categories"
                value={categories.length}
                hint="Genres you love"
                tone="purple"
              />
              <StatCard
                icon={<Star size={17} aria-hidden="true" />}
                label="Avg rating"
                value={averageRating ? averageRating.toFixed(1) : "—"}
                hint="Across your favourites"
                tone="amber"
              />
            </div>

            {/* Search + category filters */}
            <div className="rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-[#1F1A33]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-bold text-[#19152B] dark:text-white">
                    <Library
                      size={17}
                      className="text-[#E11D48] dark:text-[#FB7185]"
                      aria-hidden="true"
                    />
                    Your favourites
                  </h2>
                  <p className="mt-0.5 text-xs text-[#6B7280] dark:text-white/50">
                    {favourites.length}{" "}
                    {favourites.length === 1 ? "book" : "books"} · newest first
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
                    placeholder="Search your wishlist…"
                    aria-label="Search your wishlist"
                    className="h-10 w-full rounded-xl border border-[#E4DFF2] bg-white pr-3 pl-9 text-sm text-[#19152B] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              {categories.length > 0 ? (
                <div
                  role="group"
                  aria-label="Filter your wishlist by category"
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
                            ? "border-transparent bg-[#E11D48] font-semibold text-white dark:bg-[#E11D48] dark:text-white"
                            : "border-[#E4DFF2] bg-white text-[#3F3D56] hover:border-[#E11D48]/30 hover:bg-[#F8F7FC] hover:text-[#E11D48] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:border-white/25 dark:hover:bg-white/[0.08] dark:hover:text-white"
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
            {favourites.length === 0 ? (
              <EmptyWishlist />
            ) : visible.length === 0 ? (
              <NoMatches
                onClear={() => {
                  setQuery("");
                  setCategory("All");
                }}
              />
            ) : (
              <section aria-label="Wishlist books">
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {visible.map(({ book }) => (
                    <WishlistCard
                      key={book._id}
                      book={book}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </section>
            )}

            <p className="pb-2 text-center text-[11px] leading-relaxed text-[#8B87A0] dark:text-white/40">
              This demo keeps your wishlist in this browser.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
