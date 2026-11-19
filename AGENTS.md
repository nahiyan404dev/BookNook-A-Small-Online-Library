# booknook

BookNook — a library/book-tracking web app. Next.js 16 app with an early front-end skeleton in place (no backend, data fetching, or auth yet). Keep changes consistent with the scaffolding choices below.

## App structure (current state)

- `src/app/page.tsx` — public home page, renders `src/components/Navbar.tsx`.
- `src/app/(dashboard)/` — route group for the logged-in area; its layout renders `src/components/dashboard/Sidebar.tsx` + content offset (`md:pl-20 lg:pl-64`). Only `/dashboard` (welcome placeholder) exists so far.
- Nav links reference routes that do **not** exist yet — create them as needed:
  - Public: `/books`, `/my-books`, `/my-borrows`, `/login`, `/register`
  - Dashboard: `/dashboard/{books,discover,add-book,my-books,my-borrows,bookmarks,book-clubs,settings}`
- Feature components are hand-written by the user (not shadcn primitives). Note: `Navbar.tsx` and `Sidebar.tsx` import icons from `lucide-react` (installed) even though shadcn components use `hugeicons` — match the file you're editing.
- Brand palette in use: public pages use deep green `#183d32` (header bg `#faf9f6`, border `#e9e4dc`); dashboard uses purple `#5426B8` / `#8B5CF6` accents on white with bg `#F8F7FC`. Don't introduce conflicting theme colors.
- Logo images live in `src/assets/`.

## Commands

- `npm run dev` — dev server (Turbopack), http://localhost:3000
- `npm run build` / `npm run start`
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`); this is the only check available (no test setup, no typecheck script — use `npx tsc --noEmit` for types if needed)

## Next.js 16 specifics (differ from older Next)

- `next.config.ts` enables non-default flags: `cacheComponents`, `reactCompiler` (React Compiler via `babel-plugin-react-compiler`), `partialPrefetching`, `experimental.agentFeedback`. Components are auto-memoized — don't add manual `useMemo`/`memo` unless profiling shows a need.
- Tailwind is wired through a Turbopack rule in `next.config.ts` (`@tailwindcss/turbopack`), not PostCSS.
- Fonts (Geist, Geist Mono, Figtree) are loaded in `src/app/layout.tsx` and exposed as CSS variables (`--font-sans`, `--font-geist-mono`); the `<html>` element carries `font-sans`/`antialiased`.

## Styling: Tailwind v4 (CSS-first)

- No `tailwind.config.*`. Theme tokens and shadcn color variables live in `src/app/globals.css` (`@import "tailwindcss"`, `@theme inline`, `@custom-variant dark`). Edit that file, not a JS config.
- Dark mode is class-based (`.dark` on an ancestor), not `prefers-color-scheme`.

## shadcn/ui: `base-maia` style, Base UI — not Radix

- `components.json` sets style `base-maia`; installed components (in `src/components/ui/`) are built on `@base-ui/react`, and the icon library is `@hugeicons/react` (`@hugeicons/core-free-icons`) — **not** lucide-react or Radix primitives. Don't import from `@radix-ui/*` or `lucide-react` even if familiar.
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`, `@/lib/utils` (`@/*` → `src/*` per `tsconfig.json`).
- Add new components with the shadcn CLI (`shadcn` is an installed dependency), e.g. `npx shadcn add dialog` — don't hand-write UI primitives.
- `cn` is re-exported from the `cn` package via `src/lib/utils.ts` — import it from `@/lib/utils`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
