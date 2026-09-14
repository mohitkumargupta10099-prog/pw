import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  PlayCircle,
} from "lucide-react";
import { scheduleDetails } from "@/lib/pw-api.functions";

export const Route = createFileRoute("/lecture/$batchId/$subjectId/$scheduleId")({
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
  const router = useRouter();
  const getSchedule = useServerFn(scheduleDetails);

  const q = useQuery({
    queryKey: ["schedule", batchId, subjectId, scheduleId],
    queryFn: () => getSchedule({ data: { batchId, subjectId, scheduleId } }),
    staleTime: 5 * 60_000,
  });
  const d = q.data;

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-10">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-card px-3 py-2.5">
        <button aria-label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-5 text-foreground" strokeWidth={2.4} />
        </button>
        <h1 className="flex-1 truncate text-[13px] font-bold text-foreground">
          {d?.topic ?? "Lecture"}
        </h1>
      </header>

      {q.isPending && <div className="m-3 h-44 animate-pulse rounded-xl bg-card" />}

      {d && (
        <div className="space-y-3 px-3 py-3">
          <div className="overflow-hidden rounded-xl bg-black">
            {d.videoUrl ? (
              <video src={d.videoUrl} controls poster={d.image} className="aspect-video w-full" />
            ) : d.image ? (
              <div className="relative">
                <img src={d.image} alt={d.topic} className="aspect-video w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/45">
                  <PlayCircle className="size-10 text-white" />
                </span>
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center">
                <PlayCircle className="size-10 text-white/80" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[13px] font-bold text-foreground">{d.topic}</p>
            <p className="mt-1 text-[11px] font-bold text-muted-foreground">
              {d.status || "Lecture"}
              {d.date
                ? ` • ${new Date(d.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}`
                : ""}
              {d.duration ? ` • ${d.duration}` : ""}
            </p>
            {!d.videoUrl && (
              <p className="mt-2 rounded-lg bg-secondary px-2.5 py-2 text-[11px] font-bold text-primary">
                Video stream is not available for this lecture right now.
              </p>
            )}
          </div>

          {d.notes.length > 0 && (
            <>
              <p className="px-1 text-[12px] font-bold text-foreground">Notes</p>
              {d.notes.map((n) => (
                <Link
                  key={n.id}
                  to="/pdf/$batchId/$subjectId/$scheduleId"
                  params={{ batchId, subjectId, scheduleId }}
                  search={{ hw: n.homeworkId }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <FileText className="size-5 text-primary" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-foreground">
                      {n.title}
                    </span>
                    <span className="block truncate text-[11px] font-bold text-muted-foreground">
                      {n.name}
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </>
          )}

          {d.quizzes.length > 0 && (
            <>
              <p className="px-1 text-[12px] font-bold text-foreground">DPP Quiz</p>
              {d.quizzes.map((qz) => (
                <Link
                  key={qz.id}
                  to="/quiz/$testId"
                  params={{ testId: qz.id }}
                  className="block rounded-xl border border-border bg-card p-3"
                >
                  <p className="text-[13px] font-bold text-foreground">{qz.name}</p>
                  <p className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-foreground">
                    <ClipboardList className="size-3.5" /> {qz.totalQuestions} Questions |{" "}
                    {qz.totalMarks} Marks | {qz.maxDuration} Mins
                  </p>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
