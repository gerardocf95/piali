import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTourById } from "@/lib/api/tours.api";
import { formatPrice, splitList, splitLines } from "@/lib/utils";
import {
  GRADIENT,
  GRADIENT_135,
  DIFFICULTY_LABEL,
  TRANSPORT_LABEL,
  tourTypeLabel,
  stateLabel,
  whatsappLink,
} from "@/lib/constants";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tour = await getTourById(Number(id)).catch(() => null);
  if (!tour) {
    return { title: "Tour no encontrado" };
  }
  return {
    title: tour.name,
    description: tour.description?.slice(0, 160),
    alternates: { canonical: `/tours/${tour.id}` },
    openGraph: {
      title: `${tour.name} | Piali`,
      description: tour.description?.slice(0, 160),
      images: tour.imageUrl ? [tour.imageUrl] : undefined,
    },
  };
}

const cardStyle: React.CSSProperties = {
  background: "#13131f",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "24px",
};

export default async function TourDetailPage({ params }: Props) {
  const { id } = await params;
  const tour = await getTourById(Number(id));
  if (!tour) notFound();

  const includes = splitList(tour.includes);
  const notIncludes = splitList(tour.notIncludes);
  const itinerary = splitLines(tour.itinerary);

  const waMessage = `¡Hola Piali! 👋 Me interesa el tour "${tour.name}". ¿Me pueden dar más información?`;

  const facts: { icon: string; label: string; value: string }[] = [
    { icon: "⏱", label: "Duración", value: `${tour.durationDays} día${tour.durationDays > 1 ? "s" : ""}${tour.nights ? ` / ${tour.nights} noche${tour.nights > 1 ? "s" : ""}` : ""}` },
    { icon: "👥", label: "Grupo", value: `${tour.minGroupSize}–${tour.maxGroupSize} personas` },
    { icon: "🚐", label: "Transporte", value: TRANSPORT_LABEL[tour.transportType] ?? tour.transportType },
    { icon: "📍", label: "Salida", value: tour.departurePoint || "CDMX" },
    { icon: "🎒", label: "Tipo", value: tourTypeLabel(tour.tourType) },
    { icon: "⛰", label: "Dificultad", value: DIFFICULTY_LABEL[tour.difficultyLevel] ?? tour.difficultyLevel },
  ];

  return (
    <main style={{ backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "'Nunito', sans-serif", paddingTop: "64px", minHeight: "100vh" }}>
      {/* ── Hero con imagen ── */}
      <section style={{ position: "relative", height: "clamp(280px, 42vh, 460px)", overflow: "hidden" }}>
        {tour.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tour.imageUrl} alt={tour.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: GRADIENT_135 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.35) 60%, rgba(10,10,15,0.4) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 48px 28px", maxWidth: "1100px", margin: "0 auto" }}>
          <Link href="/tours" style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", textDecoration: "none", display: "inline-block", marginBottom: "14px" }}>
            ← Todos los tours
          </Link>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "999px", background: GRADIENT, color: "#fff" }}>
              {tourTypeLabel(tour.tourType)}
            </span>
            {tour.destination && (
              <Link href={`/destinations/${tour.destination.id}`} style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", background: "rgba(255,255,255,0.12)", color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.18)" }}>
                📍 {tour.destination.name}, {stateLabel(tour.destination.state)}
              </Link>
            )}
            {!tour.available && (
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)" }}>
                Temporalmente agotado
              </span>
            )}
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 900, lineHeight: 1.1, maxWidth: "760px" }}>{tour.name}</h1>
        </div>
      </section>

      {/* ── Cuerpo ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 48px 96px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: "32px", alignItems: "start" }}>
        {/* Columna principal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Descripción */}
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>Sobre esta experiencia</h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{tour.description}</p>
          </div>

          {/* Datos rápidos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
            {facts.map((f) => (
              <div key={f.label} style={{ ...cardStyle, padding: "16px" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>{f.icon} {f.label}</p>
                <p style={{ fontSize: "14px", fontWeight: 800 }}>{f.value}</p>
              </div>
            ))}
          </div>

          {/* Incluye / No incluye */}
          {(includes.length > 0 || notIncludes.length > 0) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              {includes.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "14px" }}>✅ Qué incluye</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {includes.map((item, i) => (
                      <li key={i} style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, display: "flex", gap: "8px" }}>
                        <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {notIncludes.length > 0 && (
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "14px" }}>❌ No incluye</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {notIncludes.map((item, i) => (
                      <li key={i} style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, display: "flex", gap: "8px" }}>
                        <span style={{ color: "#f87171", flexShrink: 0 }}>✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Itinerario */}
          {itinerary.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "18px" }}>🗺️ Itinerario</h3>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {itinerary.map((step, i) => (
                  <li key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, width: "26px", height: "26px", borderRadius: "50%", background: GRADIENT_135, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900, color: "#fff" }}>
                      {i + 1}
                    </span>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, paddingTop: "3px" }}>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Columna lateral: precio + contacto (sticky) */}
        <aside style={{ position: "sticky", top: "84px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={cardStyle}>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>Desde</p>
            <p style={{ fontSize: "32px", fontWeight: 900, background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>
              {formatPrice(tour.pricePerPerson)}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "16px" }}>por persona</p>

            {tour.childPrice > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "rgba(255,255,255,0.6)", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", marginBottom: "16px" }}>
                <span>Precio por niño</span>
                <span style={{ fontWeight: 800, color: "#fff" }}>{formatPrice(tour.childPrice)}</span>
              </div>
            )}

            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", textAlign: "center", background: GRADIENT, color: "#fff", fontWeight: 800, fontSize: "15px", padding: "14px", borderRadius: "999px", textDecoration: "none", marginBottom: "10px" }}
            >
              💬 Reservar por WhatsApp
            </a>
            <Link
              href="/#contacto"
              style={{ display: "block", textAlign: "center", background: "transparent", color: "#fff", fontWeight: 800, fontSize: "14px", padding: "12px", borderRadius: "999px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Solicitar información
            </Link>
          </div>

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.6 }}>
            Atención personalizada para grupos, parejas o viajeros individuales.
          </p>
        </aside>
      </section>
    </main>
  );
}
