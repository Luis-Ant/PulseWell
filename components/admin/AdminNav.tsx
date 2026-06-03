"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/teams", label: "Equipos" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/surveys", label: "Encuestas" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 rounded-xl border border-slate-800 bg-slate-900/50 p-1">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
