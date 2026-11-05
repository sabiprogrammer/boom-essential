import type { DemoActivity } from "./types";

/**
 * DEMONSTRATION DATA ONLY: the starting activity feed. The events agree with demo-enquiries.ts (references,
 * dates and statuses). Newer events are added at the top while the visitor tries the demo controls.
 */
export const demoActivity: readonly DemoActivity[] = [
  { id: "a-1", kind: "enquiry", text: "New enquiry BMG-2026-0124 received from Demo Customer 24 (BOOM ENERGY).", at: "Today, 08:42" },
  { id: "a-2", kind: "enquiry", text: "New enquiry BMG-2026-0123 received from Demo Customer 23 (BOOM FOODS).", at: "Today, 07:55" },
  { id: "a-3", kind: "appointment", text: "Appointment requested for BMG-2026-0122, Monday 9 November, 11:00 am.", at: "Today, 07:30" },
  { id: "a-4", kind: "status", text: "BMG-2026-0118 moved to In Progress after the appointment was confirmed.", at: "Yesterday, 09:05" },
  { id: "a-5", kind: "note", text: "Internal note added to BMG-2026-0117 asking for system details and photos.", at: "Monday, 14:30" },
  { id: "a-6", kind: "appointment", text: "Site check completed for BMG-2026-0109 (CCTV maintenance).", at: "Monday, 17:00" },
];
