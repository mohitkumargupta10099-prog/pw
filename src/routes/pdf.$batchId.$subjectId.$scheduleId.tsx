import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, Download, FileText } from "lucide-react";
import { scheduleDetails } from "@/lib/pw-api.functions";

export const Route = createFileRoute("/pdf/$batchId/$subjectId/$scheduleId")({
  validateSearch: (search: Record<string, unknown>) => ({
    hw: typeof search["hw"] === "string" ? (search["hw"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Notes PDF - PW Learn" },
      { name: "description", content: "Read chapter notes and DPP PDFs inside the app." },
      { property: "og:title", content: "Notes PDF - PW Learn" },
      {
        property: "og:description",
        content: "Read chapter notes and DPP PDFs inside the app.",
      },
    ],
  }),
  component: PdfPage,
});

function PdfPage() {
  const { batchId, subjectId, scheduleId } = Route.useParams();
  const { hw } = Route.useSearch();
  const router = useRouter();
  const getSchedule = useServerFn(scheduleDetails);

  const q = useQuery({
    queryKey: ["schedule", batchId, subjectId, scheduleId],
    queryFn: () => getSchedule({ data: { batchId, subjectId, scheduleId } }),
    staleTime: 5 * 60_000,
  });

  const notes = q.data?.notes ?? [];
  const note = (hw ? notes.find((n) => n.homeworkId === hw || n.id === hw) : notes[0]) ?? notes[0];

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm flex-col bg-muted">
      <header className="sticky top-0 z-20 flex items-center gap-2 bg-card px-3 py-2.5">
        <button aria-label="Back" onClick={() => router.history.back()}>
          <ChevronLeft className="size-5 text-foreground" strokeWidth={2.4} />
        </button>
        <h1 className="flex-1 truncate text-[13px] font-bold text-foreground">
          {note?.title ?? "Notes"}
        </h1>
        {note?.url && (
          <a href={note.url} target="_blank" rel="noreferrer" aria-label="Download PDF">
            <Download className="size-4.5 text-primary" />
          </a>
        )}
      </header>

      {q.isPending && <div className="m-3 h-96 animate-pulse rounded-xl bg-card" />}

      {!q.isPending && note?.url && (
        <>
          <iframe
            title={note.title}
            src={note.url}
            className="min-h-[78vh] w-full flex-1 bg-card"
          />
          <a
            href={note.url}
            target="_blank"
            rel="noreferrer"
            className="m-3 rounded-xl bg-primary py-2.5 text-center text-[12px] font-bold text-primary-foreground"
          >
            Open PDF in new tab
          </a>
        </>
      )}

      {!q.isPending && !note?.url && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24">
          <FileText className="size-8 text-muted-foreground" />
          <p className="text-[12px] font-bold text-muted-foreground">PDF not available</p>
        </div>
      )}
    </div>
  );
}
