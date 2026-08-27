import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Search, Info } from "lucide-react";
import { allExams, otherOfferings, popularExams } from "@/lib/app-data";

export const Route = createFileRoute("/select-goal")({
  head: () => ({
    meta: [
      { title: "Select Your Goal - PW Learn" },
      {
        name: "description",
        content:
          "Choose your exam goal: NEET, IIT-JEE, UPSC, Govt exams, CA, CS and more.",
      },
      { property: "og:title", content: "Select Your Goal - PW Learn" },
      {
        property: "og:description",
        content: "Choose your exam goal: NEET, IIT-JEE, UPSC, CA, CS and more.",
      },
    ],
  }),
  component: SelectGoalPage,
});

function SelectGoalPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();

  const exams = allExams.filter((e) => e.title.toLowerCase().includes(term));
  const others = otherOfferings.filter((o) => o.title.toLowerCase().includes(term));
  const popular = popularExams.filter((p) => p.label.toLowerCase().includes(term));

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-10">
      <header className="sticky top-0 z-30 bg-card px-4 pb-3 pt-3.5">
        <div className="flex items-center gap-3">
          <button aria-label="Back" onClick={() => router.history.back()}>
            <ChevronLeft className="size-6 text-foreground" strokeWidth={2.4} />
          </button>
          <h1 className="text-[16px] font-bold text-foreground">Select Your Goal</h1>
        </div>
        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-border px-3 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search For Exams"
            className="w-full bg-transparent text-[13px] font-bold outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      {popular.length > 0 && (
        <section className="px-4 pt-4">
          <h2 className="text-[15px] font-bold text-foreground">Popular Exams</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {popular.map((p) => (
              <button
                key={p.label}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-4 text-left"
                style={{ backgroundColor: p.bg }}
              >
                <span className="text-[18px]">{p.icon}</span>
                <span className="text-[13px] font-bold text-foreground">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {exams.length > 0 && (
        <section className="px-4 pt-4">
          <h2 className="text-[15px] font-bold text-foreground">All Exams</h2>
          <div className="mt-3 space-y-2.5">
            {exams.map((e) => (
              <button
                key={e.title}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[18px]"
                  style={{ backgroundColor: e.bg }}
                >
                  {e.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold leading-snug text-foreground">
                    {e.title}
                  </span>
                  {e.desc && (
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                      {e.desc} <Info className="size-3" />
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="text-[15px] font-bold text-foreground">Other Offerings</h2>
          <div className="mt-3 space-y-2.5">
            {others.map((o) => (
              <button
                key={o.title}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[18px]"
                  style={{ backgroundColor: o.bg }}
                >
                  {o.icon}
                </span>
                <span className="text-[14px] font-bold text-foreground">
                  {o.title}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {popular.length === 0 && exams.length === 0 && others.length === 0 && (
        <p className="px-4 py-16 text-center text-[13px] font-bold text-muted-foreground">
          No results found
        </p>
      )}
    </div>
  );
}
