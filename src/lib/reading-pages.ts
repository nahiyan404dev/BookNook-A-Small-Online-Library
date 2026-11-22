import { formatDuration, normalizeCategory, type Book } from "@/lib/books";

export type ReaderPage = {
  kind: "title" | "text" | "end";
  eyebrow?: string;
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
  facts?: { label: string; value: string }[];
  note?: string;
};

type PreviewCopy = {
  heading: string;
  paragraphs: string[];
  themes: string[];
};

/**
 * Catalogue records only carry a blurb, so the reader shows a short,
 * clearly-labelled sample for each shelf. When a book eventually includes a
 * `content` field those real pages take over automatically.
 */
const PREVIEWS: Record<string, PreviewCopy> = {
  "Science Fiction": {
    heading: "The edge of the map",
    paragraphs: [
      "The reading appeared at the edge of the instruments, small enough to be mistaken for noise. It repeated on a rhythm that made no sense: a pause, a pulse, a longer pause, then the same pattern again. By morning three people had checked the equipment. By evening nobody was sure what they were looking at.",
      "What followed was less a discovery than a widening of the map. Every answer created a larger question, and every question asked something of the people holding it. Out where the measurements ran out, the universe offered no explanation. It offered distance, time, and the quiet suggestion that being human might be a smaller thing — or a larger one — than anyone had guessed.",
    ],
    themes: [
      "Discovery and its consequences",
      "Distance, time, and perspective",
      "What it means to be human",
    ],
  },
  Fantasy: {
    heading: "The folded map",
    paragraphs: [
      "The map had been folded so many times that its creases had become roads. The traveller followed one anyway, past the orchard with no gate and the inn that kept its lamps lit for guests who never arrived. Somewhere behind the hills a bell rang once — not an alarm, not a welcome, just a sound that had been waiting to be heard.",
      "By the third night the journey had stopped being about the destination. There were companions now, each carrying a reason they did not fully explain. There were doors that opened only when nobody was watching, and choices that could not be taken back. The old stories had always said the same thing: the way through is rarely the way you planned.",
    ],
    themes: [
      "Courage in ordinary choices",
      "Old stories and hidden doors",
      "Friendship across unfamiliar ground",
    ],
  },
  Fiction: {
    heading: "The last warm afternoon",
    paragraphs: [
      "The last warm afternoon of the year arrived without warning. The town seemed to hold its breath — windows open, bicycles leaning against fences, a radio playing in a kitchen two streets away. Nobody was doing anything important, which was exactly why it mattered.",
      "Years later, that was the afternoon that came back first. Not the arguments, not the departures, but the light on the kitchen table and the sound of someone laughing in another room. Memory works like that, keeping what seems small and returning it, again and again, until it becomes the whole story.",
    ],
    themes: [
      "Memory and belonging",
      "The places that shape us",
      "Small moments that change everything",
    ],
  },
  "Self-Help": {
    heading: "One small decision",
    paragraphs: [
      "The first change was almost too small to notice. One decision, repeated without ceremony, on a morning when nothing felt different. Then another. A week later the habit had a shape; a month later it had begun to change the days around it.",
      "That is the quiet arithmetic of a useful life: not one dramatic leap, but a hundred ordinary choices pointing in the same direction. Purpose rarely arrives fully formed. It is discovered in motion, tested in small experiments, and kept alive by the people and routines that make the next step easier.",
    ],
    themes: [
      "Small habits, lasting change",
      "Purpose over momentum",
      "Attention as a daily practice",
    ],
  },
  Business: {
    heading: "Start with a sentence",
    paragraphs: [
      "Every venture begins as a sentence: a simple claim about how the world could work better. The hard part is not writing the sentence. It is finding out whether it is true — quickly, cheaply, and without becoming too attached to the first version.",
      "The best teams treat their assumptions like experiments. They talk to the people they hope to serve, build the smallest thing that can teach them something, and listen when the answer is no. Growth follows learning. Everything else is decoration.",
    ],
    themes: [
      "Experiments over assumptions",
      "Customers at the centre",
      "Learning faster than you scale",
    ],
  },
  History: {
    heading: "The long view",
    paragraphs: [
      "Long before the written record, people were already telling stories about themselves. They built, traded, argued, and carried ideas across rivers and mountains. The names are gone; the patterns remain.",
      "History is not a list of dates. It is the study of how ordinary lives met extraordinary pressure — how cities rose, how beliefs travelled, how a decision made in one room could change the weather in another country a generation later. To read it closely is to notice that the present is always partly made of the past.",
    ],
    themes: [
      "Continuity and upheaval",
      "How ideas travel",
      "The everyday lives behind big events",
    ],
  },
  Programming: {
    heading: "The first program",
    paragraphs: [
      "The first program did almost nothing, and that was the point. It printed a line, took a number, returned an answer. Running it was enough to prove that the idea in your head could become something the machine would actually do.",
      "Craft grows from there: smaller functions, clearer names, tests that catch you before your users do. The goal is not clever code. It is code someone else can read at midnight, change without fear, and trust to keep working. Every good system is built from small things that are easy to understand.",
    ],
    themes: [
      "Clarity before cleverness",
      "Small steps, tested often",
      "Tools that amplify thought",
    ],
  },
  Philosophy: {
    heading: "The question behind the question",
    paragraphs: [
      "We rarely notice the assumptions we wake up inside. They shape what counts as success, what feels like progress, and which questions seem worth asking. A good book does not hand over a new set of answers. It makes the old assumptions visible.",
      "That is where purpose begins: not with a slogan, but with an honest account of what we value and why. Leadership, work, and a well-lived day all rest on that account. Change the story you tell about why something matters, and the how tends to follow.",
    ],
    themes: [
      "Purpose and leadership",
      "The stories we use to decide",
      "Freedom inside constraint",
    ],
  },
  Uncategorised: {
    heading: "An opening",
    paragraphs: [
      "Every book begins with a small act of attention. Someone notices a detail, follows it further than expected, and finds that the detail is connected to everything else. Reading repeats that act: we slow down, look closely, and let another person's way of seeing become available to us.",
      "This preview is a place to begin. Read a page, pause, and notice what you notice. The rest of the book is waiting on the shelf, along with every other story that might change the shape of an ordinary afternoon.",
    ],
    themes: [
      "Curiosity and attention",
      "Ideas that outlive a single reading",
      "The reader's own experience",
    ],
  },
};

const READING_PROMPTS = [
  "Which image or idea stayed with you after you finished this page?",
  "What did the opening make you expect from the rest of the book?",
  "Was there a moment that reminded you of something in your own life?",
  "What would you ask the author if you could?",
];

function previewFor(category?: string): PreviewCopy {
  return PREVIEWS[normalizeCategory(category)] ?? PREVIEWS.Uncategorised;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/**
 * Greedy paragraph packing. Paragraphs are kept whole where possible, which
 * reads much better than cutting the text at an arbitrary word count.
 */
function paginate(
  paragraphs: string[],
  wordsPerPage: number
): string[][] {
  const pages: string[][] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (const paragraph of paragraphs) {
    const words = wordCount(paragraph);

    if (current.length > 0 && currentWords + words > wordsPerPage) {
      pages.push(current);
      current = [];
      currentWords = 0;
    }

    current.push(paragraph);
    currentWords += words;

    if (currentWords >= wordsPerPage) {
      pages.push(current);
      current = [];
      currentWords = 0;
    }
  }

  if (current.length > 0) {
    pages.push(current);
  }

  return pages.length > 0 ? pages : [[""]];
}

function buildFacts(book: Book): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [];

  if (book.author) {
    facts.push({ label: "Author", value: book.author });
  }

  if (book.category) {
    facts.push({ label: "Shelf", value: normalizeCategory(book.category) });
  }

  const rating = Number(book.rating);

  if (Number.isFinite(rating) && rating > 0) {
    facts.push({ label: "Rating", value: `${rating.toFixed(1)} / 5` });
  }

  const duration = formatDuration(book.duration);

  if (duration !== "—") {
    facts.push({ label: "Borrow period", value: duration });
  }

  return facts;
}

function endPage(book: Book, isPreview: boolean): ReaderPage {
  return {
    kind: "end",
    eyebrow: isPreview ? "Preview edition" : "The end",
    heading: "You've reached the end",
    paragraphs: [
      `You've reached the end of this ${isPreview ? "sample preview" : "available text"} of ${book.name}. ${
        book.author ? `${book.author}'s` : "The"
      } full title is waiting for you on the shelf.`,
      "Your place is saved automatically in this browser, so you can return to this page whenever you like and pick up where you left off.",
    ],
    note: isPreview
      ? "These pages are part of the BookNook reading demo. The sample text is illustrative and the full book text is not included."
      : undefined,
  };
}

/**
 * Builds the pages the reader shows. The first page is always a title page; the
 * last page is always the end page, which also carries the finish action.
 */
export function buildReaderPages(book: Book): ReaderPage[] {
  const title: ReaderPage = {
    kind: "title",
    heading: book.name,
    paragraphs: [],
  };

  const content = book.content?.trim();

  if (content) {
    const chunks = paginate(splitParagraphs(content), 190);

    return [
      title,
      ...chunks.map<ReaderPage>((paragraphs, index) => ({
        kind: "text",
        eyebrow: chunks.length > 1 ? `Part ${index + 1}` : "Excerpt",
        paragraphs,
      })),
      endPage(book, false),
    ];
  }

  const preview = previewFor(book.category);
  const description =
    book.description?.trim() ||
    "No description has been added for this book yet. The pages below are a sample of how BookNook presents a title page by page.";

  return [
    title,
    {
      kind: "text",
      eyebrow: "Opening pages",
      heading: "About this book",
      paragraphs: [description],
      facts: buildFacts(book),
    },
    {
      kind: "text",
      eyebrow: "BookNook sample",
      heading: preview.heading,
      paragraphs: preview.paragraphs,
    },
    {
      kind: "text",
      eyebrow: "Reading guide",
      heading: "Themes to watch for",
      paragraphs: [],
      bullets: preview.themes,
    },
    {
      kind: "text",
      eyebrow: "Reading guide",
      heading: "Notes for your reading",
      paragraphs: [],
      bullets: READING_PROMPTS,
    },
    endPage(book, true),
  ];
}
