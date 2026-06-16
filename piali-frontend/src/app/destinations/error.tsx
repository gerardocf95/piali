"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";

export default function DestinationsError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("❌ /destinations:", error);
  }, [error]);

  return (
    <main style={{ backgroundColor: "#0a0a0f", paddingTop: "64px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ErrorState
        title="No pudimos cargar los destinos"
        message="Hubo un problema al obtener la información. Por favor intenta de nuevo en unos segundos."
        onRetry={unstable_retry}
      />
    </main>
  );
}
