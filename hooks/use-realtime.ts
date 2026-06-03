"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * useRealtimePolling — refreshes the current route at a configurable interval.
 *
 * Uses Next.js router.refresh() which re-renders server components
 * without losing client-side state. Works on Vercel serverless and
 * requires zero infrastructure (no WebSockets, no Supabase Realtime).
 *
 * @param intervalMs — refresh interval in milliseconds (default: 30000 = 30s)
 * @param enabled — whether polling is active (default: true)
 *
 * @example
 * // In a client wrapper component:
 * function HrDashboardClient({ data }: { data: Props }) {
 *   useRealtimePolling(30000);
 *   return <HrDashboard data={data} />;
 * }
 */
export function useRealtimePolling(
  intervalMs: number = 30000,
  enabled: boolean = true,
): void {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled, router]);
}
