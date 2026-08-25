import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/offline")({
  head: () => ({
    meta: [
      { title: "Offline Centres - PW Learn" },
      {
        name: "description",
        content: "Find offline learning centres and classroom programs near you.",
      },
      { property: "og:title", content: "Offline Centres - PW Learn" },
      {
        property: "og:description",
        content: "Find offline learning centres and classroom programs near you.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <TopBar />
      <section className="bg-card px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground">Offline Centres</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Classroom programs near you
        </p>
        <div className="mt-5 space-y-3">
          {["Vidyapeeth Kota", "Vidyapeeth Patna", "Vidyapeeth Delhi"].map((c) => (
            <div
              key={c}
              className="flex items-center gap-3 rounded-xl border border-border p-3"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-xl">
                🏫
              </span>
              <span>
                <span className="block text-[15px] font-bold text-foreground">{c}</span>
                <span className="block text-[13px] text-muted-foreground">
                  Admissions open
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  ),
});
