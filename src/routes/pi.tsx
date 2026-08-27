import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/pi")({
  head: () => ({
    meta: [
      { title: "Pi Study Assistant - PW Learn" },
      {
        name: "description",
        content: "Pi helps you solve doubts and practice smarter every day.",
      },
      { property: "og:title", content: "Pi Study Assistant - PW Learn" },
      {
        property: "og:description",
        content: "Pi helps you solve doubts and practice smarter every day.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <TopBar />
      <section className="bg-card px-4 py-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-[20px] font-bold text-primary">
          π
        </span>
        <h1 className="mt-4 text-[17px] font-bold text-foreground">Pi</h1>
        <p className="mt-2 text-[13px] font-bold text-muted-foreground">
          Your study assistant. Ask doubts, get instant explanations.
        </p>
      </section>
    </PageShell>
  ),
});
