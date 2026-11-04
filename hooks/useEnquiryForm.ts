"use client";

import { useState, type FormEvent } from "react";
import { findCategory } from "@/content/enquiry-options";
import { submitEnquiry } from "@/lib/enquiry/submit";
import type {
  CustomerDetails,
  EnquiryFormValues,
  EnquiryInitial,
  EnquiryType,
  FieldErrors,
  FieldKey,
  FormStatus,
} from "@/lib/enquiry/types";
import { buildSubmission, fieldOrder, todayInLagos, validateEnquiry } from "@/lib/enquiry/validation";

function initialValues(initial: EnquiryInitial): EnquiryFormValues {
  return {
    customer: { fullName: "", phone: "", email: "", organisation: "", location: "" },
    target: { category: initial.category, interests: initial.interests },
    message: "",
    appointment: { requested: initial.appointmentRequested, preferredDate: "", preferredTime: "" },
    website: "",
  };
}

/**
 * State, validation and submission flow for the enquiry form. Values live only in React state: nothing is
 * written to localStorage, sessionStorage or cookies. Fields are validated when they lose focus and, once a
 * field shows an error (or after a failed submit), as they change. Submission goes through `submitEnquiry`,
 * which today sends nothing and reports "preview".
 */
export function useEnquiryForm(initial: EnquiryInitial, appointmentRequests = 0, appointmentResets = 0) {
  const [values, setValues] = useState<EnquiryFormValues>(() => initialValues(initial));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });
  /** Bumps on every failed submit so the error summary can take focus each time. */
  const [summaryToken, setSummaryToken] = useState(0);

  /**
   * An appointment request arrived from a link (see hooks/useAppointmentIntent.ts) while this form is already
   * on screen: tick the request box and keep everything else the visitor has typed. The counter only changes
   * for appointment requests, so ordinary navigation never enables it. (Adjusting state while rendering is the
   * documented way to react to a changed prop without an effect.)
   */
  const [touched, setTouched] = useState(false);
  const [seenResets, setSeenResets] = useState(appointmentResets);
  if (appointmentResets !== seenResets) {
    // A plain visit to /contact cleared the standing request: untick the box, but only if a link ticked it and
    // the visitor has not touched the form. Anything they entered or chose is theirs and is left alone.
    setSeenResets(appointmentResets);
    if (!touched) {
      setValues((current) =>
        current.appointment.requested ? { ...current, appointment: { ...current.appointment, requested: false } } : current,
      );
    }
  }

  const [seenRequests, setSeenRequests] = useState(appointmentRequests);
  if (appointmentRequests !== seenRequests) {
    setSeenRequests(appointmentRequests);
    setValues((current) =>
      current.appointment.requested ? current : { ...current, appointment: { ...current.appointment, requested: true } },
    );
  }

  /** Re-checks one field against the next values, leaving other fields' messages alone. */
  function recheck(key: FieldKey, next: EnquiryFormValues) {
    const message = validateEnquiry(next, todayInLagos())[key];
    setErrors((current) => {
      if (!message && !(key in current)) return current;
      const updated = { ...current };
      if (message) updated[key] = message;
      else delete updated[key];
      return updated;
    });
  }

  function change(next: EnquiryFormValues, key: FieldKey) {
    setTouched(true);
    setValues(next);
    if (attempted || errors[key]) recheck(key, next);
    if (status.state === "preview" || status.state === "error") setStatus({ state: "idle" });
  }

  function setCustomer(field: keyof CustomerDetails, value: string) {
    change({ ...values, customer: { ...values.customer, [field]: value } }, field);
  }

  function setMessage(value: string) {
    change({ ...values, message: value }, "message");
  }

  function setCategory(id: EnquiryFormValues["target"]["category"]) {
    const allowed = new Set(findCategory(id)?.interests.map((interest) => interest.slug));
    change(
      { ...values, target: { category: id, interests: values.target.interests.filter((slug) => allowed.has(slug)) } },
      "category",
    );
  }

  function toggleInterest(slug: string) {
    const has = values.target.interests.includes(slug);
    const interests = has ? values.target.interests.filter((s) => s !== slug) : [...values.target.interests, slug];
    setTouched(true);
    setValues({ ...values, target: { ...values.target, interests } });
  }

  function setAppointmentRequested(requested: boolean) {
    const next = { ...values, appointment: { ...values.appointment, requested } };
    setTouched(true);
    setValues(next);
    if (!requested) {
      setErrors((current) => {
        const { preferredDate: _date, preferredTime: _time, ...rest } = current;
        void _date;
        void _time;
        return rest;
      });
    }
    if (status.state === "preview" || status.state === "error") setStatus({ state: "idle" });
  }

  function setPreferred(field: "preferredDate" | "preferredTime", value: string) {
    change({ ...values, appointment: { ...values.appointment, [field]: value } }, field);
  }

  function setHoneypot(value: string) {
    setValues({ ...values, website: value });
  }

  /** Validates a field when the visitor leaves it, but only if it has content or a submit was attempted. */
  function blur(key: FieldKey) {
    if (attempted || errors[key] || hasContent(key, values)) recheck(key, values);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.state === "submitting") return;

    const found = validateEnquiry(values, todayInLagos());
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setAttempted(true);
      setSummaryToken((token) => token + 1);
      setStatus({ state: "idle" });
      return;
    }

    const submission = buildSubmission(values, initial.prefilled);
    if (!submission) return;

    setErrors({});
    setStatus({ state: "submitting" });
    const result = await submitEnquiry(submission);
    if (result.ok) setStatus({ state: "success" });
    else if (result.reason === "not-connected") setStatus({ state: "preview" });
    else setStatus({ state: "error", message: result.message });
  }

  const type: EnquiryType = values.appointment.requested ? "appointment_request" : "enquiry";
  const errorList = fieldOrder.filter((key) => errors[key]).map((key) => ({ key, message: errors[key] as string }));

  return {
    values,
    errors,
    errorList,
    status,
    type,
    summaryToken,
    setCustomer,
    setMessage,
    setCategory,
    toggleInterest,
    setAppointmentRequested,
    setPreferred,
    setHoneypot,
    blur,
    submit,
  };
}

function hasContent(key: FieldKey, values: EnquiryFormValues): boolean {
  switch (key) {
    case "fullName":
    case "phone":
    case "email":
    case "organisation":
    case "location":
      return values.customer[key].trim().length > 0;
    case "message":
      return values.message.trim().length > 0;
    case "preferredDate":
      return values.appointment.preferredDate.length > 0;
    case "preferredTime":
      return values.appointment.preferredTime.length > 0;
    default:
      return false;
  }
}
