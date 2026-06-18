"use client";

import { useState } from "react";
import Image from "next/image";
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

const SIZE_MAP: Record<string, { css: string; px: number }> = {
  sm: { css: "size-8", px: 32 },
  md: { css: "size-10", px: 40 },
  lg: { css: "size-14", px: 56 },
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

function InitialsCircle({ name, role, size = "md" }: UserAvatarProps) {
  const s = SIZE_MAP[size];
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold ring-inset shrink-0",
        ROLE_COLORS[role] ?? ROLE_COLORS.EMPLOYEE,
        s.css,
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
  const s = SIZE_MAP[size];
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/png?seed=${seed}&size=${s.px}`;

  return (
    <div className={cn("relative shrink-0", s.css)} title={name}>
      {/* Always-rendered initials fallback (base layer) */}
      <InitialsCircle name={name} role={role} size={size} />

      {/* DiceBear avatar image — overlays the initials when loaded */}
      {!imgFailed && (
        <Image
          src={avatarUrl}
          alt={name}
          width={s.px}
          height={s.px}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 size-full rounded-full object-cover"
        />
      )}
    </div>
  );
}
