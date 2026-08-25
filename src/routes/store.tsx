import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { TopBar } from "@/components/TopBar";

const items = [
  { name: "NCERT Handbook - Biology", price: 349 },
  { name: "Physics Module Set", price: 899 },
  { name: "Chemistry Formula Book", price: 249 },
  { name: "PW Notebook Combo", price: 199 },
];

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "PW Store - PW Learn" },
      {
        name: "description",
        content: "Books, modules and study material available in the store.",
      },
      { property: "og:title", content: "PW Store - PW Learn" },
      {
        property: "og:description",
        content: "Books, modules and study material available in the store.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <TopBar />
      <section className="bg-card px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground">PW Store</h1>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {items.map((i) => (
            <div key={i.name} className="rounded-xl border border-border p-3">
              <div className="flex h-24 items-center justify-center rounded-lg bg-secondary text-3xl">
                📚
              </div>
              <p className="mt-3 text-[14px] font-semibold text-foreground">{i.name}</p>
              <p className="mt-1 text-[15px] font-bold text-foreground">₹{i.price}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  ),
});
