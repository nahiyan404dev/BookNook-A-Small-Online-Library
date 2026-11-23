"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Camera,
  Check,
  CheckCircle2,
  Flame,
  Gamepad2,
  Heart,
  Library,
  Loader2,
  Lock,
  LockKeyhole,
  LogIn,
  Puzzle,
  Sparkles,
  Trash2,
  Trophy,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { createMyBooksStore } from "@/lib/my-books";
import {
  buildPlayerStats,
  createGameStore,
  dateKey,
  getDailyPuzzle,
  type GameResult,
  type PlayerBadgeId,
  type PlayerStats,
} from "@/lib/profile-game";
import { createReadingStore } from "@/lib/reading";
import { createWishlistStore } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

const MAX_AVATAR_BYTES = 8 * 1024 * 1024;
const AVATAR_SIZE = 320;

const BADGE_ICONS: Record<PlayerBadgeId, LucideIcon> = {
  "first-book": BookOpen,
  "shelf-builder": Library,
  finisher: CheckCircle2,
  marathon: Trophy,
  curator: Heart,
  "riddle-solver": Puzzle,
  "on-a-roll": Flame,
  "shelf-explorer": Sparkles,
};

function formatShortDate(key: string): string {
  const date = new Date(`${key}T00:00:00`);

  if (Number.isNaN(date.getTime())) return key;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function memberSince(value: Date | string | undefined): string {
  if (!value) return "BookNook member";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "BookNook member";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That image couldn't be read."));
    image.src = src;
  });
}

/** Crops the chosen image to a square and shrinks it so it fits in the session. */
async function toAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error("That image is larger than 8 MB. Try a smaller one.");
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const side = Math.min(image.naturalWidth, image.naturalHeight);

    if (!side) {
      throw new Error("That image couldn't be read.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser couldn't prepare that image.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    context.drawImage(
      image,
      (image.naturalWidth - side) / 2,
      (image.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      AVATAR_SIZE,
      AVATAR_SIZE
    );

    return canvas.toDataURL("image/jpeg", 0.86);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function PageHeading({ stats }: { stats: PlayerStats | null }) {
  return (
    <div className="space-y-3">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#5426B8] dark:text-white/60 dark:hover:text-[#C4B5FD]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to home
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
            <UserRound size={24} aria-hidden="true" />
          </span>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#19152B] sm:text-3xl dark:text-white">
              My Profile
            </h1>
            <p className="mt-1 max-w-xl text-sm text-[#6B7280] dark:text-white/55">
              Make this corner yours, then play the daily riddle to grow your
              reader level.
            </p>
          </div>
        </div>

        {stats ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#EAE7F2] bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#5426B8] uppercase shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD]">
            <Sparkles size={12} aria-hidden="true" />
            Level {stats.level} · {stats.title}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="overflow-hidden rounded-3xl border border-[#EAE7F2] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]"
    >
      <span className="sr-only">Loading your profile…</span>
      <div className="h-28 animate-pulse bg-[#EDE9FE] dark:bg-[#8B5CF6]/10" />
      <div className="space-y-5 p-6">
        <div className="-mt-16 flex items-end gap-4">
          <div className="size-24 animate-pulse rounded-full bg-[#EAE7F2] ring-4 ring-white dark:bg-white/10 dark:ring-[#1F1A33]" />
          <div className="mb-2 space-y-2">
            <div className="h-4 w-36 animate-pulse rounded-full bg-[#EAE7F2] dark:bg-white/10" />
            <div className="h-3 w-48 animate-pulse rounded-full bg-[#F1EEF7] dark:bg-white/5" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-11 animate-pulse rounded-xl bg-[#F5F3FA] dark:bg-white/5" />
          <div className="h-11 animate-pulse rounded-xl bg-[#F5F3FA] dark:bg-white/5" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-full bg-[#EAE7F2] dark:bg-white/10" />
      </div>
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[#EAE7F2] bg-white px-6 py-16 text-center shadow-sm dark:border-white/10 dark:bg-[#1F1A33]">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
        <LockKeyhole size={30} aria-hidden="true" />
      </span>

      <h2 className="mt-5 text-xl font-bold text-[#19152B] dark:text-white">
        Your nook is waiting
      </h2>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[#6B7280] dark:text-white/55">
        Sign in to change your name and photo, keep a daily riddle streak, and
        unlock badges as your shelf grows.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#5426B8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#451D96]"
        >
          <LogIn size={16} aria-hidden="true" />
          Log in
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DFF2] bg-white px-5 py-2.5 text-sm font-semibold text-[#5426B8] transition-colors hover:border-[#5426B8] hover:bg-[#F1EAFF] dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD] dark:hover:border-[#8B5CF6]/50 dark:hover:bg-[#8B5CF6]/15"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  createdAt?: Date | string;
};

function ProfileCard({
  user,
  level,
  onSaved,
}: {
  user: ProfileUser;
  level: number;
  onSaved: () => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user.name ?? "");
  const [imageDraft, setImageDraft] = useState(user.image ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);

  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const isDirty =
    name.trim() !== (user.name ?? "") || imageDraft !== (user.image ?? "");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setProcessingImage(true);

    try {
      const dataUrl = await toAvatarDataUrl(file);
      setImageDraft(dataUrl);
      toast.success("Photo ready", {
        description: "Save your changes to keep it.",
      });
    } catch (uploadError) {
      toast.error("Couldn't use that image", {
        description:
          uploadError instanceof Error
            ? uploadError.message
            : "Please try another image.",
      });
    } finally {
      setProcessingImage(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      setError("Your name can't be empty.");
      return;
    }

    if (trimmed.length > 60) {
      setError("Keep your name under 60 characters.");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const { error: updateError } = await authClient.updateUser({
        name: trimmed,
        image: imageDraft || null,
      });

      if (updateError) {
        toast.error("Couldn't save your profile", {
          description: updateError.message,
        });
        return;
      }

      await onSaved();
      toast.success("Profile updated", {
        description: "Your name and photo are looking good.",
      });
    } catch {
      toast.error("Couldn't save your profile", {
        description: "Check your connection and try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      aria-label="Profile details"
      className="overflow-hidden rounded-3xl border border-[#EAE7F2] bg-white shadow-sm dark:border-white/10 dark:bg-[#1F1A33]"
    >
      <div className="relative h-28 overflow-hidden bg-gradient-to-r from-[#3B168F] via-[#5426B8] to-[#8B5CF6]">
        <span className="absolute -top-10 -right-6 size-32 rounded-full border border-white/15" />
        <span className="absolute top-8 right-16 size-16 rounded-full bg-white/10" />
        <span className="absolute -bottom-12 left-1/3 size-28 rounded-full bg-white/5" />
        <span className="absolute top-5 left-6 text-[10px] font-semibold tracking-[3px] text-white/60 uppercase">
          Reader of the nook
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              <Avatar className="size-24 shadow-xl ring-4 ring-white dark:ring-[#1F1A33]">
                {imageDraft ? (
                  <AvatarImage
                    key={imageDraft.slice(0, 64)}
                    src={imageDraft}
                    alt={`${name || "Your"} profile picture`}
                    className="size-24"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <AvatarFallback className="bg-[#F1EAFF] text-2xl font-extrabold text-[#5426B8] dark:bg-[#2B2350] dark:text-[#C4B5FD]">
                  {initial}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={processingImage}
                aria-label="Upload a profile photo"
                className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-[#5426B8] text-white shadow-md ring-2 ring-white transition-colors hover:bg-[#451D96] disabled:opacity-60 dark:ring-[#1F1A33]"
              >
                {processingImage ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
            </div>

            <div className="mb-1 min-w-0">
              <h2 className="truncate text-lg font-extrabold tracking-tight text-[#19152B] sm:text-xl dark:text-white">
                {name.trim() || "A mystery reader"}
              </h2>
              <p className="truncate text-sm text-[#6B7280] dark:text-white/55">
                {user.email}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#8B87A0] dark:text-white/40">
                <Sparkles size={11} aria-hidden="true" />
                {memberSince(user.createdAt)} · Level {level}
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F1EAFF] px-3 py-1.5 text-[11px] font-semibold text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
            <Trophy size={12} aria-hidden="true" />
            {level > 1 ? "Keep climbing" : "Just getting started"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              onChange={handleFile}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={processingImage}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DFF2] bg-white px-3.5 py-2 text-xs font-semibold text-[#5426B8] transition-colors hover:border-[#5426B8] hover:bg-[#F1EAFF] disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-[#C4B5FD] dark:hover:border-[#8B5CF6]/50 dark:hover:bg-[#8B5CF6]/15"
            >
              {processingImage ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <Camera size={14} aria-hidden="true" />
              )}
              {processingImage ? "Preparing…" : "Upload photo"}
            </button>

            {imageDraft ? (
              <button
                type="button"
                onClick={() => setImageDraft("")}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DFF2] px-3.5 py-2 text-xs font-semibold text-[#6B7280] transition-colors hover:border-[#F3D6D6] hover:bg-[#FDF1F1] hover:text-[#B42318] dark:border-white/10 dark:text-white/55 dark:hover:border-red-400/30 dark:hover:bg-red-400/10 dark:hover:text-red-300"
              >
                <Trash2 size={14} aria-hidden="true" />
                Remove photo
              </button>
            ) : null}

            <span className="text-[11px] text-[#8B87A0] dark:text-white/40">
              Square crop · up to 8 MB
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase dark:text-white/50">
                <UserRound size={13} aria-hidden="true" />
                Display name
              </span>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={name}
                maxLength={60}
                autoComplete="name"
                aria-invalid={Boolean(error)}
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) setError(null);
                }}
                placeholder="What should we call you?"
                className="h-11 w-full rounded-xl border border-[#E4DFF2] bg-white px-3.5 text-sm font-medium text-[#19152B] outline-none transition-all placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#5426B8] focus:ring-2 focus:ring-[#5426B8]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-[#8B5CF6]"
              />
              {error ? (
                <span className="mt-1.5 block text-xs font-medium text-[#B42318] dark:text-red-300">
                  {error}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase dark:text-white/50">
                <Lock size={13} aria-hidden="true" />
                Email
              </span>
              <input
                type="email"
                value={user.email}
                readOnly
                disabled
                aria-describedby="profile-email-hint"
                className="h-11 w-full cursor-not-allowed rounded-xl border border-[#EAE7F2] bg-[#F8F7FC] px-3.5 text-sm text-[#6B7280] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50"
              />
              <span
                id="profile-email-hint"
                className="mt-1.5 block text-[11px] text-[#8B87A0] dark:text-white/40"
              >
                Your email is tied to your login.
              </span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || processingImage || !isDirty}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#5426B8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#451D96] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              ) : (
                <Check size={15} aria-hidden="true" />
              )}
              {saving ? "Saving…" : "Save changes"}
            </button>

            <span className="text-[11px] text-[#8B87A0] dark:text-white/40">
              {isDirty
                ? "You have unsaved changes."
                : "Your profile is up to date."}
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}

function LevelCard({
  stats,
  results,
}: {
  stats: PlayerStats;
  results: GameResult[];
}) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  return (
    <section
      aria-label="Reader level"
      className="flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#3B168F] via-[#5426B8] to-[#7C3AED] p-5 text-white shadow-lg shadow-[#5426B8]/20 dark:shadow-black/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold tracking-[2.5px] text-white/60 uppercase">
            Reader level
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight">
            {stats.title}
          </h2>
        </div>

        {stats.streak > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/15 px-2.5 py-1 text-[11px] font-bold text-amber-200 ring-1 ring-amber-300/30">
            <Flame size={12} aria-hidden="true" />
            {stats.streak} day{stats.streak === 1 ? "" : "s"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70">
            <Flame size={12} aria-hidden="true" />
            No streak yet
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="relative size-36">
          <svg
            viewBox="0 0 132 132"
            className="size-36 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="66"
              cy="66"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="10"
            />
            <circle
              cx="66"
              cy="66"
              r={radius}
              fill="none"
              stroke="#FDE68A"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - (stats.levelProgress / 100) * circumference
              }
              className="transition-all duration-700"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-semibold tracking-[2px] text-white/55 uppercase">
              Level
            </span>
            <span className="text-4xl font-extrabold tracking-tight">
              {stats.level}
            </span>
            <span className="text-[10px] font-medium text-white/55">
              {stats.xp} XP
            </span>
          </div>
        </div>
      </div>

      <div className="mt-1 text-center">
        <p className="text-[11px] font-medium text-white/60">
          {stats.xpToNextLevel} XP until level {stats.level + 1}
        </p>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.levelProgress}
          aria-label={`Level ${stats.level} progress`}
          className="mx-auto mt-2 h-1.5 w-full max-w-56 overflow-hidden rounded-full bg-white/15"
        >
          <div
            className="h-full rounded-full bg-[#FDE68A] transition-all duration-700"
            style={{ width: `${stats.levelProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Shelved", value: stats.books, icon: Bookmark },
          { label: "Finished", value: stats.finished, icon: CheckCircle2 },
          { label: "Riddles", value: stats.solved, icon: Puzzle },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl bg-white/10 px-2 py-2.5 text-center ring-1 ring-white/10"
          >
            <Icon size={14} className="mx-auto text-white/60" aria-hidden="true" />
            <p className="mt-1 text-lg leading-none font-extrabold tabular-nums">
              {value}
            </p>
            <p className="mt-1 text-[9.5px] font-semibold tracking-wider text-white/55 uppercase">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-white/15 pt-4">
        <p className="text-[10px] font-semibold tracking-[2px] text-white/50 uppercase">
          Recent plays
        </p>

        {results.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {results.slice(0, 3).map((result) => (
              <li
                key={result.date}
                className="flex items-center justify-between gap-2 text-[11px]"
              >
                <span className="flex items-center gap-1.5 text-white/65">
                  {result.solved ? (
                    <CheckCircle2
                      size={12}
                      className="text-emerald-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <X size={12} className="text-red-300" aria-hidden="true" />
                  )}
                  {formatShortDate(result.date)}
                </span>
                <span className="font-semibold text-white/80 tabular-nums">
                  +{result.earnedXp} XP
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[11px] leading-relaxed text-white/50">
            No riddles played yet — today&apos;s is waiting for you below.
          </p>
        )}
      </div>
    </section>
  );
}

function BadgesCard({ stats }: { stats: PlayerStats }) {
  const unlocked = stats.badges.filter((badge) => badge.unlocked).length;

  return (
    <section
      aria-label="Badge shelf"
      className="rounded-3xl border border-[#EAE7F2] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FEF4E2] text-[#9A5B00] dark:bg-amber-400/10 dark:text-amber-300">
            <Trophy size={18} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#19152B] dark:text-white">
              Badge shelf
            </h2>
            <p className="mt-0.5 text-[11px] text-[#6B7280] dark:text-white/50">
              Little milestones on your reading journey.
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-[#F1EAFF] px-2.5 py-1 text-[10.5px] font-bold text-[#5426B8] tabular-nums dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
          {unlocked}/{stats.badges.length}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {stats.badges.map((badge) => {
          const Icon = BADGE_ICONS[badge.id];

          return (
            <div
              key={badge.id}
              title={badge.description}
              className={cn(
                "relative rounded-xl border p-2.5 transition-colors",
                badge.unlocked
                  ? "border-[#E4DFF2] bg-[#FCFBFF] dark:border-[#8B5CF6]/30 dark:bg-[#8B5CF6]/10"
                  : "border-dashed border-[#EAE7F2] bg-[#FAF9FD] opacity-70 dark:border-white/10 dark:bg-white/[0.02]"
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  badge.unlocked
                    ? "bg-gradient-to-br from-[#5426B8] to-[#8B5CF6] text-white shadow-sm"
                    : "bg-[#F1EEF7] text-[#A29DB8] dark:bg-white/5 dark:text-white/35"
                )}
              >
                <Icon size={15} aria-hidden="true" />
              </span>

              <p
                className={cn(
                  "mt-2 text-[11.5px] font-bold leading-tight",
                  badge.unlocked
                    ? "text-[#19152B] dark:text-white"
                    : "text-[#6B7280] dark:text-white/45"
                )}
              >
                {badge.label}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[#8B87A0] dark:text-white/38">
                {badge.description}
              </p>

              {!badge.unlocked ? (
                <span className="absolute top-2 right-2 text-[#B6B0C8] dark:text-white/30">
                  <Lock size={11} aria-label="Locked" />
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DailyRiddle({
  results,
  recordResult,
  streak,
}: {
  results: GameResult[] | null;
  recordResult: (result: GameResult) => GameResult[];
  streak: number;
}) {
  const [wrong, setWrong] = useState<string[]>([]);
  const puzzle = getDailyPuzzle();
  const today = dateKey();

  if (!results) {
    return (
      <section
        aria-label="Daily riddle"
        className="rounded-3xl border border-[#EAE7F2] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#1F1A33]"
      >
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="space-y-4"
        >
          <span className="sr-only">Loading today&apos;s riddle…</span>
          <div className="h-5 w-40 animate-pulse rounded-full bg-[#EAE7F2] dark:bg-white/10" />
          <div className="h-28 animate-pulse rounded-2xl bg-[#F5F3FA] dark:bg-white/5" />
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-11 animate-pulse rounded-xl bg-[#F5F3FA] dark:bg-white/5"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const todayResult = results.find((result) => result.date === today) ?? null;
  const revealed = Boolean(todayResult);
  const attemptsLeft = Math.max(0, 3 - wrong.length);

  const play = (option: string) => {
    if (revealed || wrong.includes(option)) return;

    if (option === puzzle.answer) {
      const earnedXp = wrong.length === 0 ? 60 : wrong.length === 1 ? 40 : 25;

      recordResult({
        date: today,
        puzzleId: puzzle.id,
        solved: true,
        attempts: wrong.length + 1,
        earnedXp,
      });

      toast.success("Riddle solved!", {
        description: `+${earnedXp} XP added to your reader level.`,
      });
      return;
    }

    const nextWrong = [...wrong, option];
    setWrong(nextWrong);

    if (nextWrong.length >= 3) {
      recordResult({
        date: today,
        puzzleId: puzzle.id,
        solved: false,
        attempts: 3,
        earnedXp: 10,
      });

      toast("Riddle over for today", {
        description: `The answer was “${puzzle.answer}”. +10 XP for trying.`,
      });
    }
  };

  const feedback = todayResult
    ? null
    : wrong.length > 0
      ? `Not quite — ${attemptsLeft} ${attemptsLeft === 1 ? "try" : "tries"} left. Hint: ${puzzle.hint}`
      : "Pick the book you think is hiding behind the emojis.";

  return (
    <section
      aria-label="Daily riddle"
      className="rounded-3xl border border-[#EAE7F2] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1F1A33]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EAFF] text-[#5426B8] dark:bg-[#8B5CF6]/15 dark:text-[#C4B5FD]">
            <Gamepad2 size={21} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#19152B] dark:text-white">
              Daily Riddle
            </h2>
            <p className="mt-0.5 text-[11px] text-[#6B7280] dark:text-white/50">
              A tiny bookish game. One riddle, every day.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streak > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF4E2] px-2.5 py-1 text-[11px] font-bold text-[#9A5B00] dark:bg-amber-400/10 dark:text-amber-300">
              <Flame size={12} aria-hidden="true" />
              {streak} day streak
            </span>
          ) : null}
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide uppercase",
              revealed
                ? todayResult?.solved
                  ? "bg-[#E7F6EE] text-[#1F7A4D] dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "bg-[#FDF1F1] text-[#B42318] dark:bg-red-400/10 dark:text-red-300"
                : "bg-[#F5F3FA] text-[#6B7280] dark:bg-white/5 dark:text-white/50"
            )}
          >
            {revealed ? "Played" : "Today"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FA] to-[#FEF4E2] p-5 text-center dark:from-[#2B2350] dark:via-[#241E40] dark:to-[#2B2350]">
          <span className="absolute -top-6 -right-4 size-20 rounded-full bg-white/40 dark:bg-white/5" />
          <span className="absolute -bottom-8 -left-5 size-24 rounded-full bg-white/30 dark:bg-white/5" />

          <p className="relative text-[10px] font-semibold tracking-[2.5px] text-[#8B5CF6] uppercase dark:text-[#C4B5FD]">
            Emoji clue
          </p>
          <div
            role="img"
            aria-label="Emoji clue for today's book riddle"
            className="relative mt-3 text-[40px] leading-none tracking-wide sm:text-5xl"
          >
            {puzzle.emojis}
          </div>
          <p className="relative mt-4 text-sm font-semibold leading-snug text-[#3F3D56] dark:text-white/80">
            {puzzle.prompt}
          </p>

          {!revealed && wrong.length > 0 ? (
            <p className="relative mt-2 text-[11px] font-medium text-[#8B5CF6] dark:text-[#C4B5FD]">
              {puzzle.hint}
            </p>
          ) : null}
        </div>

        <div>
          {revealed ? (
            <div
              role="status"
              className={cn(
                "mb-3 rounded-xl border p-3",
                todayResult?.solved
                  ? "border-[#BFE8D2] bg-[#F0FAF5] dark:border-emerald-400/25 dark:bg-emerald-400/10"
                  : "border-[#F7E2BF] bg-[#FFFAF0] dark:border-amber-400/25 dark:bg-amber-400/10"
              )}
            >
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#19152B] dark:text-white">
                {todayResult?.solved ? (
                  <Trophy
                    size={14}
                    className="text-[#1F7A4D] dark:text-emerald-300"
                    aria-hidden="true"
                  />
                ) : (
                  <Sparkles
                    size={14}
                    className="text-[#9A5B00] dark:text-amber-300"
                    aria-hidden="true"
                  />
                )}
                {todayResult?.solved
                  ? `Solved in ${todayResult.attempts} ${todayResult.attempts === 1 ? "try" : "tries"}!`
                  : "The answer was…"}
              </p>
              <p className="mt-1 text-sm font-extrabold text-[#5426B8] dark:text-[#C4B5FD]">
                {puzzle.answer}
              </p>
              <p className="mt-1 text-[11px] text-[#6B7280] dark:text-white/50">
                +{todayResult?.earnedXp ?? 0} XP earned · a fresh riddle unlocks
                at midnight.
              </p>
            </div>
          ) : (
            <p
              aria-live="polite"
              className="mb-2 min-h-5 text-[11px] font-medium text-[#6B7280] dark:text-white/50"
            >
              {feedback}
            </p>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            {puzzle.options.map((option, index) => {
              const isCorrect = option === puzzle.answer;
              const isWrong = wrong.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => play(option)}
                  disabled={revealed || isWrong}
                  aria-label={`Answer ${String.fromCharCode(65 + index)}: ${option}`}
                  className={cn(
                    "flex min-h-11 items-start gap-2 rounded-xl border px-3 py-2 text-left text-[11.5px] font-semibold leading-snug transition-all",
                    revealed && isCorrect
                      ? "border-[#1F7A4D] bg-[#F0FAF5] text-[#1F7A4D] dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300"
                      : revealed
                        ? "border-[#EAE7F2] bg-[#FAF9FD] text-[#8B87A0] opacity-60 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/35"
                        : isWrong
                          ? "border-[#F3D6D6] bg-[#FDF1F1] text-[#B42318] line-through dark:border-red-400/25 dark:bg-red-400/10 dark:text-red-300"
                          : "border-[#E4DFF2] bg-white text-[#3F3D56] hover:-translate-y-0.5 hover:border-[#5426B8]/40 hover:bg-[#F8F7FC] hover:text-[#5426B8] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:border-[#8B5CF6]/40 dark:hover:bg-[#8B5CF6]/10 dark:hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "mt-px flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                      revealed && isCorrect
                        ? "bg-[#1F7A4D] text-white dark:bg-emerald-400 dark:text-[#0B2E1E]"
                        : isWrong
                          ? "bg-[#F3D6D6] text-[#B42318] dark:bg-red-400/20 dark:text-red-300"
                          : "bg-[#F1EEF7] text-[#6B7280] dark:bg-white/10 dark:text-white/55"
                    )}
                  >
                    {revealed && isCorrect ? (
                      <Check size={12} aria-hidden="true" />
                    ) : isWrong ? (
                      <X size={12} aria-hidden="true" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {!revealed ? (
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-medium text-[#8B87A0] dark:text-white/40">
                {attemptsLeft} of 3 {attemptsLeft === 1 ? "try" : "tries"} left
              </span>
              <div
                className="flex items-center gap-1"
                role="img"
                aria-label={`${attemptsLeft} attempts remaining`}
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className={cn(
                      "size-1.5 rounded-full",
                      dot < attemptsLeft
                        ? "bg-[#8B5CF6]"
                        : "bg-[#E4DFF2] dark:bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function ProfileView() {
  const { data: session, isPending, refetch } = authClient.useSession();

  const [booksStore] = useState(() => createMyBooksStore());
  const [readingStore] = useState(() => createReadingStore());
  const [wishlistStore] = useState(() => createWishlistStore());
  const [gameStore] = useState(() => createGameStore());

  const books = useSyncExternalStore(
    booksStore.subscribe,
    booksStore.getSnapshot,
    booksStore.getServerSnapshot
  );
  const reading = useSyncExternalStore(
    readingStore.subscribe,
    readingStore.getSnapshot,
    readingStore.getServerSnapshot
  );
  const wishlist = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot
  );
  const results = useSyncExternalStore(
    gameStore.subscribe,
    gameStore.getSnapshot,
    gameStore.getServerSnapshot
  );

  const hydrated =
    books !== null &&
    reading !== null &&
    wishlist !== null &&
    results !== null;

  const stats = hydrated
    ? buildPlayerStats({
        books: books.length,
        wishlist: wishlist.length,
        reading,
        results,
      })
    : null;

  return (
    <div className="min-h-screen bg-[#F8F7FC] px-4 py-6 transition-colors sm:px-6 sm:py-8 lg:px-8 dark:bg-[#141126]">
      <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
        <PageHeading stats={stats} />

        {isPending ? (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ProfileCardSkeleton />
            </div>
            <div className="h-80 animate-pulse rounded-3xl bg-[#EDE9FE] dark:bg-[#8B5CF6]/10" />
          </div>
        ) : !session?.user ? (
          <SignInPrompt />
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProfileCard
                  user={{
                    name: session.user.name ?? "",
                    email: session.user.email ?? "",
                    image: session.user.image,
                    createdAt: session.user.createdAt,
                  }}
                  level={stats?.level ?? 1}
                  onSaved={refetch}
                />
              </div>

              <div>
                {stats ? (
                  <LevelCard stats={stats} results={results ?? []} />
                ) : (
                  <div
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    className="h-full min-h-80 animate-pulse rounded-3xl bg-[#EDE9FE] dark:bg-[#8B5CF6]/10"
                  >
                    <span className="sr-only">Loading your reading level…</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DailyRiddle
                  results={results}
                  recordResult={gameStore.recordResult}
                  streak={stats?.streak ?? 0}
                />
              </div>

              <div>
                {stats ? (
                  <BadgesCard stats={stats} />
                ) : (
                  <div
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    className="h-full min-h-72 animate-pulse rounded-3xl bg-[#EDE9FE] dark:bg-[#8B5CF6]/10"
                  >
                    <span className="sr-only">Loading your badges…</span>
                  </div>
                )}
              </div>
            </div>

            <p className="pb-2 text-center text-[11px] leading-relaxed text-[#8B87A0] dark:text-white/40">
              Levels, badges and riddle history are kept in this browser for
              fun — your name and photo are saved to your account.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
