"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ types */

type CoverArt = "arch" | "blob" | "frame" | "lines" | "orbit";

type CoverSpec = {
  title: string;
  author: string;
  label?: string;
  /** cover paper colour */
  cover: string;
  /** text colour printed on the cover */
  ink: string;
  /** artwork colour */
  accent: string;
  art: CoverArt;
};

type FloatingBookSpec = CoverSpec & {
  width: string;
  position: string;
  hide?: string;
  tilt: number;
  duration: number;
  delay?: number;
  depth?: number;
};

type FeaturedPick = {
  slug: string;
  blurb: string;
  tags: string[];
  book: CoverSpec;
};

/* ------------------------------------------------------------------- data */

const floatingBooks: FloatingBookSpec[] = [
  {
    title: "SUNDAYS",
    author: "Anna R. Hale",
    label: "A NOVEL",
    cover: "#21402E",
    ink: "#F0E9D8",
    accent: "#8FA58C",
    art: "arch",
    width: "w-[12.5cqw]",
    position: "left-[2.6%] top-[47%]",
    tilt: -5,
    duration: 9,
    depth: 26,
  },
  {
    title: "Between Form and Function",
    author: "Studio Field",
    label: "DESIGN",
    cover: "#E9E4D8",
    ink: "#15140F",
    accent: "#1A1915",
    art: "blob",
    width: "w-[14cqw]",
    position: "right-[7%] top-[3%]",
    tilt: 4,
    duration: 11,
    delay: -2.5,
    depth: 46,
  },
  {
    title: "White Form",
    author: "N. Sato",
    label: "OBJECTS",
    cover: "#EFEDE8",
    ink: "#1A1915",
    accent: "#26241F",
    art: "blob",
    width: "w-[12.5cqw]",
    position: "right-[1.5%] bottom-[4%]",
    tilt: -4,
    duration: 10,
    delay: -5,
    depth: 38,
  },
  {
    title: "Fluid Reflections",
    author: "E. Moreau",
    label: "PHOTO",
    cover: "#E5BC93",
    ink: "#241C14",
    accent: "#7A654C",
    art: "frame",
    width: "w-[11.5cqw]",
    position: "left-[19.5%] bottom-[4%]",
    tilt: 6,
    duration: 12,
    delay: -3,
    depth: 32,
  },
  {
    title: "Spatial Systems Manual",
    author: "Atelier Nine",
    label: "MANUAL",
    cover: "#C25A2E",
    ink: "#F6EADF",
    accent: "#F0D9C4",
    art: "lines",
    width: "w-[12cqw]",
    position: "right-[23%] bottom-[3%]",
    tilt: -3,
    duration: 10.5,
    delay: -6,
    depth: 44,
  },
];

const picks: FeaturedPick[] = [
  {
    slug: "unseen-details",
    blurb:
      "An exploration of subtle elements often overlooked in design and everyday life — the small details that quietly shape perception.",
    tags: ["Details", "Observation", "Subtlety"],
    book: {
      title: "The Unseen Details",
      author: "Design Notes Collective",
      label: "ESSAYS",
      cover: "#E4DDCE",
      ink: "#1B1914",
      accent: "#BCAF95",
      art: "orbit",
    },
  },
  {
    slug: "borrowed-light",
    blurb:
      "A reader's year of books passed between strangers — dog-eared, annotated, and returned with somebody else's thoughts tucked inside.",
    tags: ["Memoir", "Libraries"],
    book: {
      title: "Borrowed Light",
      author: "Mira Halden",
      label: "MEMOIR",
      cover: "#1F3550",
      ink: "#EFE9DA",
      accent: "#E3B36A",
      art: "arch",
    },
  },
  {
    slug: "quiet-hours",
    blurb:
      "Notes on reading slowly, walking home the long way, and keeping a shelf that remembers exactly who you were.",
    tags: ["Essays", "Slow living"],
    book: {
      title: "Quiet Hours",
      author: "Elias Ward",
      label: "ESSAYS",
      cover: "#DED2BC",
      ink: "#25221B",
      accent: "#6B6552",
      art: "frame",
    },
  },
];

/* --------------------------------------------------------------- artwork */

function CoverArt({
  art,
  accent,
  ink,
}: {
  art: CoverArt;
  accent: string;
  ink: string;
}) {
  if (art === "arch") {
    return (
      <>
        <div
          aria-hidden
          className="absolute inset-x-5 top-5 h-full"
          style={{ backgroundColor: accent }}
        />
        <div
          aria-hidden
          className="absolute inset-x-[16%] top-[86%] h-px"
          style={{ backgroundColor: ink, opacity: 0.3 }}
        />
      </>
    );
  }

  if (art === "blob") {
    return (
      <>
        <div
          aria-hidden
          className="absolute right-[-14%] bottom-[-12%] h-[72%] w-[88%]"
          style={{
            backgroundColor: accent,
            borderRadius: "58% 42% 38% 62% / 48% 55% 45% 52%",
          }}
        />
        <div
          aria-hidden
          className="absolute top-[16%] left-[10%] h-[20%] w-[20%] rotate-12"
          style={{
            backgroundColor: accent,
            borderRadius: "62% 38% 52% 48% / 46% 58% 42% 54%",
            opacity: 0.92,
          }}
        />
      </>
    );
  }

  if (art === "frame") {
    return (
      <div
        aria-hidden
        className="absolute inset-x-[18%] top-[34%] bottom-[18%] overflow-hidden border"
        style={{ borderColor: `${ink}2e` }}
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(130% 100% at 25% 15%, #ffffff66 0%, transparent 55%), repeating-linear-gradient(118deg, ${accent} 0 5%, ${ink}22 5% 5.8%), linear-gradient(155deg, ${accent}, ${ink})`,
          }}
        />
      </div>
    );
  }

  if (art === "orbit") {
    return (
      <>
        <div
          aria-hidden
          className="absolute top-[58%] left-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: `${accent}cc` }}
        />
        <div
          aria-hidden
          className="absolute top-[58%] left-1/2 h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: accent, opacity: 0.9 }}
        />
      </>
    );
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage: `repeating-linear-gradient(118deg, transparent 0 10%, ${accent} 10% 10.7%)`,
      }}
    />
  );
}

/* ------------------------------------------------------------- book cover */

function Cover({ book, className }: { book: CoverSpec; className?: string }) {
  return (
    <div
      className={cn(
        "@container relative aspect-3/4 w-full overflow-hidden rounded-[3px]",
        className
      )}
      style={{ backgroundColor: book.cover, color: book.ink }}
    >
      <CoverArt art={book.art} accent={book.accent} ink={book.ink} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-black/15 dark:to-black/30" />

      <div className="relative z-10 flex h-full flex-col justify-between p-[8.5cqw]">
        <div className="flex items-start justify-between gap-[6cqw]">
          <p className="font-serif text-[6.4cqw] leading-[1.02] font-semibold tracking-[-0.01em] text-balance">
            {book.title}
          </p>
          {book.label ? (
            <span className="shrink-0 pt-[0.6cqw] text-[2.7cqw] font-semibold tracking-[0.22em] uppercase opacity-55">
              {book.label}
            </span>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-[4cqw]">
          <span className="text-[3cqw] font-medium tracking-[0.15em] uppercase opacity-65">
            {book.author}
          </span>
          <span className="text-[2.6cqw] font-bold tracking-[0.2em] uppercase opacity-45">
            BN
          </span>
        </div>
      </div>

      {/* spine shading */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[4.5%] bg-gradient-to-r from-black/35 to-black/[0.04]" />
      <div className="pointer-events-none absolute inset-y-0 left-[4.5%] z-20 w-[1.5%] bg-gradient-to-r from-white/25 to-transparent" />
    </div>
  );
}

function TiltedBook({
  book,
  tilt,
  className,
  compact = false,
}: {
  book: CoverSpec;
  tilt: number;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn("relative", className)}
      style={{ perspective: "1400px" }}
    >
      <div
        className={cn(
          "hero-tilt relative w-full",
          compact
            ? "shadow-[3px_8px_16px_-8px_rgba(30,25,15,0.5)]"
            : "shadow-[8px_22px_36px_-18px_rgba(30,25,15,0.55)] dark:shadow-[8px_22px_36px_-18px_rgba(0,0,0,0.85)]"
        )}
        style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
      >
        <Cover book={book} />

        {/* page block peeking out of the fore-edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-[1.5%] left-full w-[2.6%] rounded-r-[2px] bg-[linear-gradient(90deg,#cfc8b8,#f1ece0_55%,#d8d1c1)] dark:bg-[linear-gradient(90deg,#3a3444,#6b6478_55%,#3a3444)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[2%] bottom-[-1.5%] h-[2%] rounded-b-[2px] bg-black/15 blur-[1px]"
        />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- featured card */

function FeaturedCard({
  pick,
  index,
  onPrev,
  onNext,
  onSelect,
}: {
  pick: FeaturedPick;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white/70 p-3 shadow-[0_22px_48px_-32px_rgba(28,24,14,0.65)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06]">
      <div
        key={pick.slug}
        className="animate-[hero-swap_.55s_ease-out_both]"
        aria-live="polite"
      >
        <div className="flex gap-3">
          <div className="w-[56px] shrink-0">
            <TiltedBook book={pick.book} tilt={-4} compact />
          </div>

          <div className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-[8px] font-bold tracking-[0.2em] text-[#183d32] uppercase dark:text-[#C4B5FD]">
              <span className="hero-pulse size-1.5 rounded-full bg-[#183d32] dark:bg-[#C4B5FD]" />
              Featured pick
            </span>

            <h3 className="mt-1 truncate text-sm leading-tight font-bold tracking-tight text-[#191713] dark:text-white">
              {pick.book.title}
            </h3>
            <p className="text-[10.5px] font-medium text-[#6A6458] dark:text-white/55">
              by {pick.book.author}
            </p>
            <p className="mt-1.5 min-h-[3.75rem] text-[10.5px] leading-[1.5] text-[#5C574C] dark:text-white/60">
              {pick.blurb}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {pick.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/[0.07] bg-white/60 px-2 py-[3px] text-[9px] font-semibold text-[#5C574C] dark:border-white/10 dark:bg-white/[0.06] dark:text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-black/[0.07] pt-2.5 dark:border-white/10">
        <Link
          href="/allbooks"
          className="group/link inline-flex items-center gap-1 text-[10.5px] font-bold tracking-[0.12em] text-[#191713] uppercase dark:text-white"
        >
          Read more
          <ArrowRight
            size={12}
            className="transition-transform duration-300 group-hover/link:translate-x-1"
          />
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {picks.map((item, i) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Show ${item.book.title}`}
                aria-current={i === index}
                className="flex size-6 items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    i === index
                      ? "w-4 bg-[#183d32] dark:bg-[#C4B5FD]"
                      : "w-1.5 bg-black/20 hover:bg-black/40 dark:bg-white/25 dark:hover:bg-white/50"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous featured book"
              className="flex size-6 items-center justify-center rounded-full border border-black/10 text-[#4A463D] transition-colors hover:bg-[#191713] hover:text-white dark:border-white/15 dark:text-white/70 dark:hover:bg-white dark:hover:text-[#19152B]"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next featured book"
              className="flex size-6 items-center justify-center rounded-full border border-black/10 text-[#4A463D] transition-colors hover:bg-[#191713] hover:text-white dark:border-white/15 dark:text-white/70 dark:hover:bg-white dark:hover:text-[#19152B]"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- banner */

export default function BannerCarousel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [pick, setPick] = useState(0);
  const [paused, setPaused] = useState(false);

  /* auto-advance the featured pick */
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(
      () => setPick((current) => (current + 1) % picks.length),
      6500
    );
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  /* pointer parallax — writes CSS vars straight to the stage */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const { clientX, clientY } = event;

    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = stage.getBoundingClientRect();
      stage.style.setProperty(
        "--mx",
        ((clientX - rect.left) / rect.width - 0.5).toFixed(3)
      );
      stage.style.setProperty(
        "--my",
        ((clientY - rect.top) / rect.height - 0.5).toFixed(3)
      );
    });
  };

  const resetParallax = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--mx", "0");
    stage.style.setProperty("--my", "0");
  };

  const goTo = (step: number) =>
    setPick((current) => (current + step + picks.length) % picks.length);

  return (
    <section aria-label="Featured library" className="w-full">
      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetParallax}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="@container relative isolate min-h-[36rem] overflow-hidden rounded-[1.75rem] bg-[#EDEAE1] ring-1 ring-black/[0.06] shadow-[0_40px_100px_-60px_rgba(24,61,50,0.55)] md:rounded-[2.25rem] lg:h-[clamp(31rem,40vw,38rem)] lg:min-h-0 dark:bg-[#171324] dark:ring-white/10"
      >
        {/* backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,#F8F6F0_0%,#EDEAE1_45%,#E5E1D5_100%)] dark:bg-[radial-gradient(120%_120%_at_50%_-10%,#221B35_0%,#181327_55%,#130F1F_100%)]"
        />
        <div
          aria-hidden
          className="hero-glow pointer-events-none absolute top-[10%] left-[-9%] h-[70%] w-[46%] rounded-full bg-[radial-gradient(circle,rgba(34,66,47,0.2),transparent_68%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(143,165,140,0.18),transparent_68%)]"
          style={{ "--dur": "19s" } as React.CSSProperties}
        />
        <div
          aria-hidden
          className="hero-glow pointer-events-none absolute top-[2%] right-[-6%] h-[64%] w-[40%] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.16),transparent_68%)] blur-2xl"
          style={
            {
              "--dur": "24s",
              "--delay": "-7s",
            } as React.CSSProperties
          }
        />

        {/* copy */}
        <div className="relative z-20 mx-auto flex w-full max-w-2xl flex-col items-center px-5 pt-10 pb-4 text-center lg:h-full lg:justify-center lg:px-6 lg:pt-0 lg:pb-0">
          <span
            className="hero-rise inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/55 px-3 py-1.5 text-[9.5px] font-bold tracking-[0.22em] text-[#4D483D] uppercase backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white/65"
            style={{ animationDelay: "60ms" }}
          >
            <span className="hero-pulse size-1.5 rounded-full bg-[#22422F] dark:bg-[#8FA58C]" />
            A quiet place for readers
          </span>

          <h1
            className="hero-rise mt-5 text-[clamp(2.4rem,5.2cqw,4.1rem)] leading-[0.98] font-bold tracking-[-0.045em] text-balance text-[#1B1913] dark:text-[#F4F0E6]"
            style={{ animationDelay: "140ms" }}
          >
            Reading Library
          </h1>

          <p
            className="hero-rise mt-4 max-w-[27rem] text-[clamp(0.85rem,1.2cqw,1rem)] leading-relaxed text-[#5B564A] dark:text-[#BDB6C9]"
            style={{ animationDelay: "220ms" }}
          >
            A quiet library of books on design, perception, and form. Curated
            for those who prefer depth over noise.
          </p>

          <div
            className="hero-rise mt-7 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/allbooks"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#1B1913] px-6 text-[12.5px] font-semibold text-[#F9F6EE] shadow-[0_16px_30px_-18px_rgba(20,18,12,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2C2820] dark:bg-[#F4F0E6] dark:text-[#19152B] dark:hover:bg-white"
            >
              Browse the library
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/my-borrows"
              className="inline-flex h-11 items-center rounded-full border border-black/[0.09] bg-white/45 px-5 text-[12.5px] font-semibold text-[#4A4539] backdrop-blur-sm transition-colors duration-300 hover:bg-white/80 hover:text-[#1B1913] dark:border-white/10 dark:bg-white/[0.05] dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
            >
              My borrows
            </Link>
          </div>

          {/* small book row on phones/tablets */}
          <div
            className="hero-rise mt-9 flex items-end justify-center gap-4 sm:gap-6 lg:hidden"
            style={{ animationDelay: "380ms" }}
          >
            {[
              { book: floatingBooks[0], width: "w-[68px]", tilt: -5, dur: 9 },
              { book: floatingBooks[3], width: "w-[76px]", tilt: 6, dur: 12 },
              { book: floatingBooks[4], width: "w-[64px]", tilt: -3, dur: 10.5 },
            ].map(({ book, width, tilt, dur }, i) => (
              <div
                key={book.title}
                className={cn("hero-float", width)}
                style={
                  {
                    "--dur": `${dur}s`,
                    "--delay": `${i * -1.7}s`,
                  } as React.CSSProperties
                }
              >
                <TiltedBook book={book} tilt={tilt} compact />
              </div>
            ))}
          </div>
        </div>

        {/* floating books — desktop composition */}
        <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
          {floatingBooks.map((book, index) => (
            <div
              key={book.title}
              className={cn(
                "hero-appear pointer-events-auto absolute",
                book.position,
                book.width,
                book.hide
              )}
              style={{ animationDelay: `${180 + index * 90}ms` }}
            >
              <div
                className="hero-parallax"
                style={
                  { "--depth": book.depth ?? 24 } as React.CSSProperties
                }
              >
                <div
                  className="hero-float"
                  style={
                    {
                      "--dur": `${book.duration}s`,
                      "--delay": `${book.delay ?? 0}s`,
                    } as React.CSSProperties
                  }
                >
                  <TiltedBook book={book} tilt={book.tilt} className="w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* featured pick */}
        <div
          className="relative z-30 mx-auto mt-8 w-full max-w-[340px] px-5 pb-8 lg:absolute lg:top-[10%] lg:left-[4%] lg:mt-0 lg:w-[292px] lg:px-0 lg:pb-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <FeaturedCard
            pick={picks[pick]}
            index={pick}
            onPrev={() => goTo(-1)}
            onNext={() => goTo(1)}
            onSelect={setPick}
          />
        </div>
      </div>
    </section>
  );
}
