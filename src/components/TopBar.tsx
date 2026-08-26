import { Link } from "@tanstack/react-router";
import { Menu, ChevronRight } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 shadow-sm">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button aria-label="Menu" className="shrink-0 p-0.5">
          <Menu className="size-7 text-foreground" strokeWidth={2.3} />
        </button>

        <Link
          to="/select-goal"
          className="flex h-12 min-w-0 items-center gap-2.5 rounded-xl border border-border bg-card px-3 shadow-sm"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm">🎒</span>
          <span className="truncate text-[16px] font-bold text-foreground">
            12th - NEET
          </span>
          <ChevronRight className="ml-auto size-5 shrink-0 text-primary" strokeWidth={2.5} />
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="flex h-10 items-center gap-1.5 rounded-full border border-border px-2 shadow-sm">
            <span className="text-base">🔥</span>
            <span className="text-[15px] font-bold text-foreground">0</span>
          </span>
          <span className="flex h-10 items-center gap-1 rounded-full border border-border px-2 shadow-sm">
            <span className="text-base">💠</span>
            <span className="text-[15px] font-bold text-foreground">0</span>
          </span>
          <span className="text-xl">🎁</span>
        </div>
      </div>
    </header>
  );
}
