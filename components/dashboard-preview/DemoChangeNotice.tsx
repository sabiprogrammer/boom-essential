import { dashboardCopy } from "@/content/dashboard-preview";
import { InfoIcon } from "./icons";

/**
 * Sits beside every simulated control. It states plainly that nothing is saved to a server. When `changed` is
 * true it says a (temporary) change has just been made; it is a live region so assistive technology hears it.
 */
export function DemoChangeNotice({ changed = false }: { changed?: boolean }) {
  return (
    <p role="status" className="flex gap-3 rounded-md border border-gold/40 bg-gold-tint px-4 py-3 text-sm text-navy">
      <InfoIcon className="mt-0.5 size-5 shrink-0" />
      <span>
        {changed ? dashboardCopy.demoChangeNotice : "Demonstration controls. Changes here are temporary and are not saved to any server."}
      </span>
    </p>
  );
}
