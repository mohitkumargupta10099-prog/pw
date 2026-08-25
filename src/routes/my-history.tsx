import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/my-history")({
  head: () => ({
    meta: [
      { title: "My History - PW Learn" },
      {
        name: "description",
        content: "Videos you watch and practice you attempt appear in your history.",
      },
      { property: "og:title", content: "My History - PW Learn" },
      {
        property: "og:description",
        content: "Videos you watch and practice you attempt appear in your history.",
      },
    ],
  }),
  component: MyHistoryPage,
});

function MyHistoryPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"videos" | "practice">("videos");

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-card">
      <header className="flex items-center gap-3 border-b border-border px-4 py-4">
        <button aria-label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-7 text-foreground" strokeWidth={2.4} />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">My History</h1>
        <span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5">
          <span className="text-sm">💠</span>
          <span className="text-sm font-semibold text-foreground">0</span>
        </span>
      </header>

      <div className="flex items-center gap-3 px-4 py-4">
        {(["videos", "practice"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              t === tab
                ? "rounded-full bg-[#3b3b3b] px-6 py-2.5 text-[15px] font-bold text-background"
                : "rounded-full border border-border px-6 py-2.5 text-[15px] text-foreground"
            }
          >
            {t === "videos" ? "Videos" : "Practice"}
          </button>
        ))}
        <span className="h-8 w-px bg-border" />
        <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[15px] text-foreground">
          Batch <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="flex flex-col items-center px-6 py-28 text-center">
        <span className="text-6xl">🗂️🔍</span>
        <h2 className="mt-8 text-2xl font-bold text-foreground">No content found</h2>
        <p className="mt-2 text-[17px] text-muted-foreground">
          {tab === "videos"
            ? "Videos you watch will appear here"
            : "Practice you attempt will appear here"}
        </p>
      </div>
    </div>
  );
}
