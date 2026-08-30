import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { subjectTopics } from "@/lib/pw-api.functions";

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
  const { data, isPending } = useQuery({
    queryKey: ["topics", batchId, subjectId],
    queryFn: () => getTopics({ data: { batchId, subjectId } }),
    staleTime: 10 * 60_000,
  });

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-10">
      <header className="sticky top-0 z-20 bg-card">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button aria-label="Back" onClick={() => router.history.back()}>
            <ChevronLeft className="size-5 text-foreground" strokeWidth={2.4} />
          </button>
          <h1 className="flex-1 text-[14px] font-bold text-foreground">All Chapters</h1>
          <Search className="size-4 text-foreground" />
        </div>
      </header>

      <div className="space-y-2.5 px-3 py-3">
        {isPending &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-card" />
          ))}
        {data?.map((t, i) => (
          <Link
            key={t.id}
            to="/chapter/$batchId/$subjectId/$chapterId"
            params={{ batchId, subjectId, chapterId: t.id }}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-[12px] font-bold text-primary">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold text-foreground">
                {t.name}
              </span>
              <span className="mt-0.5 block text-[11px] font-bold text-muted-foreground">
                {t.videos} Videos • {t.notes} Notes • {t.exercises} DPP
              </span>
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
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
