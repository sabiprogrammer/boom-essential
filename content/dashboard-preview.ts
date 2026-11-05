/**
 * Copy and navigation for the admin dashboard PREVIEW (/dashboard-preview): a frontend-only demonstration
 * with fictional data. The real, protected dashboard (/admin) is a later stage.
 */

export const dashboardSections = [
  {
    id: "overview",
    label: "Overview",
    href: "/dashboard-preview",
    title: "Overview",
    description: "Enquiries and appointments at a glance.",
  },
  {
    id: "enquiries",
    label: "Enquiries",
    href: "/dashboard-preview/enquiries",
    title: "Enquiries",
    description: "Search, filter and manage customer enquiries.",
  },
  {
    id: "appointments",
    label: "Appointments",
    href: "/dashboard-preview/appointments",
    title: "Appointments",
    description: "Upcoming and past appointment requests.",
  },
] as const;

export type DashboardSectionId = (typeof dashboardSections)[number]["id"];

export const dashboardCopy = {
  banner: "DEMO PREVIEW — Sample data only. No live customer records are connected.",
  adminLabel: "Company administration",
  demoUser: { name: "Demo Admin", role: "Administrator (demo)" },
  /** Shown beside every simulated change. It must never claim anything was saved. */
  demoChangeNotice:
    "Demo only. This change is held in your browser for this visit and has not been saved anywhere. Refreshing the page restores the sample data.",
  detailsHeading: "Demonstration controls",
} as const;
