"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, UserPlus, ClipboardList, Building2, ChevronLeft, Menu, X } from "lucide-react";
import { useState } from "react";

interface AdminSidebarProps {
  userName: string;
  userRole: string;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/teams", label: "Equipos", icon: Users },
  { href: "/admin/users", label: "Usuarios", icon: UserPlus },
  { href: "/admin/surveys", label: "Encuestas", icon: ClipboardList },
];

export function AdminSidebar({ userName, userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() { setMobileOpen(false); }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-slate-700 bg-slate-900 p-2 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="size-5 text-slate-400" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}>
        {/* Header */}
        <div className={cn("flex items-center border-b border-slate-800 px-4 py-4", collapsed && "justify-center")}>
          {!collapsed && (
            <Link href="/" onClick={closeMobile} className="font-display text-sm uppercase tracking-[0.15em] text-white">
              PULSEWELL
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 lg:block"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 lg:hidden">
            <X className="size-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="size-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Divider + Organization */}
        <div className="border-t border-slate-800 px-2 py-3">
          <Link
            href="/admin/organization"
            onClick={closeMobile}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/admin/organization" ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
              collapsed && "justify-center px-2",
            )}
            title={collapsed ? "Organización" : undefined}
          >
            <Building2 className="size-5 shrink-0" />
            {!collapsed && <span>Organización</span>}
          </Link>
        </div>

        {/* User area */}
        {!collapsed && (
          <div className="border-t border-slate-800 px-4 py-3">
            <p className="text-xs text-slate-500 truncate">{userName}</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-wider">{userRole}</p>
          </div>
        )}
      </aside>
    </>
  );
}
