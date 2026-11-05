import { demoActivity } from "./demo-activity";
import { demoEnquiries } from "./demo-enquiries";
import { appointmentStatusLabels, enquiryStatusLabels } from "./labels";
import type { AppointmentStatus, DemoActivity, DemoEnquiry, EnquiryStatus } from "./types";

/**
 * The in-memory state of the demonstration. Changes made while trying the dashboard live here only: they are
 * not sent anywhere, not stored in the browser, and disappear on refresh or when "Reset demo" is used.
 */
export type DemoState = {
  enquiries: readonly DemoEnquiry[];
  activity: readonly DemoActivity[];
  /** Counts demo actions, to give new notes and events unique ids. */
  changes: number;
};

export type DemoAction =
  | { type: "set-enquiry-status"; id: string; status: EnquiryStatus }
  | { type: "set-appointment-status"; id: string; status: AppointmentStatus }
  | { type: "add-note"; id: string; text: string }
  | { type: "reset" };

export const initialDemoState: DemoState = { enquiries: demoEnquiries, activity: demoActivity, changes: 0 };

const justNow = "Just now (demo)";

function withEvent(state: DemoState, enquiries: readonly DemoEnquiry[], kind: DemoActivity["kind"], text: string): DemoState {
  const changes = state.changes + 1;
  return { enquiries, activity: [{ id: `a-demo-${changes}`, kind, text, at: justNow }, ...state.activity], changes };
}

function update(enquiries: readonly DemoEnquiry[], id: string, change: (enquiry: DemoEnquiry) => DemoEnquiry) {
  return enquiries.map((enquiry) => (enquiry.id === id ? change(enquiry) : enquiry));
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "reset":
      return initialDemoState;

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
      const noteAdded = { id: `n-demo-${changes}`, author: "Demo Admin", at: justNow, text };
      return withEvent(
        { ...state, changes },
        update(state.enquiries, action.id, (e) => ({ ...e, notes: [...e.notes, noteAdded] })),
        "note",
        `Internal note added to ${target.reference} (demo only).`,
      );
    }
  }
}
