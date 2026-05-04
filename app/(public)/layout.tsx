import type { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Lightweight public layout — no auth guards, no nav.
 * Used by landing page and login page.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return <>{children}</>;
}
