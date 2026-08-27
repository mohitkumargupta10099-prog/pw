import { Link, useRouterState } from "@tanstack/react-router";
import { MonitorPlay, BookOpen, Building2, Store } from "lucide-react";

const items = [
  { to: "/batches", label: "Batches", Icon: MonitorPlay, badge: null as string | null },
  { to: "/", label: "Study", Icon: BookOpen, badge: null },
  { to: "/offline", label: "Offline", Icon: Building2, badge: null },
  { to: "/pi", label: "Pi", Icon: null, badge: "New" },
  { to: "/store", label: "PW Store", Icon: Store, badge: null },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-[58px] max-w-screen-sm items-stretch justify-between border-t border-border bg-card px-1 pb-[max(4px,env(safe-area-inset-bottom))] pt-1.5 shadow-sm">
      {items.map(({ to, label, Icon, badge }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className="relative flex min-w-0 flex-1 flex-col items-center gap-0.5 py-0.5"
          >
            {active && (
              <span className="absolute -top-1.5 h-0.5 w-8 rounded-full bg-foreground" />
            )}
            {badge && (
              <span className="absolute -top-0.5 right-1.5 rounded-[3px] bg-badge px-1 text-[8px] font-bold leading-3 text-badge-foreground">
                {badge}
              </span>
            )}
            {Icon ? (
              <Icon
                className={
                  active ? "size-5 text-foreground" : "size-5 text-muted-foreground"
                }
                strokeWidth={1.8}
              />
            ) : (
              <span
                className={
                  active
                    ? "flex size-5 items-center justify-center rounded-full border-[1.6px] border-foreground text-[11px] font-bold text-foreground"
                    : "flex size-5 items-center justify-center rounded-full border-[1.6px] border-muted-foreground text-[11px] font-bold text-muted-foreground"
                }
              >
                π
              </span>
            )}
            <span
              className={
                active
                  ? "truncate text-[10px] font-extrabold text-foreground"
                  : "truncate text-[10px] font-bold text-muted-foreground"
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
