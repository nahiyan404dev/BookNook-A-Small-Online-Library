# booknook

Freshly scaffolded Next.js 16 app — most app code is still to be written. Keep changes consistent with the scaffolding choices below.

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
