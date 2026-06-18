"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  role: string;
  size?: "sm" | "md" | "lg";
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-500/20 text-purple-300 ring-purple-500/30",
  HR_ANALYST: "bg-cyan-500/20 text-cyan-300 ring-cyan-500/30",
  MANAGER: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
  EMPLOYEE: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
};

const SIZE_CLASSES: Record<string, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function InitialsCircle({ name, role, size }: UserAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold ring-inset shrink-0",
        ROLE_COLORS[role] ?? ROLE_COLORS.EMPLOYEE,
        SIZE_CLASSES[size],
        "text-xs ring-2",
        size === "md" && "text-sm",
        size === "lg" && "text-lg",
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

export function UserAvatar({ name, role, size = "md" }: UserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const seed = encodeURIComponent(name);
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${seed}`;

  return (
    <div
      className={cn("relative shrink-0", SIZE_CLASSES[size])}
      title={name}
    >
      {/* Always-rendered initials fallback (base layer) */}
      <InitialsCircle name={name} role={role} size={size} />

      {/* DiceBear avatar image — overlays the initials when loaded */}
      {!imgFailed && (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 size-full rounded-full object-cover"
        />
      )}
    </div>
  );
}
