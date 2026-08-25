import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-screen-sm bg-muted pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
