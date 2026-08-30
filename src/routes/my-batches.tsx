import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, CalendarDays, MessageCircle } from "lucide-react";
import { useEnrolled } from "@/lib/enrollment";


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
  const enrolled = useEnrolled();
  const list = enrolled.filter((b) => (tab === "free" ? b.fee <= 0 : b.fee > 0));


  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button aria-label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-6 text-foreground" strokeWidth={2.4} />
        </button>
        <h1 className="flex-1 text-[16px] font-bold text-foreground">My Batches</h1>
        <span className="flex items-center gap-1 rounded-full border border-border px-2 py-1">
          <span className="text-[12px]">💠</span>
          <span className="text-[12px] font-bold text-foreground">0</span>
        </span>
      </header>

      <div className="px-4 pt-4">
        <div className="mx-auto grid max-w-sm grid-cols-2 rounded-xl bg-[#eef2fd] p-1.5">
          {(["paid", "free"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                t === tab
                  ? "rounded-lg bg-card py-2 text-[13px] font-bold text-primary shadow-sm"
                  : "rounded-lg py-2 text-[13px] font-bold text-foreground"
              }
            >
              {t === "paid" ? "Paid" : "Free"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {list.map((b) => (
          <article key={b.id} className="rounded-2xl bg-card p-3.5 shadow-sm">
            <div className="flex items-center gap-2">
              <h2 className="flex-1 text-[13px] font-bold text-foreground">{b.name}</h2>
              <span className="rounded-md bg-badge px-2 py-0.5 text-[10px] font-bold text-badge-foreground">
                New
              </span>
              <MessageCircle className="size-4 text-foreground" />
            </div>

            <div className="relative mt-3 overflow-hidden rounded-xl">
              {b.image ? (
                <img
                  src={b.image}
                  alt={b.name}
                  loading="lazy"
                  className="h-[140px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[110px] items-center justify-center bg-secondary px-4 text-center">
                  <p className="text-[16px] font-extrabold uppercase text-primary">
                    {b.name}
                  </p>
                </div>
              )}
              <span className="absolute bottom-2.5 left-2.5 rounded-md bg-card/80 px-2.5 py-1 text-[10px] font-bold text-foreground">
                {b.language}
              </span>
            </div>

            <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
              <CalendarDays className="size-3.5" />
              Starts on <b className="text-foreground">{b.startDate}</b> • Ends on{" "}
              <b className="text-foreground">{b.endDate}</b>
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-border pt-3">
              <Link
                to="/batches"
                className="rounded-xl bg-secondary py-2.5 text-center text-[12px] font-bold text-primary"
              >
                Similar Batches
              </Link>
              <Link
                to="/batch/$batchId"
                params={{ batchId: b.id }}
                className="rounded-xl bg-primary py-2.5 text-center text-[12px] font-bold text-primary-foreground"
              >
                Let's Study
              </Link>
            </div>
          </article>
        ))}
        {list.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[12px] font-bold text-muted-foreground">
              No {tab} batches yet
            </p>
            <Link
              to="/batches"
              className="mt-3 inline-block rounded-xl bg-primary px-5 py-2.5 text-[12px] font-bold text-primary-foreground"
            >
              Explore Batches
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

