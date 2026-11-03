export type CoreValue = {
  name: string;
  /** The client's own wording from the original company profile. Use verbatim; never paraphrase or extend. */
  description?: string;
};

/** Confirmed core values with the client-supplied descriptions. Exactly these three; do not add others. */
export const coreValues: readonly CoreValue[] = [
  {
    name: "Customer-First",
    description: "We listen to our customers and feel their pain. Our customers are our priority.",
  },
  {
    name: "Honesty",
    description: "We are very honest in our promises.",
  },
  {
    name: "Progress",
    description:
      "We want to see our customers, communities, partners, employees thrive and progress every day.",
  },
];
