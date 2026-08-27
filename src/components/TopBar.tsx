import { Link } from "@tanstack/react-router";
import { Menu, ChevronRight } from "lucide-react";
import xpIcon from "@/assets/xp.png.asset.json";
import myBatchesIcon from "@/assets/my-batches.png.asset.json";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card px-3 py-2.5 shadow-sm">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
        <button aria-label="Menu" className="shrink-0 p-0.5">
          <Menu className="size-6 text-foreground" strokeWidth={2.3} />
        </button>

        <Link
          to="/select-goal"
          className="flex h-9 min-w-0 items-center gap-1.5 rounded-lg border border-border bg-card px-2 shadow-sm"
        >
          <img src={myBatchesIcon.url} alt="" className="size-5 shrink-0 object-contain" />
          <span className="truncate text-[12px] font-bold text-foreground">
            12th - NEET
          </span>
          <ChevronRight className="ml-auto size-4 shrink-0 text-primary" strokeWidth={2.5} />
        </Link>

        <div className="flex shrink-0 items-center gap-1">
          <span className="flex h-7 items-center gap-1 rounded-full border border-border px-1.5 shadow-sm">
            <span className="text-[11px]">🔥</span>
            <span className="text-[11px] font-bold text-foreground">0</span>
          </span>
          <span className="flex h-7 items-center gap-1 rounded-full border border-border px-1.5 shadow-sm">
            <img src={xpIcon.url} alt="XP" className="size-3.5 object-contain" />
            <span className="text-[11px] font-bold text-foreground">0</span>
          </span>
          <span className="text-[14px]">🎁</span>
        </div>
      </div>
    </header>
  );
}
