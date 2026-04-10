import { Suspense } from "react";
import ClientRetroBoard from "@/components/ClientRetroBoard";

export default function RetroPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20" />}>
      <ClientRetroBoard />
    </Suspense>
  );
}
