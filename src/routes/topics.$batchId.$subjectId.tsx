import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { batchDetails, subjectTopics } from "@/lib/pw-api.functions";

export const Route = createFileRoute("/topics/$batchId/$subjectId")({
  head: () => ({
    meta: [
      { title: "Chapters - PW Learn" },
      { name: "description", content: "All chapters of your batch subject." },
      { property: "og:title", content: "Chapters - PW Learn" },
      { property: "og:description", content: "All chapters of your batch subject." },
    ],
  }),
  component: TopicsPage,
});

function TopicsPage() {
  const { batchId, subjectId } = Route.useParams();
  const router = useRouter();
  const getTopics = useServerFn(subjectTopics);
  const getDetails = useServerFn(batchDetails);
  const { data, isPending } = useQuery({
    queryKey: ["topics", batchId, subjectId],
    queryFn: () => getTopics({ data: { batchId, subjectId } }),
    staleTime: 10 * 60_000,
  });
  const details = useQuery({
    queryKey: ["batch-details", batchId],
    queryFn: () => getDetails({ data: { batchId } }),
    staleTime: 10 * 60_000,
  });
  const subjectName = details.data?.subjects.find((subject) => subject.id === subjectId)?.name;

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-background pb-10">
      <header className="sticky top-0 z-20 bg-card">
        <div className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5">
          <button aria-label="Back" onClick={() => router.history.back()}>
            <ChevronLeft className="size-6 text-foreground" strokeWidth={2.6} />
          </button>
          <h1 className="truncate text-[16px] font-extrabold text-foreground">
            {subjectName ?? "Chapters"}
          </h1>
          <span className="w-6" />
        </div>
      </header>

      <div className="space-y-5 px-4 py-5">
        {isPending &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[76px] animate-pulse rounded-lg bg-muted" />
          ))}
        {data?.map((t, i) => (
          <Link
            key={t.id}
            to="/chapter/$batchId/$subjectId/$chapterId"
            params={{ batchId, subjectId, chapterId: t.id }}
            className="grid min-h-[76px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-extrabold text-foreground">
                {t.name}
              </span>
              <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">
                {t.videos} Videos • {t.notes} Notes • {t.exercises} DPP
              </span>
            </span>
            <ChevronRight className="size-5 text-foreground" strokeWidth={2.4} />
          </Link>
        ))}
        {data?.length === 0 && (
          <p className="py-20 text-center text-[12px] font-bold text-muted-foreground">
            No chapters found
          </p>
        )}
      </div>
    </div>
  );
}
