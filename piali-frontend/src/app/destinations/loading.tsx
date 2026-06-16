import { DestinationGridSkeleton } from "@/components/ui/Skeletons";

export default function DestinationsLoading() {
  return (
    <main style={{ backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "'Nunito', sans-serif", paddingTop: "64px", minHeight: "100vh" }}>
      <section style={{ padding: "64px 48px 32px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, marginBottom: "12px" }}>Pueblos Mágicos</h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>Cargando destinos…</p>
      </section>
      <section style={{ padding: "0 48px 96px", maxWidth: "1200px", margin: "0 auto" }}>
        <DestinationGridSkeleton count={8} />
      </section>
    </main>
  );
}
