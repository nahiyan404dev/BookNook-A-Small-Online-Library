"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
 

import BookCover from "@/components/BookCover";
import { formatPrice, searchBooks, type Book } from "@/lib/books";
import { cn } from "@/lib/utils";
import { Loader2, Search, X } from "lucide-react";

const MAX_RESULTS = 6;

type NavbarSearchProps = {
  /** `desktop` sits inline in the header; `mobile` spans the row below it. */
  variant?: "desktop" | "mobile";
};

/** Title matches first, then the rest, so "the martian" beats a description hit. */
function rankResults(books: Book[], query: string): Book[] {
  const needle = query.trim().toLowerCase();
  const matches = searchBooks(books, needle);

  return matches
    .map((book) => {
      const name = book.name.toLowerCase();
      const score = name === needle ? 0 : name.startsWith(needle) ? 1 : 2;
      return { book, score };
    })
    .sort((a, b) => a.score - b.score || a.book.name.localeCompare(b.book.name))
    .slice(0, MAX_RESULTS)
    .map(({ book }) => book);
}

export default function NavbarSearch({ variant = "desktop" }: NavbarSearchProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = query.trim();
  const results = trimmedQuery ? rankResults(books ?? [], trimmedQuery) : [];

  // Load the catalogue once, the first time the field is used.
  async function ensureBooks() {
    if (books || status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/books", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Could not load books.");
      }

      const data = await res.json();
      setBooks(Array.isArray(data) ? (data as Book[]) : []);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function submit() {
    if (!trimmedQuery) return;

    const selected = results[activeIndex];

    if (selected) {
      router.push(`/allbooks/${selected._id}`);
    } else {
      router.push(`/allbooks?q=${encodeURIComponent(trimmedQuery)}`);
    }

    close();
    inputRef.current?.blur();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      close();
      inputRef.current?.blur();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);

      if (results.length === 0) return;

      setActiveIndex((current) => {
        if (event.key === "ArrowDown") {
          return current >= results.length - 1 ? 0 : current + 1;
        }

        return current <= 0 ? results.length - 1 : current - 1;
      });
    }
  }

  // Close when clicking outside of the search field.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const isDesktop = variant === "desktop";
  const listId = `navbar-search-results-${variant}`;

  return (
    <div
      ref={containerRef}
      className={cn("relative", isDesktop && "ml-2 hidden md:block")}
    >
      <form role="search" onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}>
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            void ensureBooks();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search books..."
          aria-label="Search books"
          aria-autocomplete="list"
          aria-expanded={open && trimmedQuery.length > 0}
          aria-controls={listId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          role="combobox"
          className={cn(
            "h-10 rounded-full border border-[#dcd6cc] bg-white pr-10 text-sm font-medium text-[#19152B] outline-none transition-all placeholder:text-gray-400 focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40",
            isDesktop
              ? "w-48 pl-10 focus:w-64 xl:w-64 xl:focus:w-72"
              : "w-full pl-10"
          )}
        />

        {status === "loading" ? (
          <Loader2
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-[#8B5CF6]"
          />
        ) : null}

      </form>

      {open ? (
        <div
          className={cn(
            "absolute top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#EAE7F2] bg-white shadow-xl shadow-[#5426B8]/10 dark:border-white/10 dark:bg-[#1F1A33] dark:shadow-black/40",
            isDesktop
              ? "left-0 w-[22rem] max-w-[calc(100vw-2rem)]"
              : "inset-x-0 w-full"
          )}
        >
          {!trimmedQuery ? (
            <p className="px-4 py-3 text-xs font-medium text-[#6B7280] dark:text-white/55">
              Search by title, author, or category.
            </p>
          ) : status === "loading" ? (
            <p className="px-4 py-3 text-xs font-medium text-[#6B7280] dark:text-white/55">
              Loading books…
            </p>
          ) : status === "error" ? (
            <p className="px-4 py-3 text-xs font-medium text-[#b42318] dark:text-red-300">
              Couldn&apos;t load the catalogue. Press Enter to search the full
              page instead.
            </p>
          ) : results.length === 0 ? (
            <div className="px-4 py-4">
              <p className="text-sm font-semibold text-[#19152B] dark:text-white">
                No books found
              </p>
              <p className="mt-0.5 text-xs text-[#6B7280] dark:text-white/55">
                Nothing matches “{trimmedQuery}”. Try a different title or
                author.
              </p>
            </div>
          ) : (
            <>
              <ul
                id={listId}
                role="listbox"
                aria-label="Matching books"
                className="max-h-[22rem] overflow-y-auto p-1.5"
              >
                {results.map((book, index) => (
                  <li key={book._id} role="none">
                    <button
                      type="button"
                      id={`${listId}-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        router.push(`/allbooks/${book._id}`);
                        close();
                        inputRef.current?.blur();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
                        index === activeIndex
                          ? "bg-[#EDE9FE] dark:bg-[#8B5CF6]/15"
                          : "hover:bg-[#F5F4FA] dark:hover:bg-white/5"
                      )}
                    >
                      <BookCover
                        src={book.imageUrl}
                        alt={`Cover of ${book.name}`}
                        className="aspect-3/4 w-9 shrink-0 rounded-md"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-[#19152B] dark:text-white">
                          {book.name}
                        </span>
                        <span className="block truncate text-[11px] font-medium text-[#6B7280] dark:text-white/55">
                          {book.author || "Unknown author"}
                        </span>
                      </span>

                      <span className="shrink-0 text-xs font-bold text-[#183d32] dark:text-[#9BE7B8]">
                        {formatPrice(book.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  router.push(`/allbooks?q=${encodeURIComponent(trimmedQuery)}`);
                  close();
                  inputRef.current?.blur();
                }}
                className="group flex w-full items-center justify-between gap-2 border-t border-[#EAE7F2] px-4 py-2.5 text-xs font-semibold text-[#5426B8] transition-colors hover:bg-[#F5F4FA] dark:border-white/10 dark:text-[#C4B5FD] dark:hover:bg-white/5"
              >
                <span className="truncate">
                  See all results for “{trimmedQuery}”
                </span>
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}


// : query ? (
//           <button
//             type="button"
//             onClick={() => {
//               setQuery("");
//               setActiveIndex(-1);
//               inputRef.current?.focus();
//             }}
//             aria-label="Clear search"
//             className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-[#EDE9FE] hover:text-[#5426B8] dark:hover:bg-white/10 dark:hover:text-white"
//           >
//             <X size={14} />
//           </button>
        