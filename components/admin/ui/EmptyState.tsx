import type { ReactNode } from "react";
import { SearchIcon } from "./icons";

/** Shown in place of a list when nothing matches. Says what happened and offers a way out. */
export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-tint text-navy ring-8 ring-tint/50">
        <SearchIcon className="size-7" />
      </span>
      <p className="mt-6 font-heading text-lead font-extrabold text-navy">{title}</p>
      <p className="mt-1.5 max-w-md text-base text-ink-muted">{children}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
