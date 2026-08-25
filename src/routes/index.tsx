import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight, CalendarDays, Check } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/PageShell";
import {
  enrolledBatches,
  exploreItems,
  exploreMore,
  quickAccess,
} from "@/lib/app-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Study - PW Learn" },
      {
        name: "description",
        content:
          "Study dashboard with today's class, quick access tools and free learning resources.",
      },
      { property: "og:title", content: "Study - PW Learn" },
      {
        property: "og:description",
        content: "Today's class, quick access tools and free learning resources.",
      },
    ],
  }),
  component: StudyPage,
});

function StudyPage() {
  const [batchId, setBatchId] = useState(enrolledBatches[0]!.id);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const batch = enrolledBatches.find((b) => b.id === batchId)!;

  return (
    <PageShell>
      <TopBar />

      {/* Enrolled batches */}
      <section className="bg-card px-4 pb-3 pt-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wide text-foreground">
            Enrolled Batches
          </h2>
          <Link
            to="/my-batches"
            className="text-[12px] font-bold text-primary"
          >
            View All
          </Link>
        </div>

        {enrolledBatches.length === 0 ? (
          <div className="mt-3 rounded-xl border border-border px-3 py-5 text-center">
            <p className="text-[13px] font-bold text-foreground">
              No enrolled batches yet
            </p>
            <Link
              to="/batches"
              className="mt-3 inline-flex items-center gap-1 rounded-xl bg-foreground px-4 py-2.5 text-[13px] font-bold text-background"
            >
              Explore Batches
              <ChevronRight className="size-4" />
            </Link>
          </div>
        ) : (
          <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
            {enrolledBatches.map((b) => {
              const active = b.id === batchId;
              return (
                <button
                  key={b.id}
                  onClick={() => setBatchId(b.id)}
                  className={
                    active
                      ? "flex w-[190px] shrink-0 items-center gap-2 rounded-xl border border-primary bg-secondary px-2.5 py-2 text-left"
                      : "flex w-[190px] shrink-0 items-center gap-2 rounded-xl border border-border px-2.5 py-2 text-left"
                  }
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[15px]"
                    style={{ background: b.banner.from, color: b.banner.text }}
                  >
                    📘
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-extrabold leading-tight text-foreground">
                      {b.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] font-bold text-muted-foreground">
                      {b.free ? "Free" : "Paid"} · {b.language}
                    </span>
                  </span>
                  {active && <Check className="size-4 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
      </section>


      <div className="h-2 bg-muted" />

      {/* Today's class */}
      <section className="bg-card px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Today&apos;s Class</h2>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <CalendarDays className="size-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Weekly Schedule</span>
          </button>
        </div>
        <div className="mt-4 rounded-xl border border-border py-9 text-center">
          <p className="text-[15px] text-foreground">No Class scheduled!</p>
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-1 py-1">
          <span className="text-[15px] font-semibold text-primary">
            View All Classes
          </span>
          <ChevronRight className="size-5 text-primary" />
        </button>
      </section>

      <div className="h-2 bg-muted" />

      {/* Quick Access */}
      <section className="bg-card px-4 pb-6 pt-5">
        <h2 className="text-xl font-bold text-foreground">Quick Access</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {quickAccess.map((item) => {
            const inner = (
              <>
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-2xl">
                  {item.icon}
                </span>
                <span className="mt-3 line-clamp-1 text-[15px] font-semibold text-foreground">
                  {item.label}
                </span>
              </>
            );
            const cls =
              "flex flex-col items-start rounded-xl border border-border bg-card p-3 shadow-sm";
            return item.to ? (
              <Link key={item.label} to={item.to} className={cls}>
                {inner}
              </Link>
            ) : (
              <div key={item.label} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-2 bg-muted" />

      {/* Promo carousel */}
      <section className="bg-card px-4 py-4">
        <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#eaf3ff] to-[#f4f9ff] p-4">
          {slide === 0 && (
            <>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-sm">
                  📖
                </span>
                <span className="text-xl font-extrabold text-foreground">
                  PW Books App
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-[15px] text-foreground">
                <li>🤖 AI Explanations</li>
                <li>📋 PYQ Practice &amp; NCERT Solutions</li>
                <li>✏️ Smart Notes &amp; Highlights</li>
              </ul>
              <button className="mt-4 rounded-lg bg-foreground px-4 py-2 text-sm font-bold text-background">
                Download Now
              </button>
            </>
          )}
          {slide === 1 && (
            <div className="py-6 text-center">
              <p className="text-lg font-extrabold text-foreground">
                XP Collect Karo &amp; Win Karo!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Learn daily and earn rewards
              </p>
            </div>
          )}
          {slide === 2 && (
            <div className="py-6 text-center">
              <p className="text-lg font-extrabold text-foreground">
                Refer &amp; Earn
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Invite friends, unlock benefits
              </p>
            </div>
          )}
        </div>
        <div className="mt-3 flex justify-center">
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-1.5">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setSlide(i)}
                className={
                  i === slide
                    ? "size-2 rounded-full bg-foreground"
                    : "size-2 rounded-full bg-border"
                }
              />
            ))}
          </div>
        </div>
      </section>

      <div className="h-2 bg-muted" />

      {/* Explore */}
      <section className="bg-card px-4 py-5">
        <h2 className="text-xl font-bold text-foreground">Explore</h2>
        <p className="mt-0.5 text-[15px] text-muted-foreground">
          Get additional guidance with these features
        </p>
        <div className="mt-4 space-y-3">
          {[...exploreItems, ...(moreOpen ? exploreMore : [])].map((e) => (
            <div
              key={e.title}
              className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-card text-xl">
                {e.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-foreground">
                  {e.title}
                </span>
                <span className="block truncate text-[13px] text-muted-foreground">
                  {e.desc}
                </span>
              </span>
              <ChevronRight className="size-5 text-foreground" />
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="mx-auto flex items-center gap-2"
          >
            <span className="text-[15px] font-semibold text-foreground">
              {moreOpen ? "Explore Less" : "Explore More"}
            </span>
            <ChevronDown
              className={`size-5 text-foreground transition-transform ${moreOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </section>

      <div className="h-2 bg-muted" />

      <section className="bg-card px-4 py-10">
        <p className="text-2xl font-bold leading-snug text-muted-foreground">
          Padhlo chahe kahi se, manzil milegi yahi se...
        </p>
        <p className="mt-3 text-[15px] text-muted-foreground">
          ❤️ From PhysicsWallah
        </p>
      </section>
    </PageShell>
  );
}
