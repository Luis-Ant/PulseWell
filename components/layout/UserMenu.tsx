"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./UserAvatar";
import { Bell, LogOut, User, ChevronDown, Loader2, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  userName: string;
  userRole: string;
  hasPendingSurvey: boolean;
  notificationCount?: number;
}

export function UserMenu({ userName, userRole, hasPendingSurvey, notificationCount = 0 }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowNotifications(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {
      // Fallback: navigate to login
    }
    router.push("/auth/login");
    router.refresh();
  }

  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    HR_ANALYST: "Recursos Humanos",
    MANAGER: "Manager",
    EMPLOYEE: "Empleado",
  };

  const totalNotifications = notificationCount + (hasPendingSurvey ? 1 : 0);

  // Mock notifications for demo
  const demoNotifications = [
    ...(hasPendingSurvey ? [{ icon: Clock, text: "Tenés una encuesta pendiente esta semana", time: "Ahora", color: "text-cyan-400" }] : []),
    { icon: CheckCircle2, text: "Tu equipo alcanzó el 80% de participación", time: "Hace 2 días", color: "text-emerald-400" },
  ];

  return (
    <div ref={menuRef} className="relative flex items-center gap-2">
      {/* Notification bell */}
      <button
        onClick={() => { setShowNotifications(!showNotifications); setOpen(false); }}
        className="relative rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="size-5" />
        {totalNotifications > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-slate-950">
            {totalNotifications}
          </span>
        )}
      </button>

      {/* Notifications dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
              {totalNotifications} nueva{totalNotifications !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {demoNotifications.length > 0 ? (
              demoNotifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-slate-800/50 px-4 py-3 last:border-0 hover:bg-slate-800/30 transition-colors">
                  <n.icon className={`mt-0.5 size-4 shrink-0 ${n.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300">{n.text}</p>
                    <p className="mt-0.5 text-[10px] text-slate-600">{n.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <CheckCircle2 className="mx-auto size-6 text-slate-600" />
                <p className="mt-2 text-xs text-slate-500">No hay notificaciones</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Avatar + dropdown trigger */}
      <button
        onClick={() => { setOpen(!open); setShowNotifications(false); }}
        className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-800 transition-colors"
      >
        <UserAvatar name={userName} role={userRole} size="sm" />
        <span className="hidden text-sm text-slate-300 sm:inline">{userName.split(" ")[0]}</span>
        <ChevronDown className={cn("hidden size-3.5 text-slate-500 transition-transform sm:inline", open && "rotate-180")} />
      </button>

      {/* Profile dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {/* Profile header */}
          <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-4">
            <UserAvatar name={userName} role={userRole} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs text-slate-400">{roleLabels[userRole] ?? userRole}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); /* Profile page - future */ }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <User className="size-4 text-slate-500" />
              Mi perfil
              <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[9px] text-slate-500">Próximamente</span>
            </button>

            <button
              onClick={() => { setOpen(false); setShowNotifications(true); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Bell className="size-4 text-slate-500" />
              Notificaciones
              {totalNotifications > 0 && (
                <span className="ml-auto rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-400">
                  {totalNotifications}
                </span>
              )}
            </button>
          </div>

          {/* Divider + Logout */}
          <div className="border-t border-slate-800 py-1">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-red-950/30 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
