import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildContactActions, followUpMessage } from "@/lib/dashboard-preview/contact-actions";
import { contactActionsMode } from "@/lib/dashboard-preview/contact-mode";
import { createDemoEnquiries } from "@/lib/dashboard-preview/demo-enquiries";
import { createDemoReference } from "@/lib/dashboard-preview/reference";

const customer = { name: "Ada Test", phone: "0803 123 4567", reference: "BMG-2026-0101", service: "Solar installation" };

describe("contact action links", () => {
  it("builds a tel: link in international format", () => {
    assert.equal(buildContactActions(customer).call, "tel:+2348031234567");
  });

  it("builds a wa.me link in international format (digits only, no plus) with the prefilled message", () => {
    const { whatsapp, message } = buildContactActions(customer);
    assert.ok(whatsapp);
    assert.ok(whatsapp.startsWith("https://wa.me/2348031234567?text="));
    assert.equal(decodeURIComponent(whatsapp.split("?text=")[1]), message);
  });

  it("uses the agreed professional follow-up wording", () => {
    assert.equal(
      buildContactActions(customer).message,
      "Hello Ada Test, this is BOOM MULTI GLOBAL COMPANY LIMITED. We are following up on your enquiry BMG-2026-0101 regarding Solar installation. How may we assist you further?",
    );
    assert.ok(followUpMessage({ name: "N", reference: "R", service: "S" }).startsWith("Hello N, this is BOOM MULTI GLOBAL COMPANY LIMITED."));
  });

  it("never asks WhatsApp to send automatically", () => {
    assert.equal(/[?&](send|autosend)/.test(buildContactActions(customer).whatsapp ?? ""), false);
  });

  it("encodes special characters so they cannot add query parameters", () => {
    const { whatsapp } = buildContactActions({ name: "A&B C", phone: "08031234567", reference: "R/1", service: "Q?x=1&y=2 #z" });
    assert.ok(whatsapp);
    assert.equal(whatsapp.includes("&y=2"), false);
    assert.equal(whatsapp.includes(" "), false);
  });

  for (const phone of ["", "12345", "+44 7911 123456", "+234 000 DEMO 0024"]) {
    it(`gives no call or WhatsApp link for ${JSON.stringify(phone)}`, () => {
      const result = buildContactActions({ ...customer, phone });
      assert.equal(result.call, null);
      assert.equal(result.whatsapp, null);
    });
  }
});

describe("demonstration records cannot start a call or a WhatsApp chat", () => {
  it("runs in demo mode", () => {
    assert.equal(contactActionsMode, "demo");
  });

  it("gives no link for any sample customer, even if live mode were switched on", () => {
    const enquiries = createDemoEnquiries(createDemoReference(new Date("2026-11-06T09:00:00+01:00")));
    assert.equal(enquiries.length, 24);
    for (const enquiry of enquiries) {
      const result = buildContactActions({
        name: enquiry.customer.name,
        phone: enquiry.customer.phone,
        reference: enquiry.reference,
        service: enquiry.service,
      });
      assert.equal(result.call, null, enquiry.reference);
      assert.equal(result.whatsapp, null, enquiry.reference);
      assert.match(enquiry.customer.phone, /DEMO/);
    }
  });
});
