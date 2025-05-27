"use client";
import ExternalCallbackBlock from "@/widgets/ui/external-callback/external-callback";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ExternalCallbackBlock />
    </Suspense>
  );
}
