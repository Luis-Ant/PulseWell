"use client";

import { useRealtimePolling } from "@/hooks/use-realtime";

interface AutoRefreshProps {
  intervalMs?: number;
  enabled?: boolean;
}

/**
 * Mount this component in any Server Component page to enable
 * automatic data refresh via Next.js router.refresh().
 *
 * Renders nothing — only runs the polling side effect.
 */
export function AutoRefresh({ intervalMs = 30000, enabled = true }: AutoRefreshProps) {
  useRealtimePolling(intervalMs, enabled);
  return null;
}
