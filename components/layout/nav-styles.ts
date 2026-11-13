/** Shared look of a desktop navigation item: label colour plus an underline that grows on hover/active/open. */
export function navItemClasses(active: boolean) {
  return [
    "relative inline-flex h-11 items-center px-2 font-heading whitespace-nowrap text-sm font-semibold tracking-tight",
    "transition-colors duration-200 hover:text-navy header-clear-dark:hover:text-gold",
    "after:absolute after:inset-x-2 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold",
    "after:transition-transform after:duration-300 hover:after:scale-x-100",
    "aria-expanded:text-navy aria-expanded:after:scale-x-100 header-clear-dark:aria-expanded:text-gold",
    active ? "text-navy after:scale-x-100 after:bg-navy header-clear-dark:text-white header-clear-dark:after:bg-gold" : "text-charcoal header-clear-dark:text-white",
  ].join(" ");
}
