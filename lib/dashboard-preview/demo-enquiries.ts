import { createDemoClock } from "./demo-clock";
import { formatDayMonth, formatReceivedDateTime } from "./dates";
import type { DemoReference } from "./reference";
import type { AppointmentStatus, DemoAppointment, DemoCustomer, DemoEnquiry, DemoNote, DivisionId, EnquiryStatus } from "./types";

/**
 * DEMONSTRATION DATA ONLY. Every customer, organisation, email address and phone number below is fictional
 * ("Demo Customer 01", example.com addresses, and "+234 000 DEMO 00NN" placeholders that contain letters, so they can never be dialled or messaged). None of it is, or was ever, a real BOOM
 * record. This module is the single seam to replace with database queries once the backend exists
 * (docs/implementation-plan.md §6.9): the dashboard only reads `DemoEnquiry[]`.
 *
 * Every date is RELATIVE to the demo reference (lib/dashboard-preview/reference.ts), never typed as a calendar
 * date, so the sample data stays current: `clock.at(-3, "10:15")` is 10:15 three days ago, `clock.day(2)` is
 * two days from now. Consistency rules: references run BMG-2026-0101 (oldest) to BMG-2026-0124 (newest) and
 * `receivedAt` rises with the reference number; nothing is received in the future (the newest enquiries are
 * "minutes ago"); an appointment is "upcoming" when its date is today or later; only requested and confirmed
 * appointments are in the future, and only completed or cancelled ones are in the past; notes are never dated
 * before their enquiry or after now. Every headline figure is computed from this list
 * (lib/dashboard-preview/stats.ts), never typed in.
 */

const noteAuthor = "Demo Admin";

function note(id: string, createdAt: string, text: string): DemoNote {
  return { id, author: noteAuthor, at: formatReceivedDateTime(createdAt), createdAt, text };
}

function appointment(
  status: AppointmentStatus,
  preferredDate: string,
  preferredTime: string,
  purpose: string,
  venue: string,
  customerNote: string,
): DemoAppointment {
  return { status, preferredDate, preferredTime, purpose, venue, customerNote };
}

type Draft = {
  number: number;
  receivedAt: string;
  division: DivisionId;
  service: string;
  summary: string;
  message: string;
  status: EnquiryStatus;
  customer: DemoCustomer;
  appointment?: DemoAppointment;
  notes?: DemoNote[];
};

function record(draft: Draft): DemoEnquiry {
  const reference = `BMG-2026-0${draft.number}`;
  return {
    id: reference.toLowerCase(),
    reference,
    customer: draft.customer,
    division: draft.division,
    service: draft.service,
    summary: draft.summary,
    message: draft.message,
    receivedAt: draft.receivedAt,
    status: draft.status,
    appointment: draft.appointment ?? null,
    notes: draft.notes ?? [],
  };
}

/** The sample enquiries for a reference moment, newest first (the order the dashboard lists them in). */
export function createDemoEnquiries(reference: DemoReference): DemoEnquiry[] {
  const clock = createDemoClock(reference);

  // Customers are numbered in creation order, so the list below runs oldest to newest and is reversed at the end.
  let customerCount = 0;
  function customer(organisation: string, location: string): DemoCustomer {
    customerCount += 1;
    const number = String(customerCount).padStart(2, "0");
    return {
      name: `Demo Customer ${number}`,
      organisation,
      email: `demo${number}@example.com`,
      phone: `+234 000 DEMO 00${number}`,
      location,
    };
  }

  const oldestFirst: DemoEnquiry[] = [
    record({
      number: 101,
      receivedAt: clock.at(-29, "10:15"),
      division: "industrial-equipment",
      service: "Pounding machines",
      summary: "Pounding machine for a restaurant kitchen",
      message:
        "We run a small restaurant and prepare pounded yam every day. We would like to know which pounding machine sizes are available and discuss which would suit our kitchen.",
      status: "resolved",
      customer: customer("Sample Mama Put Kitchen", "Akure, Ondo State"),
      appointment: appointment(
        "completed",
        clock.day(-15),
        "13:00",
        "Equipment requirements discussion",
        "Restaurant premises, Akure",
        "Please come when the lunch rush is over.",
      ),
      notes: [
        note("n-101-1", clock.at(-29, "11:30"), "Called the customer and agreed a visit to the kitchen."),
        note("n-101-2", clock.at(-15, "15:10"), "Visit completed. Customer has what they need; closing the enquiry."),
      ],
    }),
    record({
      number: 102,
      receivedAt: clock.at(-25, "14:05"),
      division: "security",
      service: "Remote monitoring",
      summary: "Remote monitoring for two retail outlets",
      message:
        "We have two shops in the same town and want to watch both from our phones. Please tell us what we would need and arrange a time to talk.",
      status: "resolved",
      customer: customer("Example Supermart Ltd", "Ondo town, Ondo State"),
      appointment: appointment(
        "cancelled",
        clock.day(-9),
        "09:00",
        "Security assessment of both outlets",
        "Two retail outlets, Ondo town",
        "Morning is best for us.",
      ),
      notes: [note("n-102-1", clock.at(-11, "10:00"), "Customer postponed the project and cancelled the visit. Resolved for now.")],
    }),
    record({
      number: 103,
      receivedAt: clock.at(-23, "09:40"),
      division: "energy",
      service: "Solar system design",
      summary: "Solar design for a three-bedroom home",
      message:
        "I want a solar system designed for my home so that I can run lights, fans, a fridge and a television without relying on the grid. Please advise on the design.",
      status: "resolved",
      customer: customer("Private household (demo)", "Akure, Ondo State"),
      appointment: appointment(
        "completed",
        clock.day(-13),
        "14:00",
        "Site visit for solar system design",
        "Customer's home, Akure",
        "Afternoon works. My wife will be home.",
      ),
      notes: [note("n-103-1", clock.at(-13, "16:20"), "Visit done and design discussed. Customer is satisfied; resolved.")],
    }),
    record({
      number: 104,
      receivedAt: clock.at(-20, "12:30"),
      division: "foods",
      service: "Ofada rice and Igbemo rice",
      summary: "Ofada and Igbemo rice for a hotel kitchen",
      message:
        "We need Ofada rice and Igbemo rice for our hotel restaurant, in 50kg bags. Please let us know how to place a regular order.",
      status: "resolved",
      customer: customer("Sample Hotels Akure", "Akure, Ondo State"),
      notes: [note("n-104-1", clock.at(-19, "09:15"), "Spoke to the purchasing officer and agreed how orders will be placed. Resolved.")],
    }),
    record({
      number: 105,
      receivedAt: clock.at(-18, "16:50"),
      division: "energy",
      service: "Energy assessment",
      summary: "Energy assessment for a small clinic",
      message:
        "Our clinic has frequent power cuts and a heavy diesel bill. We would like an energy assessment to see how solar could help.",
      status: "resolved",
      customer: customer("Example Family Clinic", "Ado-Ekiti, Ekiti State"),
      appointment: appointment(
        "completed",
        clock.day(-7),
        "11:00",
        "Energy assessment at the clinic",
        "Clinic premises, Ado-Ekiti",
        "Please ask for the clinic manager at reception.",
      ),
      notes: [note("n-105-1", clock.at(-7, "14:45"), "Assessment completed and the findings explained to the manager. Resolved.")],
    }),
    record({
      number: 106,
      receivedAt: clock.at(-15, "08:55"),
      division: "security",
      service: "CCTV installation",
      summary: "CCTV installation for a school compound",
      message:
        "We want CCTV installed around our school compound, covering the gate, the corridors and the car park. Please arrange an assessment first.",
      status: "resolved",
      customer: customer("Sample International School", "Owo, Ondo State"),
      appointment: appointment(
        "completed",
        clock.day(-5),
        "10:00",
        "Security assessment of the school compound",
        "School compound, Owo",
        "The head teacher will meet you at the gate.",
      ),
      notes: [note("n-106-1", clock.at(-5, "13:00"), "Assessment completed and the school's requirements recorded. Resolved.")],
    }),
    record({
      number: 107,
      receivedAt: clock.at(-13, "11:20"),
      division: "energy",
      service: "Solar system upgrades",
      summary: "Upgrade an existing solar system",
      message:
        "Our current solar system no longer covers our needs since we added two more offices. We want to discuss upgrading it.",
      status: "contacted",
      customer: customer("Example Law Chambers", "Akure, Ondo State"),
      notes: [note("n-107-1", clock.at(-12, "10:05"), "Called and left a message. Customer asked us to call back after 4 pm.")],
    }),
    record({
      number: 108,
      receivedAt: clock.at(-12, "13:35"),
      division: "industrial-equipment",
      service: "Pounding machines",
      summary: "Pounding machine for a restaurant business",
      message:
        "We run a restaurant business and want a pounding machine to cut preparation time. Please discuss the sizes and options with us.",
      status: "contacted",
      customer: customer("Sample Buka Restaurant", "Ikare-Akoko, Ondo State"),
      appointment: appointment(
        "confirmed",
        clock.day(2),
        "12:00",
        "Equipment requirements discussion",
        "Restaurant premises, Ikare-Akoko",
        "Midday suits us.",
      ),
      notes: [note("n-108-1", clock.at(-9, "09:50"), "Spoke to the owner and confirmed the visit.")],
    }),
    record({
      number: 109,
      receivedAt: clock.at(-11, "15:10"),
      division: "security",
      service: "CCTV maintenance",
      summary: "Maintenance for existing CCTV cameras",
      message:
        "Three of our cameras stopped recording and the picture on the others is poor. We need someone to check and maintain the system.",
      status: "contacted",
      customer: customer("Example Plaza Management", "Akure, Ondo State"),
      appointment: appointment(
        "completed",
        clock.day(-1),
        "15:00",
        "On-site check of the existing CCTV system",
        "Plaza management office, Akure",
        "Please bring whatever you need to test the cameras.",
      ),
      notes: [
        note("n-109-1", clock.at(-10, "09:20"), "Customer called back and booked a site check."),
        note("n-109-2", clock.at(-1, "17:00"), "Site check done. Customer to confirm the next step."),
      ],
    }),
    record({
      number: 110,
      receivedAt: clock.at(-9, "10:05"),
      division: "foods",
      service: "Fufu powder",
      summary: "Fufu powder for a small retail shop",
      message: "I own a small shop and would like to stock fufu powder. Please tell me the bag sizes I can buy and how to order.",
      status: "contacted",
      customer: customer("Sample Provisions Store", "Ore, Ondo State"),
      notes: [note("n-110-1", clock.at(-8, "11:45"), "Sent the available bag sizes by message. Waiting for the customer's decision.")],
    }),
    record({
      number: 111,
      receivedAt: clock.at(-8, "17:25"),
      division: "energy",
      service: "Residential solar",
      summary: "Residential solar for a family home",
      message:
        "We are building a house and want solar installed from the start. We would like to meet to discuss what is possible.",
      status: "contacted",
      customer: customer("Private household (demo)", "Ilesa, Osun State"),
      appointment: appointment(
        "confirmed",
        clock.day(7),
        "16:00",
        "Residential solar consultation",
        "Building site, Ilesa",
        "Late afternoon, after work.",
      ),
      notes: [note("n-111-1", clock.at(-7, "12:10"), `Called the customer. Appointment confirmed for ${formatDayMonth(clock.day(7))}.`)],
    }),
    record({
      number: 112,
      receivedAt: clock.at(-7, "09:00"),
      division: "security",
      service: "Security fencing",
      summary: "Security fencing for a plot of land",
      message:
        "I have a large plot I want to fence securely before building. Please come and look at the site and advise on fencing.",
      status: "in_progress",
      customer: customer("Example Properties Ltd", "Akure, Ondo State"),
      appointment: appointment(
        "requested",
        clock.day(12),
        "09:30",
        "Site inspection for security fencing",
        "Plot of land, Akure",
        "I will meet you at the site.",
      ),
      notes: [note("n-112-1", clock.at(-6, "10:30"), "Reviewed the request. Appointment still to be confirmed with the customer.")],
    }),
    record({
      number: 113,
      receivedAt: clock.at(-6, "14:40"),
      division: "security",
      service: "Access control",
      summary: "Access control for an office building",
      message:
        "We want a way to control who enters our office building, with different access for staff and visitors. Please advise what is possible.",
      status: "in_progress",
      customer: customer("Sample Microfinance Bank", "Akure, Ondo State"),
      notes: [note("n-113-1", clock.at(-5, "08:50"), "Customer asked for options for staff and visitor entry. Preparing a response.")],
    }),
    record({
      number: 114,
      receivedAt: clock.at(-5, "11:15"),
      division: "energy",
      service: "Commercial and institutional solar",
      summary: "Commercial solar for a supermarket",
      message:
        "Our supermarket runs freezers and lighting all day and our generator costs are very high. We want to look at a commercial solar solution.",
      status: "in_progress",
      customer: customer("Example Supermarket Ltd", "Akure, Ondo State"),
      appointment: appointment(
        "confirmed",
        clock.day(0),
        "10:00",
        "Energy assessment at the supermarket",
        "Supermarket premises, Akure",
        "Please see the store manager on arrival.",
      ),
      notes: [note("n-114-1", clock.at(-4, "09:40"), `Appointment confirmed with the store manager for ${formatDayMonth(clock.day(0))}.`)],
    }),
    record({
      number: 115,
      receivedAt: clock.at(-4, "16:30"),
      division: "foods",
      service: "Garri Ekiti and Igbemo rice",
      summary: "Garri Ekiti and Igbemo rice for a canteen",
      message:
        "Our staff canteen needs Garri Ekiti and Igbemo rice every month, in 100kg bags. Please tell us how to arrange regular supply.",
      status: "in_progress",
      customer: customer("Sample Staff Canteen Services", "Ado-Ekiti, Ekiti State"),
      notes: [note("n-115-1", clock.at(-2, "10:20"), "Discussing a regular supply arrangement with the customer.")],
    }),
    record({
      number: 116,
      receivedAt: clock.at(-3, "10:25"),
      division: "industrial-equipment",
      service: "Pounding machines",
      summary: "Pounding machine sizes for a restaurant chain",
      message:
        "We have three restaurants and want pounding machines for each kitchen. Please discuss the different sizes with us before we decide.",
      status: "in_progress",
      customer: customer("Example Restaurants Group", "Akure, Ondo State"),
      appointment: appointment(
        "requested",
        clock.day(6),
        "15:00",
        "Equipment requirements discussion",
        "Head office of the restaurant group, Akure",
        "We can meet at our head office.",
      ),
    }),
    record({
      number: 117,
      receivedAt: clock.at(-3, "15:05"),
      division: "energy",
      service: "Solar maintenance",
      summary: "Maintenance for a guest house solar system",
      message:
        "The solar system at our guest house is working poorly and the batteries drain quickly in the evening. Please can someone look at it.",
      status: "in_progress",
      customer: customer("Sample Guest House", "Owo, Ondo State"),
      notes: [note("n-117-1", clock.at(-2, "14:30"), "Asked the customer for the system details and a few photos.")],
    }),
    record({
      number: 118,
      receivedAt: clock.at(-2, "09:30"),
      division: "security",
      service: "Security assessment",
      summary: "Security assessment for a residential estate",
      message:
        "Our estate has had some break-ins. The residents' association would like a security assessment of the perimeter and gates.",
      status: "in_progress",
      customer: customer("Example Estate Residents' Association", "Akure, Ondo State"),
      appointment: appointment(
        "confirmed",
        clock.day(1),
        "14:00",
        "Security assessment of the estate perimeter",
        "Estate main gate, Akure",
        "The chairman will meet you at the main gate.",
      ),
      notes: [note("n-118-1", clock.at(-1, "09:05"), "Appointment confirmed with the association chairman.")],
    }),
    record({
      number: 119,
      receivedAt: clock.at(-2, "17:45"),
      division: "foods",
      service: "Smoked fish and frozen chicken",
      summary: "Smoked fish and frozen chicken for a restaurant",
      message:
        "We need smoked fish and frozen chicken regularly for our restaurant. Please tell me how to place orders and the quantities you can supply.",
      status: "new",
      customer: customer("Sample Grill House", "Akure, Ondo State"),
    }),
    record({
      number: 120,
      receivedAt: clock.at(-1, "11:10"),
      division: "energy",
      service: "Inverter solutions and battery storage",
      summary: "Inverter and battery backup for a small clinic",
      message:
        "Our small clinic needs reliable backup power for the lab fridge and lights. We want an inverter and battery system and would like advice.",
      status: "new",
      customer: customer("Example Diagnostics Centre", "Ado-Ekiti, Ekiti State"),
    }),
    record({
      number: 121,
      receivedAt: clock.at(-1, "16:20"),
      division: "industrial-equipment",
      service: "Pounding machines",
      summary: "Pounding machine for a restaurant kitchen",
      message: "I am opening a restaurant next month and would like to buy a pounding machine. Please send me the details and the sizes you have.",
      status: "new",
      customer: customer("Sample Swallow Restaurant", "Owo, Ondo State"),
    }),
    record({
      number: 122,
      receivedAt: clock.minutesAgo(170),
      division: "security",
      service: "CCTV installation",
      summary: "CCTV for a retail shop and warehouse",
      message:
        "We want CCTV in our shop and the warehouse behind it. We would also like someone to visit and assess the layout first.",
      status: "new",
      customer: customer("Example Trading Company", "Ondo town, Ondo State"),
      appointment: appointment(
        "requested",
        clock.day(5),
        "11:00",
        "Security assessment before CCTV installation",
        "Shop and warehouse, Ondo town",
        "Morning please.",
      ),
    }),
    record({
      number: 123,
      receivedAt: clock.minutesAgo(95),
      division: "foods",
      service: "Garri and Ofada rice",
      summary: "Garri and Ofada rice for a catering business",
      message:
        "We cater for weddings and events and need garri and Ofada rice in large quantities, about 20 bags of 50kg each month. How can we order?",
      status: "new",
      customer: customer("Sample Catering Services", "Akure, Ondo State"),
    }),
    record({
      number: 124,
      receivedAt: clock.minutesAgo(22),
      division: "energy",
      service: "Energy assessment",
      summary: "Solar energy assessment for a school building",
      message:
        "Our school pays high electricity and generator bills. We would like an energy assessment of the main building to see if solar would suit us.",
      status: "new",
      customer: customer("Sample Academy Ltd", "Akure, Ondo State"),
      appointment: appointment(
        "requested",
        clock.day(8),
        "10:00",
        "Energy assessment at the school",
        "School main building, Akure",
        "Please arrange it for a school day so you can see the load.",
      ),
    }),
  ];
  return [...oldestFirst].reverse();
}
