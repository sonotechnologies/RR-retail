import type { ReactNode } from 'react';

/** Re-mounts on navigation: the fade fallback when View Transitions are not available. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
