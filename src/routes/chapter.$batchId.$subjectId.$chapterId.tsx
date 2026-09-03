import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  PlayCircle,
} from "lucide-react";
import { chapterContents, chapterDpp } from "@/lib/pw-api.functions";

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

const tabs = ["Lectures", "Notes", "DPP", "DPP Videos", "DPP Quiz"] as const;
type Tab = (typeof tabs)[number];

const contentTypeOf: Record<
  Exclude<Tab, "DPP Quiz">,
  "LECTURES" | "NOTES" | "DPP_PDF" | "DPP_VIDEOS"
> = {
  Lectures: "LECTURES",
  Notes: "NOTES",
  DPP: "DPP_PDF",
  "DPP Videos": "DPP_VIDEOS",
};

function ChapterPage() {
  const { batchId, subjectId, chapterId } = Route.useParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Lectures");
  const getContents = useServerFn(chapterContents);
  const getDpp = useServerFn(chapterDpp);

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

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-10">
      <header className="sticky top-0 z-20 bg-card">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button aria-label="Back" onClick={() => router.history.back()}>
            <ChevronLeft className="size-5 text-foreground" strokeWidth={2.4} />
          </button>
          <h1 className="flex-1 text-[14px] font-bold text-foreground">Chapter</h1>
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

      <div className="space-y-2.5 px-3 py-3">
        {loading &&
          [0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-card" />
          ))}

        {tab !== "DPP Quiz" &&
          contents.data?.map((c) => (
            <Link
              key={c.id}
              to={
                c.kind === "video"
                  ? "/lecture/$batchId/$subjectId/$scheduleId"
                  : "/pdf/$batchId/$subjectId/$scheduleId"
              }
              params={{ batchId, subjectId, scheduleId: c.scheduleId }}
              {...(c.kind === "video" ? {} : { search: { hw: c.id } })}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
            >
              {c.kind === "video" ? (
                c.image ? (
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="h-14 w-24 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <PlayCircle className="size-6 text-primary" />
                  </span>
                )
              ) : (
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="size-5 text-primary" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold text-foreground">
                  {c.title}
                </span>
                <span className="mt-0.5 block truncate text-[11px] font-bold text-muted-foreground">
                  {c.subtitle}
                  {c.date
                    ? ` • ${new Date(c.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}`
                    : ""}
                </span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}

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
