import type { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Lightweight public layout — no auth guards, no nav by default.
 * Used by landing page and login page.
 *
 * Each child page controls its own header: the landing page renders
 * an auth-aware header, while the login page is self-contained.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return <>{children}</>;
}
