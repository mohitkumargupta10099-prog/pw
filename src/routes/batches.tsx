import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Menu,
  Search,
  ChevronRight,
  SlidersHorizontal,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { listBatches, type BatchCard } from "@/lib/pw-api.functions";
import { enroll, useEnrolled } from "@/lib/enrollment";

export const Route = createFileRoute("/batches")({
  head: () => ({
    meta: [
      { title: "Batches - PW Learn" },
      {
        name: "description",
        content: "Browse JEE, NEET, Class 10 and Class 12 batches and enroll instantly.",
      },
      { property: "og:title", content: "Batches - PW Learn" },
      {
        property: "og:description",
        content: "Browse JEE, NEET, Class 10 and Class 12 batches and enroll instantly.",
      },
    ],
  }),
  component: BatchesPage,
});

const categories = ["JEE", "NEET", "Class 10", "Class 12", "GATE"];
const filters = ["All Filters", "Online", "Offline", "Power Batch", "State Board"];

function BatchesPage() {
  const [category, setCategory] = useState(categories[0]!);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState<string | null>(null);
  const enrolled = useEnrolled();
  const fetchBatches = useServerFn(listBatches);

  const { data, isPending } = useQuery({
    queryKey: ["batches", category, search, page],
    queryFn: () => fetchBatches({ data: { category, search, page } }),
    staleTime: 5 * 60_000,
  });

  function onEnroll(b: BatchCard) {
    enroll({
      id: b.id,
      name: b.name,
      byName: b.byName,
      image: b.image,
      language: b.language,
      startDate: b.startDate,
      endDate: b.endDate,
      fee: b.fee,
    });
    setPopup(b.name);
  }

  return (
    <PageShell>
      <div className="sticky top-0 z-20 bg-card">
        <div className="flex items-center gap-2.5 px-3 pb-2 pt-3">
          <Menu className="size-5 shrink-0 text-foreground" strokeWidth={2.2} />
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search for batches"
              className="w-full bg-transparent text-[12px] font-bold outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={
                c === category
                  ? "shrink-0 rounded-full bg-foreground px-4 py-1.5 text-[12px] font-bold text-background"
                  : "shrink-0 rounded-full border border-border px-4 py-1.5 text-[12px] font-bold text-foreground"
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-border px-3 py-2">
          {filters.map((f, i) => (
            <button
              key={f}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-bold text-foreground"
            >
              {f}
              {i === 0 && <SlidersHorizontal className="size-3" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 bg-muted px-3 py-3">
        {isPending &&
          [0, 1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-card" />
          ))}

        {data?.items.map((b) => {
          const already = enrolled.some((e) => e.id === b.id);
          return (
            <article
              key={b.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              {b.image ? (
                <img
                  src={b.image}
                  alt={b.name}
                  loading="lazy"
                  className="h-[150px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[110px] items-center justify-center bg-secondary px-4 text-center">
                  <p className="text-[16px] font-extrabold uppercase text-primary">
                    {b.name}
                  </p>
                </div>
              )}

              <div className="px-3.5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[12px] font-bold text-tag">{category}</span>
                  <span className="rounded-md border border-border px-2 py-0.5 text-[9px] font-bold uppercase text-foreground">
                    {b.language}
                  </span>
                </div>
                <h3 className="mt-1.5 text-[14px] font-bold leading-snug text-foreground">
                  {b.name}
                </h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-foreground">
                  <BookOpen className="size-3.5" /> {b.byName || "PW Batch"}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-foreground">
                  <span className="size-1.5 rounded-full bg-destructive" />
                  Ongoing <span className="text-muted-foreground">|</span> Started on{" "}
                  {b.startDate}
                </p>

                <div className="mt-3 flex items-center gap-2.5">
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-foreground">
                      ₹{b.fee.toLocaleString("en-IN")}{" "}
                      <span className="text-[11px] font-bold text-muted-foreground line-through">
                        ₹{Math.round(b.fee * 1.6).toLocaleString("en-IN")}
                      </span>
                    </p>
                    <p className="text-[11px] font-bold text-success">38% OFF</p>
                  </div>
                  <button
                    onClick={() => onEnroll(b)}
                    disabled={already}
                    className={
                      already
                        ? "rounded-xl border border-success px-4 py-2.5 text-[12px] font-bold text-success"
                        : "rounded-xl bg-foreground px-5 py-2.5 text-[12px] font-bold text-background"
                    }
                  >
                    {already ? "Enrolled" : "Enroll"}
                  </button>
                  <Link
                    to="/batch/$batchId"
                    params={{ batchId: b.id }}
                    aria-label="Batch details"
                    className="rounded-xl border border-border p-2.5"
                  >
                    <ChevronRight className="size-4 text-foreground" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}

        {data?.hasMore && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full rounded-xl border border-border bg-card py-3 text-[12px] font-bold text-primary"
          >
            Load more batches
          </button>
        )}
        {data && data.items.length === 0 && (
          <p className="py-20 text-center text-[12px] font-bold text-muted-foreground">
            No batches found
          </p>
        )}
      </div>

      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
          <button
            aria-label="Close"
            onClick={() => setPopup(null)}
            className="absolute inset-0 bg-foreground/50"
          />
          <div className="relative w-full max-w-xs rounded-2xl bg-card p-5 text-center shadow-xl">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-9 text-success" strokeWidth={2.2} />
            </span>
            <p className="mt-3 text-[15px] font-extrabold text-foreground">
              Enrolled Successfully!
            </p>
            <p className="mt-1 text-[11px] font-bold text-muted-foreground">{popup}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setPopup(null)}
                className="rounded-xl bg-secondary py-2.5 text-[12px] font-bold text-primary"
              >
                Keep Browsing
              </button>
              <Link
                to="/my-batches"
                className="rounded-xl bg-primary py-2.5 text-[12px] font-bold text-primary-foreground"
              >
                My Batches
              </Link>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
