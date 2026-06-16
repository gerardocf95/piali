import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinationById } from "@/lib/api/destinations.api";
import { getToursByDestination } from "@/lib/api/tours.api";
import type { Tour } from "@/types/tour";
import { formatPrice } from "@/lib/utils";
import { GRADIENT, GRADIENT_135, stateLabel, whatsappLink } from "@/lib/constants";
import TourGridCard from "@/components/features/tours/TourGridCard";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dest = await getDestinationById(Number(id)).catch(() => null);
  if (!dest) {
    return { title: "Destino no encontrado" };
  }
  return {
    title: `${dest.name}, ${stateLabel(dest.state)}`,
    description: dest.description?.slice(0, 160),
    alternates: { canonical: `/destinations/${dest.id}` },
    openGraph: {
      title: `${dest.name} | Piali`,
      description: dest.description?.slice(0, 160),
      images: dest.imageUrl ? [dest.imageUrl] : undefined,
    },
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { id } = await params;
  const destId = Number(id);

  const dest = await getDestinationById(destId);
  if (!dest) notFound();

  const tours = await getToursByDestination(destId).catch((e) => {
    console.error("❌ tours by destination:", e.message);
    return [] as Tour[];
  });

  const waMessage = `¡Hola Piali! 👋 Me interesa viajar a ${dest.name}, ${stateLabel(dest.state)}. ¿Qué opciones tienen?`;

  const facts: { icon: string; label: string; value: string }[] = [
    { icon: "🏛️", label: "Estado", value: stateLabel(dest.state) },
    { icon: "🛣️", label: "Distancia desde CDMX", value: `${dest.distanceKmFromCDMX} km` },
    { icon: "💰", label: "Desde", value: formatPrice(dest.basePrice) },
  ];

  return (
    <main style={{ backgroundColor: "#0a0a0f", color: "#fff", fontFamily: "'Nunito', sans-serif", paddingTop: "64px", minHeight: "100vh" }}>
      {/* ── Hero con imagen ── */}
      <section style={{ position: "relative", height: "clamp(280px, 42vh, 460px)", overflow: "hidden" }}>
        {dest.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dest.imageUrl} alt={dest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: GRADIENT_135 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,1) 0%, rgba(10,10,15,0.35) 60%, rgba(10,10,15,0.4) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 48px 28px", maxWidth: "1100px", margin: "0 auto" }}>
          <Link href="/destinations" style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", textDecoration: "none", display: "inline-block", marginBottom: "14px" }}>
            ← Todos los destinos
          </Link>
          <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: "8px" }}>
            📍 {stateLabel(dest.state)}
          </span>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 900, lineHeight: 1.1 }}>{dest.name}</h1>
        </div>
      </section>

      {/* ── Cuerpo ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 48px 96px" }}>
        {/* Datos rápidos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "36px" }}>
          {facts.map((f) => (
            <div key={f.label} style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "18px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "4px" }}>{f.icon} {f.label}</p>
              <p style={{ fontSize: "16px", fontWeight: 800 }}>{f.value}</p>
            </div>
          ))}
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "14px" }}>
            Sobre{" "}
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{dest.name}</span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, whiteSpace: "pre-line", maxWidth: "760px" }}>
            {dest.description}
          </p>
        </div>

        {/* Tours en este destino */}
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>
            Tours en{" "}
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{dest.name}</span>
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
            {tours.length > 0
              ? `${tours.length} experiencia${tours.length !== 1 ? "s" : ""} disponible${tours.length !== 1 ? "s" : ""} en este destino.`
              : "Aún no hay tours publicados para este destino."}
          </p>

          {tours.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {tours.map((tour) => (
                <TourGridCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div style={{ background: "linear-gradient(135deg, rgba(233,30,140,0.12), rgba(139,92,246,0.12))", border: "1px solid rgba(233,30,140,0.2)", borderRadius: "20px", padding: "40px", textAlign: "center" }}>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
                ¿Quieres viajar a {dest.name}? Podemos armar un viaje a tu medida.
              </p>
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", background: GRADIENT, color: "#fff", fontWeight: 800, fontSize: "15px", padding: "14px 36px", borderRadius: "999px", textDecoration: "none" }}
              >
                💬 Consultar por WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
