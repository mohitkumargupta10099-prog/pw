import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, CalendarDays, MessageCircle } from "lucide-react";
import { enrolledBatches } from "@/lib/app-data";

export const Route = createFileRoute("/my-batches")({
  head: () => ({
    meta: [
      { title: "My Batches - PW Learn" },
      {
        name: "description",
        content: "All your enrolled paid and free batches in one place.",
      },
      { property: "og:title", content: "My Batches - PW Learn" },
      {
        property: "og:description",
        content: "All your enrolled paid and free batches in one place.",
      },
    ],
  }),
  component: MyBatchesPage,
});

function MyBatchesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"paid" | "free">("free");
  const list = enrolledBatches.filter((b) => (tab === "free" ? b.free : !b.free));

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-4">
        <button aria-label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-7 text-foreground" strokeWidth={2.4} />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">My Batches</h1>
        <span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5">
          <span className="text-sm">💠</span>
          <span className="text-sm font-semibold text-foreground">0</span>
        </span>
      </header>

      <div className="px-4 pt-5">
        <div className="mx-auto grid max-w-sm grid-cols-2 rounded-xl bg-[#eef2fd] p-1.5">
          {(["paid", "free"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                t === tab
                  ? "rounded-lg bg-card py-2.5 text-[15px] font-bold text-primary shadow-sm"
                  : "rounded-lg py-2.5 text-[15px] font-semibold text-foreground"
              }
            >
              {t === "paid" ? "Paid" : "Free"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 pt-5">
        {list.map((b) => (
          <article key={b.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <h2 className="flex-1 text-xl font-bold text-foreground">{b.name}</h2>
              {b.isNew && (
                <span className="rounded-md bg-badge px-2.5 py-1 text-[13px] font-bold text-badge-foreground">
                  New
                </span>
              )}
              <MessageCircle className="size-6 text-foreground" />
            </div>

            <div
              className="relative mt-4 overflow-hidden rounded-xl px-4 py-10 text-center"
              style={{
                background: `linear-gradient(160deg, ${b.banner.from}, ${b.banner.to})`,
              }}
            >
              <p
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: b.banner.text }}
              >
                {b.banner.title}
              </p>
              <span className="absolute bottom-3 left-3 rounded-md bg-card/80 px-3 py-1.5 text-[13px] text-foreground">
                {b.language}
              </span>
            </div>

            <p className="mt-4 flex flex-wrap items-center gap-2 text-[15px] text-muted-foreground">
              <CalendarDays className="size-4" />
              Starts on <b className="text-foreground">{b.starts}</b> •  Ends on{" "}
              <b className="text-foreground">{b.ends}</b>
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <button className="rounded-xl bg-secondary py-3.5 text-[15px] font-bold text-primary">
                Similar Batches
              </button>
              <button className="rounded-xl bg-primary py-3.5 text-[15px] font-bold text-primary-foreground">
                Let&apos;s Study
              </button>
            </div>
          </article>
        ))}
        {list.length === 0 && (
          <p className="py-20 text-center text-[15px] text-muted-foreground">
            No {tab} batches yet
          </p>
        )}
      </div>
    </div>
  );
}
