import { Link, useRouterState } from "@tanstack/react-router";
import { MonitorPlay, BookOpen, Building2, Store } from "lucide-react";

const items = [
  { to: "/batches", label: "Batches", Icon: MonitorPlay, badge: null as string | null },
  { to: "/", label: "Study", Icon: BookOpen, badge: "New" },
  { to: "/offline", label: "Offline", Icon: Building2, badge: null },
  { to: "/pi", label: "Pi", Icon: null, badge: "New" },
  { to: "/store", label: "PW Store", Icon: Store, badge: null },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-screen-sm items-stretch justify-between border-t border-border bg-card px-1 pb-2 pt-2">
      {items.map(({ to, label, Icon, badge }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className="relative flex flex-1 flex-col items-center gap-1 py-1"
          >
            {active && (
              <span className="absolute -top-2 h-1 w-10 rounded-full bg-foreground" />
            )}
            {badge && (
              <span className="absolute -top-1 right-1.5 rounded-[4px] bg-badge px-1 text-[9px] font-semibold leading-4 text-badge-foreground">
                {badge}
              </span>
            )}
            {Icon ? (
              <Icon
                className={
                  active ? "size-6 text-foreground" : "size-6 text-muted-foreground"
                }
                strokeWidth={1.8}
              />
            ) : (
              <span
                className={
                  active
                    ? "flex size-6 items-center justify-center rounded-full border-[1.8px] border-foreground text-[13px] font-semibold text-foreground"
                    : "flex size-6 items-center justify-center rounded-full border-[1.8px] border-muted-foreground text-[13px] font-semibold text-muted-foreground"
                }
              >
                π
              </span>
            )}
            <span
              className={
                active
                  ? "text-[13px] font-semibold text-foreground"
                  : "text-[13px] text-muted-foreground"
              }
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
