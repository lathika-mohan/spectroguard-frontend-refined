import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutGrid,
  Siren,
  FolderSearch,
  HeartPulse,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react"

const items = [
  { to: "/dashboard", label: "Live Grid", icon: LayoutGrid },
  { to: "/alerts", label: "Alert Feed", icon: Siren },
  { to: "/forensics/evt-88213", label: "Forensics", icon: FolderSearch },
  { to: "/health", label: "Worker Health", icon: HeartPulse },
  { to: "/settings", label: "Thresholds", icon: SlidersHorizontal },
]

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-hairline bg-panel md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <ShieldCheck className="h-5 w-5 text-live" strokeWidth={1.75} />
        <span className="font-display text-sm font-semibold tracking-wide text-ink">
          SENTRY<span className="text-live">SOC</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-panel-raised text-ink"
                  : "text-ink-dim hover:bg-panel-raised/60 hover:text-ink"
              )
            }
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-hairline px-5 py-4 font-mono text-[11px] text-ink-faint">
        node: iad-sentry-04
        <br />
        build: 2026.07.24-rc3
      </div>
    </aside>
  )
}
