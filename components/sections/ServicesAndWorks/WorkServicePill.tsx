import type { ReactNode } from "react";

/** Matches the project-count pill on `ServiceCard.tsx` — use for service name on work cards. */
export const workServicePillClassName =
  "inline-block w-fit self-start min-w-0 max-w-full text-xs font-medium text-primary-5 bg-primary-1 dark:bg-primary-9/20 border border-primary-2 dark:border-primary-8/30 rounded-full px-2.5 py-1 truncate";

export function WorkServicePill({ children }: { children: ReactNode }) {
  return <span className={workServicePillClassName}>{children}</span>;
}
