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
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button aria-label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-6 text-foreground" strokeWidth={2.4} />
        </button>
        <h1 className="flex-1 text-[16px] font-bold text-foreground">My History</h1>
        <span className="flex items-center gap-1 rounded-full border border-border px-2 py-1">
          <span className="text-[12px]">💠</span>
          <span className="text-[12px] font-bold text-foreground">0</span>
        </span>
      </header>

      <div className="flex items-center gap-2.5 px-4 py-3">
        {(["videos", "practice"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              t === tab
                ? "rounded-full bg-[#3b3b3b] px-5 py-2 text-[12px] font-bold text-background"
                : "rounded-full border border-border px-5 py-2 text-[12px] font-bold text-foreground"
            }
          >
            {t === "videos" ? "Videos" : "Practice"}
          </button>
        ))}
        <span className="h-7 w-px bg-border" />
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[12px] font-bold text-foreground">
          Batch <ChevronDown className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-col items-center px-6 py-24 text-center">
        <span className="text-5xl">🗂️🔍</span>
        <h2 className="mt-6 text-[17px] font-bold text-foreground">No content found</h2>
        <p className="mt-2 text-[14px] font-bold text-muted-foreground">
          {tab === "videos"
            ? "Videos you watch will appear here"
            : "Practice you attempt will appear here"}
        </p>
      </div>
    </div>
  );
}
