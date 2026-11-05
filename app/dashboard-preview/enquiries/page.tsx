import { Suspense } from "react";
import { PrefilledEnquiriesView } from "@/components/dashboard-preview/PrefilledEnquiriesView";

export default function DashboardEnquiriesPage() {
  return (
    <Suspense fallback={<div aria-hidden="true" className="h-96 border border-line bg-white" />}>
      <PrefilledEnquiriesView />
    </Suspense>
  );
}
