import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CalendarClock,
  ChevronRight,
  Library,
  Star,
  Tag,
  TriangleAlert,
  UserRound,
} from "lucide-react";

import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import BookDetailsActions from "@/components/BookDetailsActions";
import {
  formatDuration,
  formatPrice,
  getOriginalPrice,
  type Book,
} from "@/lib/books";
import { getBook, getBooks } from "@/lib/books-api";

/* ------------------------------------------------------------ metadata */

export async function generateMetadata({
  params,
}: PageProps<"/allbooks/[id]">): Promise<Metadata> {
  const { id } = await params;

  try {
    const book = await getBook(id);

    if (!book) {
      return { title: "Book not found — BookNook" };
    }

    return {
      title: `${book.name} — BookNook`,
      description:
        book.description?.slice(0, 155) ??
        `Borrow ${book.name} by ${book.author ?? "an unknown author"} from BookNook.`,
    };
  } catch {
    return { title: "Book details — BookNook" };
  }
}

/* --------------------------------------------------------------- pieces */

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={16}
          className={
            index < Math.round(rating)
              ? "fill-[#f2b705] text-[#f2b705]"
              : "text-[#d8d4e4] dark:text-white/20"
          }
        />
      ))}
    </span>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#e9e4dc] bg-white p-3 dark:border-white/10 dark:bg-[#1F1A33]">
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#8B87A0] uppercase dark:text-white/45">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 truncate text-sm font-semibold text-[#19152B] dark:text-white">
        {value}
      </dd>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-16 dark:bg-[#141126]">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-[#f3d6d6] bg-[#fdf5f5] px-6 py-14 text-center dark:border-red-400/20 dark:bg-red-400/5">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-[#fbe6e6] text-[#b42318] dark:bg-red-400/10 dark:text-red-300">
          <TriangleAlert size={26} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-[#19152B] dark:text-white">
          Couldn&apos;t load this book
        </h1>
        <p className="mt-2 text-sm text-[#6B7280] dark:text-white/55">
          {message} Make sure the books service is running on port 5000, then
          try again.
        </p>
        <Link
          href="/allbooks"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#183d32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f2b23]"
        >
          Back to all books
        </Link>
      </div>
    </main>
  );
}

async function RelatedBooks({
  category,
  currentId,
}: {
  category?: string;
  currentId: string;
}) {
  if (!category) return null;

  let related: Book[] = [];

  try {
    const books = await getBooks();
    related = books
      .filter((book) => book._id !== currentId && book.category === category)
      .slice(0, 5);
  } catch {
    return null;
  }

  if (related.length === 0) return null;

  return (
    <section className="mt-14 border-t border-[#e9e4dc] pt-10 dark:border-white/10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#19152B] sm:text-2xl dark:text-white">
            More in {category}
          </h2>
          <p className="mt-1 text-sm text-[#6B7280] dark:text-white/55">
            Other titles from the same shelf.
          </p>
        </div>

        <Link
          href="/allbooks"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#183d32] transition-colors hover:text-[#0f2b23] dark:text-[#C4B5FD] dark:hover:text-white"
        >
          Browse all books
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {related.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- page */

export default async function BookDetailsPage({
  params,
}: PageProps<"/allbooks/[id]">) {
  const { id } = await params;

  let book: Book | null = null;
  let error: string | null = null;

  try {
    book = await getBook(id);
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Something went wrong while fetching this book.";
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!book) {
    notFound();
  }

  const rating = Number(book.rating);
  const price = Number(book.price);
  const originalPrice = getOriginalPrice(book);
  const savings =
    originalPrice && Number.isFinite(price)
      ? Math.round(originalPrice - price)
      : 0;
  const borrowPeriod = formatDuration(book.duration);

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 transition-colors sm:px-6 sm:py-10 lg:px-8 dark:bg-[#141126]">
      <div className="mx-auto w-full max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] dark:text-white/55"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[#183d32] dark:hover:text-white"
          >
            Home
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/allbooks"
            className="transition-colors hover:text-[#183d32] dark:hover:text-white"
          >
            All books
          </Link>
          <ChevronRight size={12} />
          <span className="max-w-[45vw] truncate text-[#19152B] sm:max-w-xs dark:text-white/80">
            {book.name}
          </span>
        </nav>

        <article className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
          {/* Cover */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#183d32]/20 via-[#8B5CF6]/10 to-transparent blur-2xl"
              />
              <div className="relative overflow-hidden rounded-2xl border border-[#e9e4dc] bg-white shadow-xl shadow-[#183d32]/10 dark:border-white/10 dark:bg-[#1F1A33]">
                <BookCover
                  src={book.imageUrl}
                  alt={`Cover of ${book.name}`}
                  priority
                  className="aspect-3/4"
                />
              </div>
            </div>

            <div className="mx-auto mt-4 flex max-w-sm flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7f3ee] px-3 py-1 text-[11px] font-bold tracking-wide text-[#183d32] uppercase dark:bg-[#183d32]/40 dark:text-emerald-200">
                <span className="size-1.5 rounded-full bg-[#2f9e6f]" />
                Available to borrow
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {book.category ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#183d32] px-3 py-1 text-[11px] font-bold tracking-[1px] text-white uppercase">
                  {book.category}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-white px-3 py-1 text-[11px] font-semibold text-[#6B7280] dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                <CalendarClock size={12} />
                {borrowPeriod} borrow
              </span>
            </div>

            <h1 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-[#19152B] sm:text-4xl lg:text-[2.75rem] dark:text-white">
              {book.name}
            </h1>

            <p className="mt-3 flex flex-wrap items-center gap-1.5 text-base text-[#6B7280] dark:text-white/60">
              <UserRound
                size={17}
                className="text-[#183d32] dark:text-[#C4B5FD]"
              />
              by
              <span className="font-semibold text-[#19152B] dark:text-white/85">
                {book.author || "Unknown author"}
              </span>
            </p>

            {Number.isFinite(rating) && rating > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <RatingStars rating={rating} />
                <span className="text-sm font-bold text-[#19152B] dark:text-white">
                  {rating.toFixed(1)}
                </span>
                <span className="text-sm text-[#9CA3AF] dark:text-white/40">
                  / 5
                </span>
              </div>
            ) : null}

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e9e4dc] bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-[#1F1A33]">
              <div>
                <p className="text-[11px] font-semibold tracking-[1.5px] text-[#8B87A0] uppercase dark:text-white/45">
                  Price
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-[#19152B] dark:text-white">
                    {formatPrice(book.price)}
                  </span>
                  {originalPrice ? (
                    <span className="text-base font-medium text-[#9CA3AF] line-through dark:text-white/40">
                      {formatPrice(originalPrice)}
                    </span>
                  ) : null}
                  {savings > 0 ? (
                    <span className="rounded-full bg-[#e7f3ee] px-2 py-0.5 text-[11px] font-bold text-[#183d32] dark:bg-[#183d32]/40 dark:text-emerald-200">
                      Save {formatPrice(savings)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[#6B7280] dark:text-white/60">
                <CalendarClock size={16} />
                Return in {borrowPeriod}
              </div>
            </div>

            <BookDetailsActions name={book.name} />

            {/* Description */}
            <section className="mt-8">
              <h2 className="text-lg font-bold tracking-tight text-[#19152B] dark:text-white">
                About this book
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#4B5563] dark:text-white/70">
                {book.description ||
                  "No description has been added for this book yet. Ask a librarian for a summary the next time you visit."}
              </p>
            </section>

            {/* Quick facts */}
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <DetailItem
                icon={<UserRound size={12} />}
                label="Author"
                value={book.author || "Unknown"}
              />
              <DetailItem
                icon={<Tag size={12} />}
                label="Category"
                value={book.category || "Uncategorised"}
              />
              <DetailItem
                icon={<CalendarClock size={12} />}
                label="Borrow period"
                value={borrowPeriod}
              />
              <DetailItem
                icon={<Star size={12} />}
                label="Rating"
                value={
                  Number.isFinite(rating) && rating > 0
                    ? `${rating.toFixed(1)} / 5`
                    : "Not rated"
                }
              />
            </dl>

            <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-[#8B87A0] dark:text-white/45">
              <Library size={14} className="mt-0.5 shrink-0" />
              Pick up at the front desk, or ask a librarian to reserve a copy for
              you.
            </p>
          </div>
        </article>

        <Suspense fallback={null}>
          <RelatedBooks category={book.category} currentId={book._id} />
        </Suspense>
      </div>
    </main>
  );
}
