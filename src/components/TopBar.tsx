import { Link } from "@tanstack/react-router";
import { Menu, ChevronRight } from "lucide-react";
import xpIcon from "@/assets/xp.png.asset.json";
import myBatchesIcon from "@/assets/my-batches.png.asset.json";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 shadow-sm">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button aria-label="Menu" className="shrink-0 p-0.5">
          <Menu className="size-7 text-foreground" strokeWidth={2.3} />
        </button>

        <Link
          to="/select-goal"
          className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-border bg-card px-2.5 shadow-sm"
        >
          <img src={myBatchesIcon.url} alt="" className="size-6 shrink-0 object-contain" />
          <span className="truncate text-[14px] font-bold text-foreground">
            12th - NEET
          </span>
          <ChevronRight className="ml-auto size-5 shrink-0 text-primary" strokeWidth={2.5} />
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="flex h-9 items-center gap-1 rounded-full border border-border px-2 shadow-sm">
            <span className="text-sm">🔥</span>
            <span className="text-[13px] font-bold text-foreground">0</span>
          </span>
          <span className="flex h-9 items-center gap-1 rounded-full border border-border px-2 shadow-sm">
            <img src={xpIcon.url} alt="XP" className="size-4 object-contain" />
            <span className="text-[13px] font-bold text-foreground">0</span>
          </span>
          <span className="text-lg">🎁</span>
        </div>
      </div>
    </header>
  );
}
