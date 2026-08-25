import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, ChevronRight, SlidersHorizontal } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { courses, otherBatchChips } from "@/lib/app-data";

export const Route = createFileRoute("/batches")({
  head: () => ({
    meta: [
      { title: "Batches - PW Learn" },
      {
        name: "description",
        content: "Browse online, power batch and test series courses for your goal.",
      },
      { property: "og:title", content: "Batches - PW Learn" },
      {
        property: "og:description",
        content: "Browse online, power batch and test series courses for your goal.",
      },
    ],
  }),
  component: BatchesPage,
});

const tabs = [
  { id: "online", label: "Online", icon: "🖥️" },
  { id: "power", label: "Power Batch", icon: "⚡" },
  { id: "test", label: "Test Series", icon: "📋" },
];

const filters = ["All Filters", "Online", "Offline", "Power Batch", "State Board"];

function BatchesPage() {
  const [tab, setTab] = useState("online");
  const [chip, setChip] = useState<string | null>(null);

  return (
    <PageShell>
      <div className="bg-[#c9edf7]">
        <div className="flex items-center gap-3 px-4 pb-3 pt-4">
          <Menu className="size-6 shrink-0 text-foreground" strokeWidth={2.2} />
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-3">
            <Search className="size-5 text-muted-foreground" />
            <input
              placeholder="Search for neet"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <Link
          to="/select-goal"
          className="mx-4 mb-3 flex items-center gap-2 rounded-xl bg-[#e8effc] px-3 py-3"
        >
          <span className="text-base">👥</span>
          <span className="flex-1 text-[15px] font-semibold text-foreground">
            Select Your Goal
          </span>
          <span className="text-[15px] font-bold text-primary">Change</span>
        </Link>

        <div className="flex gap-3 px-4 pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                t.id === tab
                  ? "flex flex-1 flex-col items-center gap-1 rounded-xl bg-[#0b74ec] px-2 py-3 text-primary-foreground shadow"
                  : "flex flex-1 flex-col items-center gap-1 rounded-xl bg-[#dfe3e6] px-2 py-3 text-foreground"
              }
            >
              <span className="text-xl">{t.icon}</span>
              <span className="text-[13px] font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="w-16 shrink-0 text-[11px] font-bold uppercase leading-tight text-foreground">
            View other batches
          </span>
          <div className="no-scrollbar flex flex-1 gap-3 overflow-x-auto">
            {otherBatchChips.map((c) => (
              <button
                key={c}
                onClick={() => setChip(chip === c ? null : c)}
                className={
                  chip === c
                    ? "shrink-0 rounded-xl border border-primary bg-secondary px-4 py-3 text-[15px] font-medium text-foreground"
                    : "shrink-0 rounded-xl border border-border px-4 py-3 text-[15px] text-foreground"
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pt-2">
          <h2 className="text-2xl font-bold text-foreground">
            {tab === "online" ? "All Courses" : "Popular Courses"}
          </h2>
          {tab === "online" && (
            <p className="mt-0.5 text-[15px] text-muted-foreground">
              {courses.length} courses available
            </p>
          )}
        </div>

        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4 pb-4">
          {filters.map((f, i) => (
            <button
              key={f}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2.5 text-[15px] text-foreground"
            >
              {f}
              {i === 0 && <SlidersHorizontal className="size-4" />}
            </button>
          ))}
        </div>

        <div className="space-y-4 px-4 pb-6">
          {courses.map((c) => (
            <article
              key={c.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div
                className="px-4 py-6 text-center"
                style={{
                  background: `linear-gradient(160deg, ${c.banner.from}, ${c.banner.to})`,
                }}
              >
                {c.banner.sub && (
                  <p className="text-[13px] font-medium text-foreground">
                    🏅 {c.banner.sub}
                  </p>
                )}
                <p
                  className="mt-2 text-2xl font-extrabold tracking-tight"
                  style={{ color: c.banner.text }}
                >
                  {c.banner.title}
                </p>
                <p className="mt-6 text-4xl">👩‍🎓👨‍🏫👩‍🏫</p>
              </div>

              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[15px] font-bold text-tag">{c.tag}</span>
                  <span className="rounded-md border border-border px-2 py-1 text-[12px] font-semibold text-foreground">
                    {c.language}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-bold text-foreground">{c.title}</h3>
                <p className="mt-2 flex items-center gap-2 text-[15px] text-foreground">
                  📖 {c.exam}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-[15px] text-foreground">
                  <span className="size-2 rounded-full bg-destructive" />
                  {c.status}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-foreground">
                      ₹{c.price}{" "}
                      <span className="text-[15px] font-normal text-muted-foreground line-through">
                        ₹{c.mrp}
                      </span>
                    </p>
                    <p className="text-[15px] font-semibold text-success">
                      {c.off}% OFF
                    </p>
                  </div>
                  <button className="rounded-xl bg-foreground px-6 py-3 text-[15px] font-bold text-background">
                    Buy Now
                  </button>
                  <button
                    aria-label="Details"
                    className="rounded-xl border border-border p-3"
                  >
                    <ChevronRight className="size-5 text-foreground" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
