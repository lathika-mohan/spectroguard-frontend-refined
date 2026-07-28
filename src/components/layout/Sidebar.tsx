import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const navItems = [
    { to: "/dashboard", label: "MONITORING MATRIX" },
    { to: "/alerts", label: "FORENSIC INCIDENTS" }, // FIX: Replaced hardcoded dynamic route /forensics/evt-88213
    { to: "/health", label: "NODE STATUS" },
    { to: "/settings", label: "CALIBRATION" },
  ];

  return (
    <aside className="w-64 border-r border-hairline bg-panel flex flex-col justify-between p-4 min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <div className="h-3 w-3 rounded-full bg-[var(--color-live)] animate-pulse" />
          <span className="font-display font-bold tracking-wider text-sm">SPECTRAGUARD</span>
        </div>
        
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-xs font-mono tracking-wider rounded transition-colors uppercase",
                  isActive
                    ? "bg-accent text-ink"
                    : "text-ink-dim hover:bg-accent/50 hover:text-ink"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-hairline pt-4 px-2 space-y-1">
        <p className="text-[10px] font-mono text-ink-dim uppercase">NODE: iad-sentry-04</p>
        <p className="text-[10px] font-mono text-ink-dim uppercase">BUILD: 2026.07.24-rc3</p>
      </div>
    </aside>
  );
}
