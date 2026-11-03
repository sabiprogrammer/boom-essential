export type CoreValue = {
  name: string;
  /**
   * The client's own explanation of the value, from the original company profile.
   * NOT SUPPLIED YET: leave undefined until the client's wording is provided. Never invent it.
   */
  description?: string;
};

/** Confirmed core values. Exactly these three; do not add others. */
export const coreValues: readonly CoreValue[] = [
  { name: "Customer-First" },
  { name: "Honesty" },
  { name: "Progress" },
];
