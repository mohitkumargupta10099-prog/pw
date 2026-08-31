import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Bookmark,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  CloudDownload,
  GraduationCap,
  ListChecks,
  Swords,
  X,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { PageShell } from "@/components/PageShell";
import myBatchesIcon from "@/assets/my-batches.png.asset.json";
import myHistoryIcon from "@/assets/my-history.png.asset.json";
import myDoubtsIcon from "@/assets/my-doubts.png.asset.json";
import dashboardIcon from "@/assets/dashboard.png.asset.json";
import calendarIcon from "@/assets/calendar.png.asset.json";
import pdfBankIcon from "@/assets/pdf-bank.png.asset.json";
import libraryIcon from "@/assets/library.png.asset.json";
import mentorshipIcon from "@/assets/mentorship.png.asset.json";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { todaysSchedule } from "@/lib/pw-api.functions";
import { useEnrolled } from "@/lib/enrollment";
import { exploreItems, exploreMore, quickAccess } from "@/lib/app-data";


const quickIcons: Record<string, string | undefined> = {
  "My Batches": myBatchesIcon.url,
  "My History": myHistoryIcon.url,
  "My Doubts": myDoubtsIcon.url,
  Dashboard: dashboardIcon.url,
  "Real Test Se...": calendarIcon.url,
  "PDF Bank": pdfBankIcon.url,
};

const exploreIcons: Record<string, string | undefined> = {
  Library: libraryIcon.url,
  Mentorship: mentorshipIcon.url,
  "Test Series": calendarIcon.url,
};


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
  const enrolledBatches = useEnrolled();
  const [selectedId, setSelectedId] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const active =
    enrolledBatches.find((b) => b.id === selectedId) ?? enrolledBatches[0] ?? null;
  const batchId = active?.id ?? "";

  const getSchedule = useServerFn(todaysSchedule);
  const schedule = useQuery({
    queryKey: ["todays-schedule", batchId],
    queryFn: () => getSchedule({ data: { batchId } }),
    enabled: Boolean(batchId),
    staleTime: 5 * 60_000,
  });

  return (
    <PageShell>
      <TopBar />

      <section className="relative border-b border-border bg-card">
        {!active ? (
          <Link to="/batches" className="flex h-[44px] items-center justify-between px-4 text-[13px] font-bold text-foreground">
            Explore Batches
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <button
            onClick={() => setPickerOpen(true)}
            className="flex h-[44px] w-full items-center gap-2 px-4 text-left"
          >
            <span className="truncate text-[13px] font-bold text-foreground">
              {active.name}
            </span>
            <ChevronDown className="size-4 shrink-0 text-foreground" strokeWidth={2.5} />
          </button>
        )}
      </section>


      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            aria-label="Close"
            onClick={() => setPickerOpen(false)}
            className="flex-1 bg-foreground/40"
          />
          <div className="relative mx-auto w-full max-w-screen-sm rounded-t-2xl bg-card pb-5 pt-3">
            <button
              aria-label="Close"
              onClick={() => setPickerOpen(false)}
              className="absolute -top-12 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full bg-card shadow-md"
            >
              <X className="size-5 text-foreground" strokeWidth={2.4} />
            </button>
            <div className="mx-auto h-1 w-9 rounded-full bg-border" />
            <p className="mt-3 text-center text-[15px] font-bold text-foreground">
              Select an Option
            </p>
            <p className="mt-2 border-b border-border px-4 pb-1 text-[12px] font-bold text-primary">
              Enrolled Batches
            </p>
            <div className="max-h-[45vh] overflow-y-auto">
              {enrolledBatches.map((batch) => {
                const selected = batch.id === batchId;
                return (
                  <button
                    key={batch.id}
                    onClick={() => { setSelectedId(batch.id); setPickerOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-3.5 text-left ${selected ? "bg-secondary" : ""}`}
                  >
                    <span className="text-[13px] font-bold text-foreground">{batch.name}</span>
                    <span
                      className={`flex size-5 items-center justify-center rounded-full border-2 ${selected ? "border-primary" : "border-border"}`}
                    >
                      {selected && <span className="size-2.5 rounded-full bg-primary" />}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>
        </div>
      )}



      <div className="h-2 bg-muted" />

      {/* Today's class */}
      <section className="bg-card px-4 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-foreground">Today's Class</h2>
          <button className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5">
            <CalendarDays className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold text-primary">Weekly Schedule</span>
          </button>
        </div>
        <div className="mt-4 flex h-[110px] items-center justify-center rounded-xl border border-border shadow-sm">
          <p className="text-[12px] font-bold text-foreground">No Class scheduled!</p>
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-1 py-1">
          <span className="text-[12px] font-bold text-primary">
            View All Classes
          </span>
          <ChevronRight className="size-4 text-primary" />
        </button>
      </section>

      <div className="h-2 bg-muted" />

      {/* Quick Access */}
      <section className="bg-card px-4 pb-6 pt-4">
        <h2 className="text-[14px] font-bold text-foreground">Quick Access</h2>
        <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-3.5">
          {quickAccess.map((item, index) => {
            const icons = [BookOpen, BookOpen, BookOpen, BookOpen, ClipboardCheck, CloudDownload, BookOpen, GraduationCap, Swords, Bookmark];
            const Icon = icons[index] ?? BookOpen;
            const img = quickIcons[item.label];
            const inner = (
              <>
                <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
                  {img ? (
                    <img src={img} alt="" className="size-7 object-contain" loading="lazy" />
                  ) : (
                    <Icon className="size-6 text-foreground" strokeWidth={1.7} />
                  )}
                </span>
                <span className="mt-2.5 w-full truncate text-[11px] font-bold text-foreground">
                  {item.label}
                </span>
              </>
            );
            const cls =
              "flex aspect-[1/1.08] min-w-0 flex-col items-start justify-center rounded-xl border border-border bg-card px-2.5 shadow-sm";
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
      <section className="bg-card px-4 py-3.5">
        <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#eaf3ff] to-[#f4f9ff] p-3.5">
          {slide === 0 && (
            <>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-[11px]">
                  📖
                </span>
                <span className="text-[17px] font-extrabold text-foreground">
                  PW Books App
                </span>
              </div>
              <ul className="mt-2.5 space-y-1 text-[13px] font-medium text-foreground">
                <li>🤖 AI Explanations</li>
                <li>📋 PYQ Practice & NCERT Solutions</li>
                <li>✏️ Smart Notes & Highlights</li>
              </ul>
              <button className="mt-3 rounded-lg bg-foreground px-3.5 py-1.5 text-[12px] font-bold text-background">
                Download Now
              </button>
            </>
          )}
          {slide === 1 && (
            <div className="py-5 text-center">
              <p className="text-[15px] font-extrabold text-foreground">
                XP Collect Karo & Win Karo!
              </p>
              <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                Learn daily and earn rewards
              </p>
            </div>
          )}
          {slide === 2 && (
            <div className="py-5 text-center">
              <p className="text-[15px] font-extrabold text-foreground">
                Refer & Earn
              </p>
              <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                Invite friends, unlock benefits
              </p>
            </div>
          )}
        </div>
        <div className="mt-2.5 flex justify-center">
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-1">
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
        <h2 className="text-[14px] font-bold text-foreground">Explore</h2>
        <p className="mt-0.5 text-[11px] font-bold text-muted-foreground">
          Get additional guidance with these features
        </p>
        <div className="mt-3.5 space-y-2.5">
          {[...exploreItems, ...(moreOpen ? exploreMore : [])].map((e, index) => {
            const icons = [ListChecks, BookOpen, BookOpen, BookOpen, BookOpen, BookOpen];
            const Icon = icons[index] ?? ListChecks;
            const img = exploreIcons[e.title];
            return (
            <div
              key={e.title}
              className="flex min-h-[64px] items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                {img ? (
                  <img src={img} alt="" className="size-6 object-contain" loading="lazy" />
                ) : (
                  <Icon className="size-5 text-foreground" strokeWidth={1.8} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-bold text-foreground">
                  {e.title}
                </span>
                <span className="mt-0.5 block truncate text-[10px] font-bold text-muted-foreground">
                  {e.desc}
                </span>
              </span>
              <ChevronRight className="size-4 text-foreground" />
            </div>
          )})}
        </div>
        <div className="mt-3.5 border-t border-border pt-3">
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="mx-auto flex items-center gap-1.5"
          >
            <span className="text-[12px] font-bold text-foreground">
              {moreOpen ? "Explore Less" : "Explore More"}
            </span>
            <ChevronDown
              className={`size-4 text-foreground transition-transform ${moreOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </section>

      <div className="h-2 bg-muted" />

      <section className="bg-card px-4 py-10">
        <p className="max-w-[280px] text-[15px] font-bold leading-relaxed text-muted-foreground">
          Padhlo chahe kahi se, manzil milegi yahi se...
        </p>
        <p className="mt-3 text-[12px] font-bold text-muted-foreground">
          ❤️ From PhysicsWallah
        </p>
      </section>

    </PageShell>
  );
}
