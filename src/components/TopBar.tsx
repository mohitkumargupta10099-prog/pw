import { Link } from "@tanstack/react-router";
import { Menu, ChevronRight } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card px-3 py-2.5">
      <div className="flex items-center gap-2">
        <button aria-label="Menu" className="shrink-0 p-1">
          <Menu className="size-6 text-foreground" strokeWidth={2.2} />
        </button>

        <Link
          to="/select-goal"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2 shadow-sm"
        >
          <span className="text-base">👥</span>
          <span className="truncate text-[15px] font-semibold text-foreground">
            Select Your Goal
          </span>
          <ChevronRight className="ml-auto size-4 shrink-0 text-primary" />
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full border border-border px-2 py-1.5">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-semibold text-foreground">0</span>
          </span>
          <span className="flex items-center gap-1 rounded-full border border-border px-2 py-1.5">
            <span className="text-sm">💠</span>
            <span className="text-sm font-semibold text-foreground">0</span>
          </span>
          <span className="text-lg">🎁</span>
        </div>
      </div>
    </header>
  );
}
