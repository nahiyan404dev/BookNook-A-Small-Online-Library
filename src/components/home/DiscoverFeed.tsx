"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import BookCover from "@/components/BookCover";
import { normalizeCategory, type Book } from "@/lib/books";
import { cn } from "@/lib/utils";

const ROLE_LABELS = ["New Books", "Popular Reads", "Editor's Picks"];

 
const EDITORS_PICKS = ["The Alchemist", "The Martian", "Atomic Habits"];

function ratingOf(book: Book) {
  const rating = Number(book.rating);
  return Number.isFinite(rating) ? rating : 0;
}

type RailItem = { label: string; book: Book };

function buildRail(pool: Book[]): RailItem[] {
  if (pool.length === 0) return [];

  const newest = [...pool].sort((a, b) =>
    String(b._id).localeCompare(String(a._id))
  )[0];
  const rated = [...pool].sort((a, b) => ratingOf(b) - ratingOf(a));
  const editorsPick =
    EDITORS_PICKS.map((title) => pool.find((book) => book.name === title)).find(
      (book): book is Book => Boolean(book)
    ) ?? rated[1];

  const queue: (Book | undefined)[] = [
    newest,
    rated[0],
    editorsPick,
    ...rated,
    ...pool,
  ];

  const seen = new Set<string>();
  const rail: RailItem[] = [];

  for (const book of queue) {
    if (!book || seen.has(book._id)) continue;

    seen.add(book._id);
    rail.push({
      label: ROLE_LABELS[rail.length] ?? "Editor's Picks",
      book,
    });

    if (rail.length === ROLE_LABELS.length) break;
  }

  return rail;
}

export default function DiscoverFeed({ books }: { books: Book[] }) {
  const [category, setCategory] = useState("All");

  const counts = new Map<string, number>();
  for (const book of books) {
    const name = normalizeCategory(book.category);
    if (name === "Uncategorised") continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const categories = [
    "All",
    ...[...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name]) => name),
  ];

  const pool =
    category === "All"
      ? books
      : books.filter((book) => normalizeCategory(book.category) === category);
  const rail = buildRail(pool);

  return (
    <section
      aria-labelledby="explore-categories"
      className="min-h-screen bg-[#faf9f6] px-4 py-8 transition-colors sm:px-6 sm:py-10 lg:px-8 dark:bg-zinc-900"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* categories */}
        <h2
          id="explore-categories"
          className="text-base font-bold tracking-tight sm:text-lg"
        >
          Explore Categories
        </h2>

        <div
          role="group"
          aria-label="Filter books by category"
          className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((name) => {
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
                    ? "border-transparent bg-[#8B5CF6] font-semibold text-white dark:bg-[#8B5CF6] dark:text-white"
                    : "border-[#e9e4dc] bg-white text-[#3F3D56] hover:border-[#183d32]/30 hover:bg-[#faf9f6] hover:text-[#183d32] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:border-white/25 dark:hover:bg-white/[0.08] dark:hover:text-white"
                )}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* new arrivals */}
        <div className="mt-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-tight sm:text-lg">
                New Arrivals
              </h2>
              <p className="mt-0.5 text-[11px] text-[#6B7280] sm:text-xs dark:text-white/45">
                {category === "All"
                  ? "Handpicked from the shelves"
                  : `Top picks in ${category}`}
              </p>
            </div>

            <Link
              href="/allbooks"
              className="group inline-flex shrink-0 items-center gap-1 pb-0.5 text-[11px] font-semibold text-[#8B5CF6] transition-colors hover:text-[#8B5CF6] sm:text-xs dark:text-[#9BE7B8] dark:hover:text-white"
            >
              View all
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {rail.length > 0 ? (
            <div
              key={category}
              className="discover-swap mt-3 grid grid-cols-3 gap-3 sm:gap-4"
            >
              {rail.map(({ label, book }) => (
                <Link
                  key={book._id}
                  href={`/allbooks/${book._id}`}
                  className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6] dark:focus-visible:outline-[#8B5CF6]"
                >
                  <div className="relative overflow-hidden rounded-lg ring-1 ring-black/[0.06] transition-transform duration-500 group-hover:-translate-y-1 sm:rounded-xl dark:ring-white/10">
                    <BookCover
                      src={book.imageUrl}
                      alt={`Cover of ${book.name}`}
                      className="aspect-2/3 w-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>

                  <p className="mt-2 truncate text-[10.5px] font-medium text-[#6B7280] transition-colors group-hover:text-[#183d32] sm:text-xs dark:text-white/55 dark:group-hover:text-white/85">
                    {label}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e9e4dc] bg-white/60 px-5 py-10 text-center dark:border-white/15 dark:bg-white/[0.02]">
              <p className="text-sm font-medium text-[#4B5F56] dark:text-white/70">
                No books in this category yet.
              </p>
              <button
                type="button"
                onClick={() => setCategory("All")}
                className="mt-3 rounded-full border border-[#e9e4dc] px-4 py-1.5 text-xs font-semibold text-[#183d32] transition-colors hover:border-[#183d32]/40 hover:bg-[#183d32]/5 dark:border-white/15 dark:text-[#9BE7B8] dark:hover:border-[#4ADE80]/50 dark:hover:bg-[#4ADE80]/10 dark:hover:text-white"
              >
                Show all books
              </button>
            </div>
          )}

          <p role="status" className="sr-only">
            {category === "All"
              ? "Showing handpicked books from every category."
              : `Showing top picks in ${category}.`}
          </p>
        </div>

        {/* journey + why */}
        <div className="mt-8 border-t border-[#e9e4dc] pt-6 sm:mt-10 sm:pt-8 dark:border-white/10">
          <div className="grid gap-7 sm:grid-cols-2 sm:gap-10">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Your Reading Journey
              </h2>
              <p className="mt-1.5 max-w-xs text-[11.5px] leading-relaxed text-[#6B7280] sm:text-sm dark:text-white/50">
                Track your progress and reach your reading goals.
              </p>

              <Link
                href="/my-borrows"
                className="group mt-4 inline-flex items-center gap-2 rounded-full bg-[#8B5CF6] px-4 py-2 text-[11px] font-semibold text-white transition-colors duration-300 hover:bg-[#8B5CF6] sm:text-xs"
              >
                Start Reading
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Why BookNook?
              </h2>
              <p className="mt-1.5 max-w-xs text-[11.5px] leading-relaxed text-[#6B7280] sm:text-sm dark:text-white/50">
                Discover, borrow and enjoy your favourite stories.
              </p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {["Discover", "Borrow", "Enjoy"].map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e4dc] bg-[#faf9f6] px-3 py-1 text-[10.5px] font-medium text-[#4B5F56] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60"
                  >
                    <span className="size-1 rounded-full bg-[#8B5CF6] dark:bg-[#8B5CF6]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* community */}
          <Link
            href="/register"
            className="  group mt-8 flex items-center justify-between gap-4
  rounded-2xl border border-[#183d32]/20
   from-[#F2F7F3] via-white to-[#F6F2FC]
  px-4 py-4 sm:px-6 sm:py-5
  text-[#183d32]
  shadow-sm shadow-[#183d32]/5
  transition-all duration-300
  hover:-translate-y-0.5
  hover:border-[#183d32]/50
  hover:shadow-md hover:shadow-[#183d32]/10
  dark:border-[#8B5CF6]
   dark:from-[#17251F] dark:to-[#211832]
  dark:text-white
  dark:hover:border-[#8B5CF6]
"
          >
            <div>
              <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                Join Our Reading Community
              </h2>
              <p className="mt-1 text-[11px] text-[#6B7280] sm:text-sm dark:text-white/50">
                Every book opens a new world.
              </p>
            </div>

            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#d7e3da] text-[#183d32] transition-colors duration-300 group-hover:border-[#183d32] group-hover:bg-[#183d32] group-hover:text-white dark:border-white/15 dark:text-[#8B5CF6] dark:group-hover:border-[#8B5CF6] dark:group-hover:bg-[#8B5CF6] dark:group-hover:text-[#07130C]">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
