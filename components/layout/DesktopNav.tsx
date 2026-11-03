import { aboutLink, contactLink, homeLink, industrialLink } from "@/content/navigation";
import { DivisionsMenu } from "./DivisionsMenu";
import { NavLink } from "./NavLink";

/**
 * Desktop navigation (lg and up). Industrial Equipment sits after a divider, apart from the
 * three principal divisions in the dropdown, because it is an additional offering, not a division.
 */
export function DesktopNav() {
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center">
        <li>
          <NavLink item={homeLink} />
        </li>
        <li>
          <NavLink item={aboutLink} />
        </li>
        <DivisionsMenu />
        <li aria-hidden="true" className="mx-2 h-5 w-px bg-line-strong" />
        <li>
          <NavLink item={industrialLink} />
        </li>
        <li>
          <NavLink item={contactLink} />
        </li>
      </ul>
    </nav>
  );
}
