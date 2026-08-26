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
import {
  enrolledBatches,
  exploreItems,
  exploreMore,
  quickAccess,
} from "@/lib/app-data";

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
  const [batchId, setBatchId] = useState(enrolledBatches[0]?.id ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [slide, setSlide] = useState(0);


  return (
    <PageShell>
      <TopBar />

      <section className="relative border-b border-border bg-card">
        {enrolledBatches.length === 0 ? (
          <Link to="/batches" className="flex h-[48px] items-center justify-between px-4 text-[14px] font-bold text-foreground">
            Explore Batches
            <ChevronRight className="size-5" />
          </Link>
        ) : (
          <button
            onClick={() => setPickerOpen(true)}
            className="flex h-[48px] w-full items-center gap-2 px-4 text-left"
          >
            <span className="truncate text-[15px] font-bold text-foreground">
              {enrolledBatches.find((batch) => batch.id === batchId)?.name}
            </span>
            <ChevronDown className="size-5 shrink-0 text-foreground" strokeWidth={2.5} />
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
          <div className="relative mx-auto w-full max-w-screen-sm rounded-t-2xl bg-card pb-6 pt-3">
            <button
              aria-label="Close"
              onClick={() => setPickerOpen(false)}
              className="absolute -top-14 left-1/2 flex size-11 -translate-x-1/2 items-center justify-center rounded-full bg-card shadow-md"
            >
              <X className="size-6 text-foreground" strokeWidth={2.4} />
            </button>
            <div className="mx-auto h-1 w-10 rounded-full bg-border" />
            <p className="mt-3 text-center text-[18px] font-bold text-foreground">
              Select an Option
            </p>
            <p className="mt-3 border-b border-border px-4 pb-1.5 text-[13px] font-bold text-primary">
              Enrolled Batches
            </p>
            <div className="max-h-[45vh] overflow-y-auto">
              {enrolledBatches.map((batch) => {
                const active = batch.id === batchId;
                return (
                  <button
                    key={batch.id}
                    onClick={() => { setBatchId(batch.id); setPickerOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-4 text-left ${active ? "bg-secondary" : ""}`}
                  >
                    <span className="text-[14px] font-bold text-foreground">{batch.name}</span>
                    <span
                      className={`flex size-5 items-center justify-center rounded-full border-2 ${active ? "border-primary" : "border-border"}`}
                    >
                      {active && <span className="size-2.5 rounded-full bg-primary" />}
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
      <section className="bg-card px-4 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold text-foreground">Today&apos;s Class</h2>
          <button className="flex h-9 items-center gap-2 rounded-md border border-border px-3">
            <CalendarDays className="size-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Weekly Schedule</span>
          </button>
        </div>
        <div className="mt-5 flex h-[126px] items-center justify-center rounded-xl border border-border shadow-sm">
          <p className="text-[14px] font-bold text-foreground">No Class scheduled!</p>
        </div>
        <button className="mt-5 flex w-full items-center justify-center gap-1 py-1">
          <span className="text-[15px] font-bold text-primary">
            View All Classes
          </span>
          <ChevronRight className="size-5 text-primary" />
        </button>
      </section>

      <div className="h-2 bg-muted" />

      {/* Quick Access */}
      <section className="bg-card px-4 pb-7 pt-5">
        <h2 className="text-[18px] font-extrabold text-foreground">Quick Access</h2>
        <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-4">
          {quickAccess.map((item, index) => {
            const icons = [BookOpen, History, CircleHelp, LayoutDashboard, ClipboardCheck, CloudDownload, FileText, GraduationCap, Swords, Bookmark];
            const Icon = icons[index] ?? BookOpen;
            const inner = (
              <>
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
                  <Icon className="size-7 text-foreground" strokeWidth={1.7} />
                </span>
                <span className="mt-3 w-full truncate text-[13px] font-extrabold text-foreground">
                  {item.label}
                </span>
              </>
            );
            const cls =
              "flex aspect-[1/1.08] min-w-0 flex-col items-start justify-center rounded-xl border border-border bg-card px-3 shadow-sm";
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
      <section className="bg-card px-4 py-6">
        <h2 className="text-[18px] font-extrabold text-foreground">Explore</h2>
        <p className="mt-0.5 text-[14px] font-semibold text-muted-foreground">
          Get additional guidance with these features
        </p>
        <div className="mt-4 space-y-3">
          {[...exploreItems, ...(moreOpen ? exploreMore : [])].map((e, index) => {
            const icons = [ListChecks, Library, HandHelping, CircleHelp, BookOpen, Library];
            const Icon = icons[index] ?? ListChecks;
            return (
            <div
              key={e.title}
              className="flex min-h-[74px] items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 shadow-sm"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Icon className="size-6 text-foreground" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-extrabold text-foreground">
                  {e.title}
                </span>
                <span className="mt-0.5 block truncate text-[12px] font-bold text-muted-foreground">
                  {e.desc}
                </span>
              </span>
              <ChevronRight className="size-5 text-foreground" />
            </div>
          )})}
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

      <section className="bg-card px-4 py-14">
        <p className="max-w-[310px] text-[20px] font-extrabold leading-relaxed text-muted-foreground">
          Padhlo chahe kahi se, manzil milegi yahi se...
        </p>
        <p className="mt-4 text-[15px] font-semibold text-muted-foreground">
          ❤️ From PhysicsWallah
        </p>
      </section>
    </PageShell>
  );
}
