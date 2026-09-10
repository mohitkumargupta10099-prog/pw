import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Maximize2,
} from "lucide-react";
import { batchDetails, scheduleDetails } from "@/lib/pw-api.functions";

export const Route = createFileRoute("/lecture/$batchId/$subjectId/$scheduleId")({
  validateSearch: (search: Record<string, unknown>) => ({
    topic: typeof search["topic"] === "string" ? (search["topic"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Lecture - PW Learn" },
      {
        name: "description",
        content: "Watch the lecture and open its notes and DPP quizzes.",
      },
      { property: "og:title", content: "Lecture - PW Learn" },
      {
        property: "og:description",
        content: "Watch the lecture and open its notes and DPP quizzes.",
      },
    ],
  }),
  component: LecturePage,
});

function LecturePage() {
  const { batchId, subjectId, scheduleId } = Route.useParams();
  const { topic } = Route.useSearch();
  const router = useRouter();
  const getSchedule = useServerFn(scheduleDetails);
  const getBatch = useServerFn(batchDetails);

  const q = useQuery({
    queryKey: ["schedule", batchId, subjectId, scheduleId],
    queryFn: () => getSchedule({ data: { batchId, subjectId, scheduleId } }),
    staleTime: 5 * 60_000,
  });
  const batch = useQuery({
    queryKey: ["batch", batchId],
    queryFn: () => getBatch({ data: { batchId } }),
    staleTime: 10 * 60_000,
  });
  const d = q.data;

  const subjectSlug =
    batch.data?.subjects.find((s) => s.id === subjectId)?.slug ?? subjectId;

  const playerUrl =
    `https://www.learnxpw.site/watch?batchId=${encodeURIComponent(batchId)}` +
    `&SubjectId=${encodeURIComponent(subjectSlug)}` +
    `&ChildId=${encodeURIComponent(scheduleId)}` +
    `&Type=penpencilvdo&VideoUrl=${encodeURIComponent(d?.videoUrl ?? "")}` +
    `&isLocked=true&topicId=${encodeURIComponent(topic || "")}`;

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-background pb-10">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card px-3 py-2.5">
        <button aria-label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-5 text-foreground" strokeWidth={2.6} />
        </button>
        <h1 className="flex-1 truncate text-[13px] font-extrabold text-foreground">
          {d?.topic ?? "Lecture"}
        </h1>
      </header>

      <div className="bg-black">
        <div className="relative aspect-video w-full">
          <iframe
            key={playerUrl}
            src={playerUrl}
            title={d?.topic ?? "Lecture player"}
            className="absolute inset-0 size-full border-0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="space-y-3 px-3 py-3">
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <p className="text-[13px] font-extrabold leading-4 text-foreground">
            {d?.topic ?? "Lecture"}
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-muted-foreground">
            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-primary">
              {d?.status || "Lecture"}
            </span>
            {d?.date && (
              <span>
                {new Date(d.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            {d?.duration && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> {d.duration}
              </span>
            )}
          </p>
          <a
            href={playerUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-[11px] font-extrabold text-primary-foreground"
          >
            <Maximize2 className="size-3.5" /> Open Player in New Tab
          </a>
        </div>

        {q.isPending && <div className="h-16 animate-pulse rounded-xl bg-card" />}

        {d && d.notes.length > 0 && (
          <>
            <p className="px-1 text-[11px] font-extrabold text-foreground">Notes</p>
            {d.notes.map((n) => (
              <Link
                key={n.id}
                to="/pdf/$batchId/$subjectId/$scheduleId"
                params={{ batchId, subjectId, scheduleId }}
                search={{ hw: n.homeworkId }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 shadow-sm"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="size-4 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-extrabold text-foreground">
                    {n.title}
                  </span>
                  <span className="block truncate text-[10px] font-bold text-muted-foreground">
                    {n.name}
                  </span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </>
        )}

        {d && d.quizzes.length > 0 && (
          <>
            <p className="px-1 text-[11px] font-extrabold text-foreground">DPP Quiz</p>
            {d.quizzes.map((qz) => (
              <Link
                key={qz.id}
                to="/quiz/$testId"
                params={{ testId: qz.id }}
                className="block rounded-xl border border-border bg-card p-3 shadow-sm"
              >
                <p className="text-[12px] font-extrabold text-foreground">{qz.name}</p>
                <p className="mt-1.5 flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                  <ClipboardList className="size-3.5" /> {qz.totalQuestions} Questions |{" "}
                  {qz.totalMarks} Marks | {qz.maxDuration} Mins
                </p>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
