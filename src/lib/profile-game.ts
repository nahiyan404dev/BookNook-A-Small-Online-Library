import type { ReadingProgress } from "@/lib/reading";

/**
 * The Reading Arcade — a tiny daily book-riddle game for the profile page.
 * Results live in this browser (like the rest of the demo data) and feed the
 * player's XP, level, streak, and badge shelf.
 */

export const GAME_STORAGE_KEY = "booknook.arcade.v1";

export type RiddlePuzzle = {
  id: string;
  /** Emoji clue shown above the prompt. */
  emojis: string;
  prompt: string;
  answer: string;
  options: string[];
  hint: string;
};

const PUZZLES: RiddlePuzzle[] = [
  {
    id: "boy-who-lived",
    emojis: "🧙‍♂️⚡🏰🪄",
    prompt: "Which book is hiding behind these emojis?",
    answer: "Harry Potter and the Philosopher's Stone",
    options: [
      "Harry Potter and the Philosopher's Stone",
      "The Hobbit",
      "Percy Jackson & the Olympians",
      "Eragon",
    ],
    hint: "The boy who lived.",
  },
  {
    id: "one-ring",
    emojis: "💍🌋🧝‍♂️🗡️",
    prompt: "One clue to rule them all…",
    answer: "The Lord of the Rings",
    options: [
      "The Lord of the Rings",
      "The Hobbit",
      "The Chronicles of Narnia",
      "Eragon",
    ],
    hint: "One ring to rule them all.",
  },
  {
    id: "animal-farm",
    emojis: "🐷🐮🐔🚜",
    prompt: "Which farmyard classic is this?",
    answer: "Animal Farm",
    options: [
      "Animal Farm",
      "Charlotte's Web",
      "The Wind in the Willows",
      "Watership Down",
    ],
    hint: "All animals are equal, but some are more equal than others.",
  },
  {
    id: "rabbit-hole",
    emojis: "🐇🕳️⏱️👑",
    prompt: "Follow the rabbit…",
    answer: "Alice's Adventures in Wonderland",
    options: [
      "Alice's Adventures in Wonderland",
      "The Wonderful Wizard of Oz",
      "Peter Pan",
      "Coraline",
    ],
    hint: "Down the rabbit hole.",
  },
  {
    id: "golden-ticket",
    emojis: "🍫🎫🏭👦",
    prompt: "A sweet clue for a sweeter book.",
    answer: "Charlie and the Chocolate Factory",
    options: [
      "Charlie and the Chocolate Factory",
      "James and the Giant Peach",
      "Matilda",
      "The BFG",
    ],
    hint: "Find the golden ticket.",
  },
  {
    id: "star-crossed",
    emojis: "🌹💔🗡️🏰",
    prompt: "A tragedy in five acts.",
    answer: "Romeo and Juliet",
    options: [
      "Romeo and Juliet",
      "Macbeth",
      "Hamlet",
      "A Midsummer Night's Dream",
    ],
    hint: "Star-crossed lovers.",
  },
  {
    id: "white-whale",
    emojis: "🐋⚓🌊🦵",
    prompt: "The sea has a temper.",
    answer: "Moby-Dick",
    options: [
      "Moby-Dick",
      "The Old Man and the Sea",
      "Treasure Island",
      "Twenty Thousand Leagues Under the Seas",
    ],
    hint: "Call me Ishmael.",
  },
  {
    id: "odds-in-your-favor",
    emojis: "🏹🔥🎯👑",
    prompt: "Which dystopia is this?",
    answer: "The Hunger Games",
    options: [
      "The Hunger Games",
      "Divergent",
      "The Maze Runner",
      "The Giver",
    ],
    hint: "May the odds be ever in your favor.",
  },
  {
    id: "there-and-back",
    emojis: "🦶🏠🐉💎",
    prompt: "An unexpected journey.",
    answer: "The Hobbit",
    options: ["The Hobbit", "Eragon", "The Name of the Wind", "Mistborn"],
    hint: "There and back again.",
  },
  {
    id: "potato-power",
    emojis: "🚀🪐🥔🌱",
    prompt: "Science the heck out of it.",
    answer: "The Martian",
    options: ["The Martian", "Interstellar", "Dune", "Project Hail Mary"],
    hint: "One astronaut. One planet. A lot of potatoes.",
  },
  {
    id: "count-dracula",
    emojis: "🧛‍♂️🩸🏚️🦇",
    prompt: "A gothic guest arrives.",
    answer: "Dracula",
    options: [
      "Dracula",
      "Frankenstein",
      "The Picture of Dorian Gray",
      "The Turn of the Screw",
    ],
    hint: "Welcome to Castle Dracula.",
  },
  {
    id: "winter-door",
    emojis: "🦁❄️🚪👑",
    prompt: "Step through the wardrobe.",
    answer: "The Lion, the Witch and the Wardrobe",
    options: [
      "The Lion, the Witch and the Wardrobe",
      "The Golden Compass",
      "A Wrinkle in Time",
      "Harry Potter and the Chamber of Secrets",
    ],
    hint: "Turkish delight and a lamppost.",
  },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/** Local calendar day as `YYYY-MM-DD`. */
export function dateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_IN_MS
  );
}

/**
 * The same riddle is served all day and rotates at local midnight. Options are
 * rotated too, so the answer is not always in the same spot.
 */
export function getDailyPuzzle(date: Date = new Date()): RiddlePuzzle {
  const day = dayNumber(date);
  const puzzle = PUZZLES[((day % PUZZLES.length) + PUZZLES.length) % PUZZLES.length];
  const shift = ((day % puzzle.options.length) + puzzle.options.length) % puzzle.options.length;

  return {
    ...puzzle,
    options: [
      ...puzzle.options.slice(shift),
      ...puzzle.options.slice(0, shift),
    ],
  };
}

export type GameResult = {
  /** Local `YYYY-MM-DD` the riddle was played. */
  date: string;
  puzzleId: string;
  solved: boolean;
  attempts: number;
  earnedXp: number;
};

function isGameResult(value: unknown): value is GameResult {
  if (!value || typeof value !== "object") return false;

  const result = value as Partial<GameResult>;

  return (
    typeof result.date === "string" &&
    typeof result.puzzleId === "string" &&
    typeof result.solved === "boolean" &&
    typeof result.attempts === "number" &&
    Number.isFinite(result.attempts) &&
    typeof result.earnedXp === "number" &&
    Number.isFinite(result.earnedXp)
  );
}

/** Reads saved arcade results. `null` means nothing was saved yet. */
export function readGameResults(): GameResult[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(GAME_STORAGE_KEY);
    if (!raw) return null;

    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isGameResult) : null;
  } catch {
    return null;
  }
}

export function writeGameResults(results: GameResult[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Storage can be unavailable (private mode, quota) — the game still works.
  }
}

export type GameStore = {
  subscribe: (listener: () => void) => () => void;
  /** `null` until the browser store has hydrated (the skeleton state). */
  getSnapshot: () => GameResult[] | null;
  getServerSnapshot: () => GameResult[] | null;
  /** Saves today's result once; later calls for the same day are ignored. */
  recordResult: (result: GameResult) => GameResult[];
};

/** Tiny external store for arcade results, read through `useSyncExternalStore`. */
export function createGameStore(): GameStore {
  let snapshot: GameResult[] | null = null;
  let hydrated = false;
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const hydrate = () => {
    if (hydrated) return;
    hydrated = true;

    snapshot = readGameResults() ?? [];
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    hydrate();

    return () => {
      listeners.delete(listener);
    };
  };

  const current = () => snapshot ?? readGameResults() ?? [];

  const recordResult = (result: GameResult) => {
    const results = current();

    if (results.some((entry) => entry.date === result.date)) {
      return results;
    }

    const next = [result, ...results]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 120);

    hydrated = true;
    snapshot = next;
    writeGameResults(next);
    emit();

    return next;
  };

  return {
    subscribe,
    getSnapshot: () => snapshot,
    getServerSnapshot: () => null,
    recordResult,
  };
}

/** Consecutive days played, counting back from today (or yesterday). */
export function gameStreak(
  results: GameResult[],
  now: Date = new Date()
): number {
  const played = new Set(results.map((result) => result.date));
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!played.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;

  while (played.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

const LEVEL_STEP = 150;

const LEVEL_TITLES = [
  "Nook Newcomer",
  "Page Drifter",
  "Shelf Explorer",
  "Story Seeker",
  "Plot Collector",
  "Chapter Champion",
  "Nook Legend",
];

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1] ?? "Nook Legend";
}

export type PlayerBadgeId =
  | "first-book"
  | "shelf-builder"
  | "finisher"
  | "marathon"
  | "curator"
  | "riddle-solver"
  | "on-a-roll"
  | "shelf-explorer";

export type PlayerBadge = {
  id: PlayerBadgeId;
  label: string;
  description: string;
  unlocked: boolean;
};

export type PlayerStats = {
  books: number;
  finished: number;
  inProgress: number;
  wishlist: number;
  solved: number;
  played: number;
  streak: number;
  activityXp: number;
  arcadeXp: number;
  xp: number;
  level: number;
  title: string;
  /** 0–100 progress toward the next level. */
  levelProgress: number;
  xpToNextLevel: number;
  badges: PlayerBadge[];
};

export type PlayerInput = {
  books: number;
  wishlist: number;
  reading: ReadingProgress[];
  results: GameResult[];
  now?: Date;
};

/**
 * Turns reading activity + arcade results into a player profile. XP is purely
 * for fun and never leaves this browser.
 */
export function buildPlayerStats({
  books,
  wishlist,
  reading,
  results,
  now = new Date(),
}: PlayerInput): PlayerStats {
  const finished = reading.filter((record) => record.completedAt).length;
  const inProgress = reading.filter(
    (record) => !record.completedAt && record.page > 1
  ).length;

  const arcadeXp = results.reduce((total, result) => total + result.earnedXp, 0);
  const activityXp =
    books * 20 + wishlist * 10 + finished * 80 + inProgress * 25;
  const xp = activityXp + arcadeXp;

  const level = Math.floor(xp / LEVEL_STEP) + 1;
  const levelProgress = Math.round(((xp % LEVEL_STEP) / LEVEL_STEP) * 100);

  const solved = results.filter((result) => result.solved).length;
  const streak = gameStreak(results, now);

  const badges: PlayerBadge[] = [
    {
      id: "first-book",
      label: "First Chapter",
      description: "Add your first book to the shelf",
      unlocked: books >= 1,
    },
    {
      id: "shelf-builder",
      label: "Shelf Builder",
      description: "Collect 5 books",
      unlocked: books >= 5,
    },
    {
      id: "finisher",
      label: "The End",
      description: "Finish your first book",
      unlocked: finished >= 1,
    },
    {
      id: "marathon",
      label: "Book Marathon",
      description: "Finish 3 books",
      unlocked: finished >= 3,
    },
    {
      id: "curator",
      label: "Curator",
      description: "Save 3 books to your wishlist",
      unlocked: wishlist >= 3,
    },
    {
      id: "riddle-solver",
      label: "Riddle Solver",
      description: "Solve a daily riddle",
      unlocked: solved >= 1,
    },
    {
      id: "on-a-roll",
      label: "On a Roll",
      description: "Play 3 days in a row",
      unlocked: streak >= 3,
    },
    {
      id: "shelf-explorer",
      label: "Shelf Explorer",
      description: "Reach level 3",
      unlocked: level >= 3,
    },
  ];

  return {
    books,
    finished,
    inProgress,
    wishlist,
    solved,
    played: results.length,
    streak,
    activityXp,
    arcadeXp,
    xp,
    level,
    title: levelTitle(level),
    levelProgress,
    xpToNextLevel: LEVEL_STEP - (xp % LEVEL_STEP),
    badges,
  };
}
