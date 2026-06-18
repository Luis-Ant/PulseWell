"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  role: string;
  size?: "sm" | "md" | "lg";
  imageUrl?: string | null;
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-500/20 text-purple-300 ring-purple-500/30",
  HR_ANALYST: "bg-cyan-500/20 text-cyan-300 ring-cyan-500/30",
  MANAGER: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
  EMPLOYEE: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
};

const SIZE_CLASSES: Record<string, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
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

export function UserAvatar({ name, role, size = "md", imageUrl }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = imageUrl && !imgError;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold ring-2 ring-inset overflow-hidden",
        !showImage && (ROLE_COLORS[role] ?? ROLE_COLORS.EMPLOYEE),
        SIZE_CLASSES[size],
      )}
      title={name}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={name}
          className="size-full rounded-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
