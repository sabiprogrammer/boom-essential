import { createDemoActivity } from "./demo-activity";
import { createDemoEnquiries } from "./demo-enquiries";
import { appointmentStatusLabels, enquiryStatusLabels } from "./labels";
import type { DemoReference } from "./reference";
import type { AppointmentStatus, DemoActivity, DemoEnquiry, EnquiryStatus } from "./types";

/**
 * The in-memory state of the demonstration. Changes made while trying the dashboard live here only: they are
 * not sent anywhere, not stored in the browser, and disappear on refresh or when "Reset demo" is used.
 */
export type DemoState = {
  /** The reference moment the sample data was built for; null until the browser has chosen it (see useDemoReference). */
  reference: DemoReference | null;
  enquiries: readonly DemoEnquiry[];
  activity: readonly DemoActivity[];
  /** Counts demo actions, to give new notes and events unique ids. */
  changes: number;
};

export type DemoAction =
  | { type: "set-enquiry-status"; id: string; status: EnquiryStatus }
  | { type: "set-appointment-status"; id: string; status: AppointmentStatus }
  | { type: "add-note"; id: string; text: string }
  | { type: "reset" }
  /** The browser has chosen the reference date: rebuild the sample data for it. */
  | { type: "adopt-reference"; reference: DemoReference | null };

/** The starting state for a reference moment. Without one (server render, first hydration pass) there is no data yet. */
export function createInitialDemoState(reference: DemoReference | null): DemoState {
  if (!reference) return { reference: null, enquiries: [], activity: [], changes: 0 };
  const enquiries = createDemoEnquiries(reference);
  return { reference, enquiries, activity: createDemoActivity(enquiries, reference), changes: 0 };
}

const justNow = "Just now (demo)";

function withEvent(state: DemoState, enquiries: readonly DemoEnquiry[], kind: DemoActivity["kind"], text: string): DemoState {
  const changes = state.changes + 1;
  return { reference: state.reference, enquiries, activity: [{ id: `a-demo-${changes}`, kind, text, at: justNow }, ...state.activity], changes };
}

function update(enquiries: readonly DemoEnquiry[], id: string, change: (enquiry: DemoEnquiry) => DemoEnquiry) {
  return enquiries.map((enquiry) => (enquiry.id === id ? change(enquiry) : enquiry));
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "reset":
      return createInitialDemoState(state.reference);

    case "adopt-reference":
      return createInitialDemoState(action.reference);

    case "set-enquiry-status": {
      const target = state.enquiries.find((e) => e.id === action.id);
      if (!target || target.status === action.status) return state;
      return withEvent(
        state,
        update(state.enquiries, action.id, (e) => ({ ...e, status: action.status })),
        "status",
        `${target.reference} marked ${enquiryStatusLabels[action.status]} (demo only).`,
      );
    }

    case "set-appointment-status": {
      const target = state.enquiries.find((e) => e.id === action.id);
      if (!target?.appointment || target.appointment.status === action.status) return state;
      const appointment = target.appointment;
      return withEvent(
        state,
        update(state.enquiries, action.id, (e) => ({ ...e, appointment: { ...appointment, status: action.status } })),
        "appointment",
        `Appointment for ${target.reference} marked ${appointmentStatusLabels[action.status]} (demo only).`,
      );
    }

    case "add-note": {
      const text = action.text.trim();
      const target = state.enquiries.find((e) => e.id === action.id);
      if (!target || text === "") return state;
      const changes = state.changes + 1;
      const noteAdded = { id: `n-demo-${changes}`, author: "Demo Admin", at: justNow, createdAt: null, text };
      return withEvent(
        { ...state, changes },
        update(state.enquiries, action.id, (e) => ({ ...e, notes: [...e.notes, noteAdded] })),
        "note",
        `Internal note added to ${target.reference} (demo only).`,
      );
    }
  }
}
