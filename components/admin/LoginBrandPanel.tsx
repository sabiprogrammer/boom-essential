import { company } from "@/content/company";
import { LogoImage } from "@/components/layout/LogoImage";

/**
 * The navy side of the sign-in page: the logo on its own white square (it is a JPEG on white, so it never sits
 * directly on navy), the company name and the three tagline words. Purely decorative branding; no links.
 */
export function LoginBrandPanel() {
  return (
    <aside className="relative flex flex-col justify-between gap-10 overflow-hidden bg-navy px-gutter py-10 text-white lg:px-14 lg:py-16">
      <div className="flex items-center gap-4">
        <span className="block bg-white p-1.5">
          <LogoImage alt="" priority sizes="72px" className="size-14 lg:size-[4.5rem]" />
        </span>
        <p className="font-heading text-sm leading-tight font-extrabold tracking-[0.14em]">
          BOOM
          <span className="block font-bold tracking-[0.2em] text-on-dark-muted">MULTI GLOBAL</span>
        </p>
      </div>

      <div className="max-w-md">
        <p aria-hidden="true" className="h-[3px] w-14 bg-gold" />
        <p className="mt-6 font-heading text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.05] font-extrabold tracking-tight">
          {company.taglineWords.map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </p>
      </div>

      <p className="hidden text-sm text-on-dark-muted lg:block">{company.legalName}</p>
    </aside>
  );
}
