import { Container } from "@/components/ui/Container";

/** Unmistakable marker that this page is a development artefact, not the homepage. */
export function PreviewBanner() {
  return (
    <div role="note" className="bg-gold text-navy">
      <Container className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="font-heading text-xs font-extrabold tracking-[0.16em] uppercase">Development preview</p>
        <p className="text-sm font-medium">
          Stage 1 design foundation. This is not the homepage and will be replaced during the homepage milestone.
        </p>
      </Container>
    </div>
  );
}
