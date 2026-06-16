// Skeletons de carga (estilos inline + animación `pialiPulse` definida en globals.css)

const SURFACE = "#13131f";
const BLOCK = "rgba(255,255,255,0.06)";
const pulse: React.CSSProperties = { animation: "pialiPulse 1.4s ease-in-out infinite" };

export function SkeletonBox({ width = "100%", height = 16, radius = 8, style }: { width?: string | number; height?: string | number; radius?: number; style?: React.CSSProperties }) {
  return <div style={{ width, height, borderRadius: radius, background: BLOCK, ...pulse, ...style }} />;
}

export function TourCardSkeleton() {
  return (
    <div style={{ background: SURFACE, borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ height: "200px", background: BLOCK, ...pulse }} />
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <SkeletonBox width="70%" height={16} />
        <SkeletonBox width="100%" height={10} />
        <SkeletonBox width="85%" height={10} />
        <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
          <SkeletonBox width={64} height={20} radius={999} />
          <SkeletonBox width={56} height={20} radius={999} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <SkeletonBox width={50} height={12} />
          <SkeletonBox width={70} height={12} />
        </div>
      </div>
    </div>
  );
}

export function DestinationCardSkeleton() {
  return <div style={{ height: "180px", borderRadius: "12px", background: BLOCK, ...pulse }} />;
}

export function TourGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <TourCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DestinationGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <DestinationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Esqueleto para las páginas de detalle (tour / destino): hero + contenido. */
export function DetailSkeleton() {
  return (
    <main style={{ backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "'Nunito', sans-serif", paddingTop: "64px", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ height: "clamp(280px, 42vh, 460px)", background: BLOCK, ...pulse }} />
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 48px 96px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <SkeletonBox width="40%" height={26} />
        <SkeletonBox width="100%" height={12} />
        <SkeletonBox width="90%" height={12} />
        <SkeletonBox width="75%" height={12} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginTop: "12px" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} height={64} radius={16} />
          ))}
        </div>
      </section>
    </main>
  );
}
