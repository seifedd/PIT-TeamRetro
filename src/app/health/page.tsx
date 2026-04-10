import { Suspense } from "react";
import ClientHealthBoard from "@/components/ClientHealthBoard";

export default function HealthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20" />}>
      <ClientHealthBoard />
    </Suspense>
  );
}
