import { adminDivisionLabels, requestedLabels } from "@/lib/admin/enquiries/labels";
import type { EnquiryDetailData } from "@/lib/admin/enquiries/types";
import { formatReceivedDateTime } from "@/lib/dashboard-preview/dates";
import { DetailItem, DetailList, DetailSection, Quote } from "@/components/dashboard-preview/DetailSection";
import { BuildingIcon, CalendarIcon, CheckIcon, ClockIcon, InboxIcon, NoteIcon } from "@/components/dashboard-preview/icons";
import { ActivityTimeline } from "./ActivityTimeline";
import { AppointmentSummary } from "./AppointmentSummary";
import { CustomerSection } from "./CustomerSection";
import { NotesSection } from "./NotesSection";
import { StatusManager } from "./StatusManager";

const sourceLabels: Record<string, string> = {
  website: "Website enquiry form",
  phone: "Phone",
  whatsapp: "WhatsApp",
  admin: "Entered by an administrator",
};

/**
 * Everything about one real enquiry as distinct sections: status (the main action), the customer with contact
 * actions, the enquiry itself, any appointment requests, internal notes and the activity history.
 */
export function EnquiryDetailContent({ data }: { data: EnquiryDetailData }) {
  const { enquiry, appointments, notes, activity } = data;
  const requested = requestedLabels(enquiry);

  return (
    <>
      <DetailSection title="Manage status" icon={<CheckIcon />}>
        <StatusManager enquiryId={enquiry.id} status={enquiry.status} />
      </DetailSection>

      <DetailSection title="Customer" icon={<BuildingIcon />}>
        <CustomerSection enquiry={enquiry} />
      </DetailSection>

      <DetailSection title="Enquiry" icon={<InboxIcon />}>
        <DetailList>
          <DetailItem label="Reference">{enquiry.reference}</DetailItem>
          <DetailItem label="Division">{adminDivisionLabels[enquiry.division]}</DetailItem>
          <DetailItem label={enquiry.division === "foods" || enquiry.division === "industrial-equipment" ? "Products requested" : "Services requested"} wide>
            {requested.length > 0 ? (
              <ul className="list-disc space-y-0.5 pl-5">
                {requested.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            ) : (
              "None chosen"
            )}
          </DetailItem>
          <DetailItem label="Submitted">{formatReceivedDateTime(enquiry.createdAt)}</DetailItem>
          <DetailItem label="Received through">{sourceLabels[enquiry.source] ?? enquiry.source}</DetailItem>
          <DetailItem label="Message" wide>
            <Quote>{enquiry.message}</Quote>
          </DetailItem>
        </DetailList>
      </DetailSection>

      <DetailSection title={appointments.length > 1 ? "Appointment requests" : "Appointment request"} icon={<CalendarIcon />}>
        <AppointmentSummary appointments={appointments} />
      </DetailSection>

      <DetailSection title="Internal notes" icon={<NoteIcon />}>
        <NotesSection enquiryId={enquiry.id} notes={notes} />
      </DetailSection>

      <DetailSection title="Activity history" icon={<ClockIcon />}>
        <ActivityTimeline activity={activity} />
      </DetailSection>
    </>
  );
}
