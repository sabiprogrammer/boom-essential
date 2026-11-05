import { company } from "@/content/company";
import { dashboardCopy } from "@/content/dashboard-preview";
import { LogoImage } from "@/components/layout/LogoImage";
import { SmartLink } from "@/components/ui/SmartLink";
import { ExternalIcon } from "./icons";
import { SidebarNav } from "./SidebarNav";

/**
 * Desktop sidebar (lg and up): the brand lockup, the navigation and a quiet footer with the way back to the
 * public site. Deep Navy throughout, with gold used only for small accents.
 */
export function Sidebar() {
  return (
    <aside
      data-surface="dark"
      aria-label="Administration"
      className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-navy text-white lg:flex xl:w-72"
    >
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3.5">
          <span className="shrink-0 rounded-md bg-white p-1 shadow-[0_0_0_1px_rgb(255_255_255/0.2)]">
            <LogoImage alt="" sizes="48px" className="size-11" />
          </span>
          <p className="min-w-0 font-heading text-[0.9375rem] leading-tight font-extrabold tracking-[0.14em]">
            BOOM
            <span className="mt-0.5 block text-xs font-bold tracking-[0.22em] text-on-dark-muted">MULTI GLOBAL</span>
          </p>
        </div>
        <p className="mt-5 border-t border-white/10 pt-4 font-heading text-xs font-bold tracking-[0.16em] whitespace-nowrap text-gold uppercase">
          {dashboardCopy.adminLabel}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pt-2">
        <p className="px-3 pb-2 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted/80 uppercase">Workspace</p>
        <SidebarNav />
      </div>

      <div className="border-t border-white/10 bg-navy-deep px-6 py-5">
        <SmartLink
          href="/"
          className="group inline-flex min-h-11 items-center gap-2.5 font-heading text-sm font-semibold text-on-dark-muted transition-colors hover:text-white"
        >
          <ExternalIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          Back to {company.website}
        </SmartLink>
      </div>
    </aside>
  );
}
