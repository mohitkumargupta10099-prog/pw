import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ClipboardList, Clock, Languages } from "lucide-react";
import { testInstructions } from "@/lib/pw-api.functions";

export const Route = createFileRoute("/quiz/$testId")({
  head: () => ({
    meta: [
      { title: "Test Instructions - PW Learn" },
      { name: "description", content: "Read the instructions before starting the test." },
      { property: "og:title", content: "Test Instructions - PW Learn" },
      {
        property: "og:description",
        content: "Read the instructions before starting the test.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { testId } = Route.useParams();
  const router = useRouter();
  const getInstructions = useServerFn(testInstructions);

  const q = useQuery({
    queryKey: ["test-instructions", testId],
    queryFn: () => getInstructions({ data: { testId } }),
    staleTime: 5 * 60_000,
  });
  const t = q.data;

  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-10">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-card px-3 py-2.5">
        <button aria-label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-5 text-foreground" strokeWidth={2.4} />
        </button>
        <h1 className="flex-1 truncate text-[13px] font-bold text-foreground">
          {t?.name ?? "Test"}
        </h1>
      </header>

      {q.isPending && <div className="m-3 h-40 animate-pulse rounded-xl bg-card" />}

      {!q.isPending && !t && (
        <p className="py-24 text-center text-[12px] font-bold text-muted-foreground">
          Instructions not available
        </p>
      )}

      {t && (
        <div className="space-y-3 px-3 py-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[13px] font-bold text-foreground">{t.name}</p>
            <p className="mt-2 flex items-center gap-2 text-[11px] font-bold text-foreground">
              <ClipboardList className="size-3.5" /> {t.totalQuestions} Questions |{" "}
              {t.totalMarks} Marks
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-foreground">
              <Clock className="size-3.5" /> Duration {t.maxDuration} Mins
            </p>
            {t.languages.length > 0 && (
              <p className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-foreground">
                <Languages className="size-3.5" /> {t.languages.join(", ")}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[12px] font-bold text-foreground">Instructions</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[11px] font-bold text-muted-foreground">
              <li>Total {t.totalQuestions} questions in {t.maxDuration} minutes.</li>
              <li>Each question carries marks as per the marking scheme.</li>
              <li>Do not refresh or close the app while attempting.</li>
              <li>Submit before the timer ends, else auto-submit will happen.</li>
            </ul>
          </div>

          <button
            disabled
            className="w-full rounded-xl bg-primary/60 py-2.5 text-[12px] font-bold text-primary-foreground"
          >
            Attempt requires login
          </button>
        </div>
      )}
    </div>
  );
}
