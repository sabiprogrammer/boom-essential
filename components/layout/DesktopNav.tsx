import { aboutLink, contactLink, homeLink, productsLink, projectsLink } from "@/content/navigation";
import { DivisionsMenu } from "./DivisionsMenu";
import { NavLink } from "./NavLink";

/**
 * Desktop navigation (lg and up), kept short on purpose. Industrial Equipment, an additional offering and not a
 * division, is linked from the footer only (client and Sabi Programmers' request, 13 Nov 2026).
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
        <li>
          <NavLink item={productsLink} />
        </li>
        <li>
          <NavLink item={projectsLink} />
        </li>
        <li>
          <NavLink item={contactLink} />
        </li>
      </ul>
    </nav>
  );
}
