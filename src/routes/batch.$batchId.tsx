import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  MessageCircle,
  MoreVertical,
  RotateCcw,
  CalendarDays,
  ClipboardList,
} from "lucide-react";
import {
  batchAnnouncements,
  batchDetails,
  batchTests,
  communityPosts,
} from "@/lib/pw-api.functions";
import xpIcon from "@/assets/xp.png.asset.json";

export const Route = createFileRoute("/batch/$batchId")({
  head: () => ({
    meta: [
      { title: "Batch - PW Learn" },
      {
        name: "description",
        content: "Subjects, resources, tests and community of your enrolled batch.",
      },
      { property: "og:title", content: "Batch - PW Learn" },
      {
        property: "og:description",
        content: "Subjects, resources, tests and community of your enrolled batch.",
      },
    ],
  }),
  component: BatchPage,
});

const tabs = ["Announcement", "Subjects", "Resources", "Tests", "Community"] as const;
type Tab = (typeof tabs)[number];

const subjectColors: Record<string, string> = {};
function shortOf(name: string) {
  return name.slice(0, 2);
}

function BatchPage() {
  const { batchId } = Route.useParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Subjects");

  const getDetails = useServerFn(batchDetails);
  const getTests = useServerFn(batchTests);
  const getAnnouncements = useServerFn(batchAnnouncements);
  const getCommunity = useServerFn(communityPosts);

  const details = useQuery({
    queryKey: ["batch-details", batchId],
    queryFn: () => getDetails({ data: { batchId } }),
    staleTime: 10 * 60_000,
  });
  const tests = useQuery({
    queryKey: ["batch-tests", batchId],
    queryFn: () => getTests({ data: { batchId } }),
    enabled: tab === "Tests",
  });
  const announcements = useQuery({
    queryKey: ["batch-ann", batchId],
    queryFn: () => getAnnouncements({ data: { batchId } }),
    enabled: tab === "Announcement",
  });
  const community = useQuery({
    queryKey: ["batch-community", batchId],
    queryFn: () => getCommunity({ data: { batchId } }),
    enabled: tab === "Community",
  });

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-10">
      <header className="sticky top-0 z-30 bg-card">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button aria-label="Back" onClick={() => router.history.back()}>
            <ChevronLeft className="size-5 text-foreground" strokeWidth={2.4} />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-[14px] font-bold text-foreground">
            {details.data?.name ?? "Batch"}
          </h1>
          <span className="flex items-center gap-1 rounded-full border border-border px-1.5 py-0.5">
            <img src={xpIcon.url} alt="XP" className="size-3.5 object-contain" />
            <span className="text-[11px] font-bold text-foreground">0</span>
          </span>
          <MessageCircle className="size-4 text-foreground" />
          <Bell className="size-4 text-foreground" />
          <MoreVertical className="size-4 text-foreground" />
        </div>
        <div className="no-scrollbar flex gap-5 overflow-x-auto border-b border-border px-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                t === tab
                  ? "shrink-0 border-b-[3px] border-primary pb-2 text-[13px] font-bold text-primary"
                  : "shrink-0 border-b-[3px] border-transparent pb-2 text-[13px] font-bold text-foreground"
              }
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {tab === "Subjects" && (
        <div className="px-3 py-3">
          <div className="rounded-lg bg-[#fdf6e6] px-3 py-2.5 text-[11px] font-bold text-foreground">
            Completion % depends on lecture and DPP progress!
          </div>
          <div className="mt-3 space-y-2.5">
            {details.isPending &&
              [0, 1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-card" />
              ))}
            {details.data?.subjects.map((s) => (
              <Link
                key={s.id}
                to="/topics/$batchId/$subjectId"
                params={{ batchId, subjectId: s.id }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
              >
                <span
                  className="flex size-11 items-center justify-center rounded-xl bg-secondary text-[13px] font-bold text-primary"
                  style={{ color: subjectColors[s.name] }}
                >
                  {shortOf(s.name)}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-foreground">
                  {s.name}
                </span>
                <span className="text-right">
                  <span className="block text-[11px] font-bold text-foreground">0%</span>
                  <span className="mt-1 block h-1.5 w-14 rounded-full bg-muted" />
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab === "Announcement" && (
        <div className="space-y-2.5 px-3 py-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[13px] font-bold text-foreground">
              {details.data?.name}
            </p>
            <p className="mt-1 text-[11px] font-bold text-muted-foreground">
              {details.data?.byName} • {details.data?.language}
            </p>
          </div>
          <p className="px-1 pt-1 text-[12px] font-bold text-foreground">Announcements</p>
          {announcements.data?.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-3">
              <p className="text-[12px] font-bold text-foreground">{a.text}</p>
              <p className="mt-1 text-[10px] font-bold text-muted-foreground">
                {a.author} • {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {announcements.data?.length === 0 && (
            <p className="py-10 text-center text-[12px] font-bold text-muted-foreground">
              No announcements
            </p>
          )}
        </div>
      )}

      {tab === "Resources" && (
        <div className="px-3 py-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-bold text-primary">
              RE - 01
            </span>
            <p className="mt-2 flex items-center gap-2 text-[13px] font-bold text-foreground">
              <FileText className="size-4" /> Lecture Planner || Only PDF
            </p>
            <p className="mt-1 text-[11px] font-bold text-muted-foreground">1 Note</p>
          </div>
        </div>
      )}

      {tab === "Tests" && (
        <div className="space-y-3 px-3 py-3">
          {tests.isPending &&
            [0, 1].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl bg-card" />
            ))}
          {tests.data?.map((t) => (
            <article key={t.id} className="rounded-xl border border-border bg-card">
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      t.tag1 === "Missed"
                        ? "rounded-md bg-destructive/10 px-2 py-0.5 text-[11px] font-bold text-destructive"
                        : "rounded-md bg-[#fdf3e0] px-2 py-0.5 text-[11px] font-bold text-[#a86b12]"
                    }
                  >
                    {t.tag1 || "Upcoming"}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">|</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                    Earn upto {t.totalMarks}
                    <img src={xpIcon.url} alt="XP" className="size-3.5" />
                  </span>
                </div>
                <h3 className="mt-2 text-[13px] font-bold text-foreground">{t.name}</h3>
                <div className="mt-2 flex items-start gap-3">
                  <div className="flex-1 space-y-1.5">
                    <p className="flex items-center gap-2 text-[11px] font-bold text-foreground">
                      <ClipboardList className="size-3.5" /> {t.totalQuestions} Questions
                      | {t.totalMarks} Marks | {t.maxDuration} Mins
                    </p>
                    <p className="flex items-center gap-2 text-[11px] font-bold text-foreground">
                      <CalendarDays className="size-3.5" /> Held on{" "}
                      {t.startTime
                        ? new Date(t.startTime).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </p>
                    <p className="flex items-center gap-2 text-[11px] font-bold text-foreground">
                      <RotateCcw className="size-3.5" /> Attempts : {t.attempts}
                    </p>
                  </div>
                  <div className="flex w-14 flex-col items-center gap-1">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ChevronRight className="size-4" />
                    </span>
                    <span className="text-[11px] font-bold text-primary">
                      {t.tag2 || "Start"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-border py-2.5 text-center text-[12px] font-bold text-foreground">
                View Syllabus
              </div>
            </article>
          ))}
          {tests.data?.length === 0 && (
            <p className="py-16 text-center text-[12px] font-bold text-muted-foreground">
              No tests available
            </p>
          )}
        </div>
      )}

      {tab === "Community" && (
        <div className="space-y-2.5 py-2">
          <p className="px-3 text-[12px] font-bold text-foreground">
            {community.data?.channel ?? "Student Discussion Channel"}
          </p>
          {community.isPending &&
            [0, 1].map((i) => (
              <div key={i} className="mx-3 h-24 animate-pulse rounded-xl bg-card" />
            ))}
          {community.data?.posts.map((p) => (
            <div key={p.id} className="bg-card px-3 py-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-primary">
                  {p.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="flex-1 text-[12px] font-bold text-foreground">
                  {p.name}
                </span>
                <MoreVertical className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-[12px] font-bold text-foreground">{p.text}</p>
              <div className="mt-2 flex items-center gap-4 border-t border-border pt-2 text-[11px] font-bold text-muted-foreground">
                <span>❤️ React</span>
                <span>💬 Comments({p.comments})</span>
                <span className="ml-auto flex items-center gap-1">
                  <Eye className="size-3.5" /> {p.views}
                </span>
              </div>
            </div>
          ))}
          {community.data?.posts.length === 0 && (
            <p className="py-16 text-center text-[12px] font-bold text-muted-foreground">
              No posts yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
