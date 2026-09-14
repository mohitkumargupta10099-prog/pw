import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ChevronLeft,
  ClipboardList,
  Copy,
  Download,
  FileText,
  MoreVertical,
  PlayCircle,
  X,
} from "lucide-react";
import { chapterContents, chapterDpp, scheduleDetails, subjectTopics } from "@/lib/pw-api.functions";
import { downloadFile } from "@/lib/download";
import lectureFallback from "@/assets/lecture-fallback.jpg";

export const Route = createFileRoute("/chapter/$batchId/$subjectId/$chapterId")({
  head: () => ({
    meta: [
      { title: "Chapter Content - PW Learn" },
      {
        name: "description",
        content: "Lectures, notes, DPP PDFs, DPP videos and DPP quizzes of the chapter.",
      },
      { property: "og:title", content: "Chapter Content - PW Learn" },
      {
        property: "og:description",
        content: "Lectures, notes, DPP PDFs, DPP videos and DPP quizzes of the chapter.",
      },
    ],
  }),
  component: ChapterPage,
});

const tabs = ["Lectures", "Notes", "DPP", "DPP PDF", "DPP Quiz"] as const;
type Tab = (typeof tabs)[number];

const contentTypeOf: Record<
  Exclude<Tab, "DPP Quiz">,
  "LECTURES" | "NOTES" | "DPP_PDF" | "DPP_VIDEOS"
> = {
  Lectures: "LECTURES",
  Notes: "NOTES",
  DPP: "DPP_PDF",
  "DPP PDF": "DPP_VIDEOS",
};

function ChapterPage() {
  const { batchId, subjectId, chapterId } = Route.useParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Lectures");
  const getContents = useServerFn(chapterContents);
  const getDpp = useServerFn(chapterDpp);
  const getSchedule = useServerFn(scheduleDetails);
  const getTopics = useServerFn(subjectTopics);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function grabPdf(scheduleId: string, homeworkId: string, title: string) {
    if (!scheduleId) return;
    setBusyId(homeworkId);
    try {
      const d = await getSchedule({ data: { batchId, subjectId, scheduleId } });
      const notes = d?.notes ?? [];
      const note =
        notes.find((n) => n.id === homeworkId || n.homeworkId === homeworkId) ?? notes[0];
      if (note?.url) await downloadFile(note.url, note.name || title);
    } finally {
      setBusyId(null);
    }
  }

  const contents = useQuery({
    queryKey: ["contents", batchId, subjectId, chapterId, tab],
    queryFn: () =>
      getContents({
        data: {
          batchId,
          subjectId,
          chapterId,
          contentType: contentTypeOf[tab as Exclude<Tab, "DPP Quiz">],
        },
      }),
    enabled: tab !== "DPP Quiz",
    staleTime: 5 * 60_000,
  });

  const quizzes = useQuery({
    queryKey: ["dpp-quiz", batchId, subjectId, chapterId],
    queryFn: () => getDpp({ data: { batchId, subjectId, chapterId } }),
    enabled: tab === "DPP Quiz",
  });

  const loading = tab === "DPP Quiz" ? quizzes.isPending : contents.isPending;
  const topics = useQuery({
    queryKey: ["topics", batchId, subjectId],
    queryFn: () => getTopics({ data: { batchId, subjectId } }),
    staleTime: 10 * 60_000,
  });
  const chapterName = topics.data?.find((topic) => topic.id === chapterId)?.name ?? "Chapter";

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-background pb-10">
      <header className="sticky top-0 z-20 bg-card">
        <div className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5">
          <button aria-label="Back" onClick={() => router.history.back()}>
            <ChevronLeft className="size-6 text-foreground" strokeWidth={2.6} />
          </button>
          <h1 className="truncate text-[16px] font-extrabold text-foreground">{chapterName}</h1>
          <span className="w-6" />
        </div>
        <div className="no-scrollbar grid auto-cols-[minmax(5rem,1fr)] grid-flow-col overflow-x-auto border-b border-border px-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                t === tab
                  ? "shrink-0 border-b-[4px] border-primary px-2 pb-3 pt-2 text-[12px] font-extrabold text-primary"
                  : "shrink-0 border-b-[4px] border-transparent px-2 pb-3 pt-2 text-[12px] font-bold text-muted-foreground"
              }
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {tab === "Lectures" && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-secondary px-4 py-2">
          <p className="truncate text-[11px] font-semibold text-foreground">
            Earn 2 XP for every minute you watch a lecture.
          </p>
          <X className="size-4 text-foreground" />
        </div>
      )}

      <div className="space-y-3 px-4 py-3">
        {loading &&
          [0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-card" />
          ))}

        {tab !== "DPP Quiz" &&
          contents.data?.map((c) =>
            c.kind === "video" ? (
              <Link
                key={c.id}
                to="/lecture/$batchId/$subjectId/$scheduleId"
                params={{ batchId, subjectId, scheduleId: c.scheduleId }}
                className="grid min-h-[78px] grid-cols-[7rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border border-border bg-card p-1.5 shadow-sm"
              >
                <span className="relative block overflow-hidden rounded-md bg-secondary">
                  <img
                    src={c.image || lectureFallback}
                    alt={c.title}
                    loading="lazy"
                    width={1024}
                    height={576}
                    className="aspect-video w-full object-cover"
                  />
                  <PlayCircle className="absolute bottom-1 right-1 size-5 fill-primary text-primary-foreground" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[12px] font-extrabold leading-4 text-foreground">
                    {c.title}
                  </span>
                  <span className="mt-2 block truncate text-[10px] font-semibold text-muted-foreground">
                    {c.subtitle}
                    {c.date
                      ? ` • ${new Date(c.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}`
                      : ""}
                  </span>
                </span>
                <span className="flex h-full flex-col items-center justify-between py-1">
                  <MoreVertical className="size-4 text-foreground" />
                  <span className="flex items-center gap-2">
                    <Copy className="size-4 text-foreground" />
                    <Download className="size-4 text-foreground" />
                  </span>
                </span>
              </Link>
            ) : (
              <button
                key={c.id}
                type="button"
                disabled={busyId === c.id}
                onClick={() => void grabPdf(c.scheduleId, c.id, c.title)}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-2.5 text-left disabled:opacity-60"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="size-5 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-foreground">
                    {c.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] font-bold text-muted-foreground">
                    {busyId === c.id ? "Downloading..." : c.subtitle}
                    {c.date
                      ? ` • ${new Date(c.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}`
                      : ""}
                  </span>
                </span>
                <Download className="size-4 text-primary" />
              </button>
            ),
          )}


        {tab === "DPP Quiz" &&
          quizzes.data?.map((q) => (
            <article key={q.id} className="rounded-xl border border-border bg-card p-3">
              <h3 className="text-[13px] font-bold text-foreground">{q.name}</h3>
              <p className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-foreground">
                <ClipboardList className="size-3.5" /> {q.totalQuestions} Questions |{" "}
                {q.totalMarks} Marks | {q.maxDuration} Mins
              </p>
              <Link
                to="/quiz/$testId"
                params={{ testId: q.id }}
                className="mt-2.5 block w-full rounded-xl bg-primary py-2.5 text-center text-[12px] font-bold text-primary-foreground"
              >
                Start Quiz
              </Link>
            </article>
          ))}


        {!loading &&
          (tab === "DPP Quiz" ? quizzes.data?.length === 0 : contents.data?.length === 0) && (
            <p className="py-20 text-center text-[12px] font-bold text-muted-foreground">
              No content available
            </p>
          )}
      </div>
    </div>
  );
}
