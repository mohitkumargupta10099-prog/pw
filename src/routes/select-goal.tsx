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
      <header className="sticky top-0 z-30 bg-card px-4 pb-4 pt-4">
        <div className="flex items-center gap-3">
          <button aria-label="Back" onClick={() => router.history.back()}>
            <ChevronLeft className="size-7 text-foreground" strokeWidth={2.4} />
          </button>
          <h1 className="text-xl font-bold text-foreground">Select Your Goal</h1>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border px-3 py-3">
          <Search className="size-5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search For Exams"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      {popular.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="text-xl font-bold text-foreground">Popular Exams</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {popular.map((p) => (
              <button
                key={p.label}
                className="flex items-center gap-3 rounded-xl px-4 py-5 text-left"
                style={{ backgroundColor: p.bg }}
              >
                <span className="text-2xl">{p.icon}</span>
                <span className="text-[15px] font-medium text-foreground">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {exams.length > 0 && (
        <section className="px-4 pt-5">
          <h2 className="text-xl font-bold text-foreground">All Exams</h2>
          <div className="mt-4 space-y-3">
            {exams.map((e) => (
              <button
                key={e.title}
                className="flex w-full items-center gap-4 rounded-xl border border-border bg-card px-3 py-3 text-left"
              >
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: e.bg }}
                >
                  {e.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[17px] font-medium leading-snug text-foreground">
                    {e.title}
                  </span>
                  {e.desc && (
                    <span className="mt-0.5 flex items-center gap-1.5 text-[14px] text-muted-foreground">
                      {e.desc} <Info className="size-3.5" />
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="px-4 pt-6">
          <h2 className="text-xl font-bold text-foreground">Other Offerings</h2>
          <div className="mt-4 space-y-3">
            {others.map((o) => (
              <button
                key={o.title}
                className="flex w-full items-center gap-4 rounded-xl border border-border bg-card px-3 py-3 text-left"
              >
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: o.bg }}
                >
                  {o.icon}
                </span>
                <span className="text-[17px] font-medium text-foreground">
                  {o.title}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {popular.length === 0 && exams.length === 0 && others.length === 0 && (
        <p className="px-4 py-16 text-center text-[15px] text-muted-foreground">
          No results found
        </p>
      )}
    </div>
  );
}
