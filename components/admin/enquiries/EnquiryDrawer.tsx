"use client";

import { useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DetailDrawer } from "@/components/dashboard-preview/DetailDrawer";

/**
 * The side panel for one enquiry. It is opened by the address (?enquiry=<id>) and closed by going back to the same
 * list without it, so the open enquiry survives a refresh and can be shared with a colleague. The contents are
 * rendered on the server and passed in; this wrapper only adds the closing behaviour (Escape, the close button and
 * the backdrop), while the panel itself keeps focus inside and returns it to the row that opened it.
 */
export function EnquiryDrawer({
  closeHref,
  eyebrow,
  title,
  subtitle,
  meta,
  children,
}: {
  closeHref: string;
  eyebrow: ReactNode;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const close = useCallback(() => router.push(closeHref, { scroll: false }), [router, closeHref]);

  return (
    <DetailDrawer eyebrow={eyebrow} title={title} subtitle={subtitle} meta={meta} onClose={close}>
      {children}
    </DetailDrawer>
  );
}
