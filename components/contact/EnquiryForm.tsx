"use client";

import { useEffect, useRef } from "react";
import { useEnquiryForm } from "@/hooks/useEnquiryForm";
import { enquirySubmissionEnabled } from "@/lib/enquiry/config";
import type { EnquiryInitial } from "@/lib/enquiry/types";
import { AppointmentFields } from "./AppointmentFields";
import { CategoryPicker } from "./CategoryPicker";
import { CustomerFields } from "./CustomerFields";
import { EnquiryStatusPanel } from "./EnquiryStatusPanel";
import { ErrorSummary } from "./ErrorSummary";
import { FormStep } from "./FormStep";
import { InterestPicker } from "./InterestPicker";
import { MessageField } from "./MessageField";
import { PreviewNotice } from "./PreviewNotice";
import { SubmitBar } from "./SubmitBar";

/**
 * The one enquiry form for every part of BOOM MULTI GLOBAL: general, Energy, Security, Foods and Industrial
 * Equipment, with an optional appointment request. It validates in the browser and hands a typed payload to
 * `submitEnquiry`, which today sends nothing (see lib/enquiry/config.ts). Values stay in memory only.
 * Pass `initial` (from the URL) to pre-select a category, a product or the appointment request, and
 * `appointmentRequests` (a counter) to tick the appointment request later without resetting the form, and
 * `appointmentResets` (a counter) to clear it again if only a link had ticked it.
 */
export function EnquiryForm({
  initial,
  appointmentRequests = 0,
  appointmentResets = 0,
}: {
  initial: EnquiryInitial;
  appointmentRequests?: number;
  appointmentResets?: number;
}) {
  const form = useEnquiryForm(initial, appointmentRequests, appointmentResets);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const { summaryToken, status } = form;
  const handledRequests = useRef(appointmentRequests);

  useEffect(() => {
    if (summaryToken > 0) summaryRef.current?.focus();
  }, [summaryToken]);

  // A new appointment request arrived while the form is on screen: bring the appointment block into view.
  // (Next.js does not scroll again when the URL already ends in #appointment.)
  useEffect(() => {
    if (appointmentRequests === handledRequests.current) return;
    handledRequests.current = appointmentRequests;
    document.getElementById("appointment")?.scrollIntoView({ block: "start" });
  }, [appointmentRequests]);

  useEffect(() => {
    if (status.state === "preview" || status.state === "success" || status.state === "error") statusRef.current?.focus();
  }, [status.state]);

  return (
    <form noValidate onSubmit={form.submit} aria-label="Enquiry form" className="space-y-12">
      {enquirySubmissionEnabled ? null : <PreviewNotice />}

      {form.errorList.length > 0 ? <ErrorSummary errors={form.errorList} summaryRef={summaryRef} /> : null}

      <FormStep number="01" title="About you" description="Only your name and a phone number are required.">
        <CustomerFields
          customer={form.values.customer}
          errors={form.errors}
          onChange={form.setCustomer}
          onBlur={form.blur}
        />
      </FormStep>

      <FormStep number="02" title="What do you need?">
        <CategoryPicker value={form.values.target.category} error={form.errors.category} onChange={form.setCategory} />
        <div className="mt-8">
          <InterestPicker
            category={form.values.target.category}
            selected={form.values.target.interests}
            prefilled={initial.prefilled}
            onToggle={form.toggleInterest}
          />
        </div>
      </FormStep>

      <FormStep number="03" title="Your message">
        <MessageField
          value={form.values.message}
          error={form.errors.message}
          onChange={form.setMessage}
          onBlur={() => form.blur("message")}
        />
      </FormStep>

      <FormStep number="04" title="Appointment" description="Optional. Add this only if you would like to arrange a time to talk.">
        <AppointmentFields
          appointment={form.values.appointment}
          errors={form.errors}
          onToggle={form.setAppointmentRequested}
          onChange={form.setPreferred}
          onBlur={form.blur}
        />
      </FormStep>

      {/* Honeypot: invisible to people, tempting to bots. The server must reject any submission where it is filled. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.values.website}
            onChange={(event) => form.setHoneypot(event.target.value)}
          />
        </label>
      </div>

      <EnquiryStatusPanel status={status} type={form.type} panelRef={statusRef} />

      <SubmitBar type={form.type} submitting={status.state === "submitting"} />
    </form>
  );
}
