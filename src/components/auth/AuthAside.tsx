import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

export default function AuthAside() {
  return (
    <aside className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#5426B8] via-[#451D96] to-[#2E1266] p-10 text-white lg:flex">
      <Sparkles
        size={200}
        className="absolute -right-10 -top-10 text-white/5"
      />
      <BookOpen
        size={300}
        className="absolute -bottom-24 -left-16 text-white/5"
      />

      <Link href="/" className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <BookOpen size={26} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Book<span className="text-[#C4B0F5]">Nook</span>
          </h1>
          <p className="text-[10px] font-semibold tracking-[2.5px] text-white/60">
            READ • BORROW • EXPLORE
          </p>
        </div>
      </Link>

      <div className="relative">
        <h2 className="text-4xl font-bold leading-tight">
          Your reading journey <br />
          starts here.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
          Borrow books, track your reads, join book clubs, and discover your
          next favorite story — all in one cozy nook.
        </p>
      </div>

      <p className="relative text-xs text-white/50">© 2026 BookNook</p>
    </aside>
  );
}
