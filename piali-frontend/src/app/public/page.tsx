import Link from "next/link";
import Image from "next/image";
import { getDestinations } from "@/lib/api/destinations.api";
import { getFeaturedTours } from "@/lib/api/tours.api";
import { formatPrice } from "@/lib/utils";
import type { Destination } from "@/types/destination";
import type { Tour } from "@/types/tour";

const STATS = [
  { value: "7+",   label: "Años de experiencia" },
  { value: "500+", label: "Viajeros felices" },
  { value: "15+",  label: "Destinos únicos" },
  { value: "100%", label: "Satisfacción" },
];

const TOUR_TYPE_LABEL: Record<string, string> = {
  CULTURAL: "Cultural",
  AVENTURA: "Aventura",
  GASTRONOMICO: "Gastronómico",
  NATURALEZA: "Naturaleza",
  HISTORICO: "Histórico",
};

const TESTIMONIALS = [
  {
    initials: "AR",
    name: "Andrea Reyes",
    tour: "Viñedos Querétaro",
    text: "Todo el viaje me gustó, desde la accesibilidad de pago, la puntualidad y el trato fue excelente. Sin duda lo volvería a tomar.",
  },
  {
    initials: "IU",
    name: "Ilse Urbina",
    tour: "Santuario Luciérnagas",
    text: "Asistí al viaje del Santuario de las Luciérnagas con Piali, fue un viaje muy bonito y mágico. Una experiencia que recordaré siempre.",
  },
  {
    initials: "AA",
    name: "Alex Álvarez",
    tour: "Ruta del Vino y Queso",
    text: "Realicé el tour de la ruta del vino y el queso con Piali, mi experiencia fue bastante agradable. Todo bastante organizado.",
  },
];

const GRADIENT = "linear-gradient(90deg, #e91e8c, #8b5cf6)";
const GRADIENT_135 = "linear-gradient(135deg, #e91e8c, #8b5cf6)";

export default async function HomePage() {
  const [destinations, featuredTours] = await Promise.all([
    getDestinations().catch((e) => { console.error("❌ destinations:", e.message); return [] as Destination[]; }),
    getFeaturedTours().catch((e) => { console.error("❌ featuredTours:", e.message); return [] as Tour[]; }),
  ]);

  console.log("✅ featuredTours recibidos:", featuredTours.length);

  return (
    <main style={{ backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "100px 32px 80px", overflow: "hidden" }}>
        {/* Imagen de fondo */}
        <Image src="/hero-bg.jpg" alt="Pueblos mágicos de México" fill style={{ objectFit: "cover", zIndex: 0 }} priority />
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,15,0.55), rgba(10,10,15,0.85))", zIndex: 1 }} />

        {/* Contenido */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ display: "inline-block", fontSize: "12px", padding: "6px 18px", borderRadius: "999px", border: "1px solid rgba(233,30,140,0.4)", background: "rgba(233,30,140,0.15)", color: "#f472b6", marginBottom: "24px" }}>
            ✦ Desde 2018 creando experiencias inolvidables
          </span>

          <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.1, marginBottom: "20px", maxWidth: "700px" }}>
            Viajemos{" "}
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Juntos
            </span>
            <br />por México
          </h1>

          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", maxWidth: "460px", lineHeight: 1.7, marginBottom: "36px" }}>
            Descubre los rincones más mágicos de México con experiencias personalizadas
            que transformarán tu forma de viajar.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/destinations" style={{ background: GRADIENT, color: "#fff", fontWeight: 800, fontSize: "14px", padding: "14px 32px", borderRadius: "999px", textDecoration: "none" }}>
              Explorar Destinos 📍
            </Link>
            <Link href="/tours" style={{ background: "transparent", color: "#fff", fontWeight: 800, fontSize: "14px", padding: "14px 32px", borderRadius: "999px", border: "2px solid rgba(255,255,255,0.3)", textDecoration: "none" }}>
              Planea tu Viaje 📅
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ padding: "24px 16px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
            <p style={{ fontSize: "28px", fontWeight: 900, background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── TOURS DESTACADOS ── */}
      <section style={{ padding: "80px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ display: "inline-block", fontSize: "11px", padding: "4px 16px", borderRadius: "999px", border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.15)", color: "#a78bfa", marginBottom: "16px" }}>
            Paquetes de Viaje
          </span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, marginBottom: "12px" }}>
            Conoce tu{" "}
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              próxima aventura
            </span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>
            En compañía de quien más quieres. Descubre destinos únicos y vive experiencias inolvidables.
          </p>
        </div>

        {featuredTours.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {featuredTours.slice(0, 4).map((tour) => (
              <Link key={tour.id} href={`/tours/${tour.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#13131f", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", height: "100%", transition: "border-color 0.2s" }}>
                  {/* Imagen */}
                  <div style={{ height: "200px", position: "relative", background: "#1a1a2e", overflow: "hidden" }}>
                    {tour.imageUrl && (
                      <img src={tour.imageUrl} alt={tour.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                    <span style={{ position: "absolute", top: "12px", left: "12px", background: GRADIENT, color: "#fff", fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "999px" }}>
                      {formatPrice(tour.pricePerPerson)}
                    </span>
                    <span style={{ position: "absolute", bottom: "12px", left: "12px", fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
                      📍 {tour.destination?.state ?? "México"}
                    </span>
                  </div>
                  {/* Body */}
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "8px" }}>{tour.name}</h3>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "12px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {tour.description}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                      <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {TOUR_TYPE_LABEL[tour.tourType] ?? tour.tourType}
                      </span>
                      <span style={{ fontSize: "10px", padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {tour.difficultyLevel}
                      </span>
                    </div>
                    <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                        ⏱ {tour.durationDays} día{tour.durationDays > 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#e91e8c" }}>Ver Detalles →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Placeholder si no hay tours del backend aún
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ background: "#13131f", borderRadius: "16px", height: "340px", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>Próximamente...</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/tours" style={{ display: "inline-block", fontWeight: 800, fontSize: "14px", color: "#fff", padding: "14px 36px", borderRadius: "999px", border: "1px solid rgba(233,30,140,0.5)", textDecoration: "none" }}>
            Ver todos los tours →
          </Link>
        </div>
      </section>

      {/* ── DESTINOS ── */}
      {destinations.length > 0 && (
        <section style={{ padding: "0 48px 80px", background: "#0d0d15" }}>
          <div style={{ textAlign: "center", padding: "64px 0 40px" }}>
            <span style={{ display: "inline-block", fontSize: "11px", padding: "4px 16px", borderRadius: "999px", border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.15)", color: "#a78bfa", marginBottom: "16px" }}>
              Destinos
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900 }}>
              Próximos{" "}
              <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                viajes
              </span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {destinations.slice(0, 8).map((dest) => (
              <Link key={dest.id} href={`/destinations/${dest.id}`} style={{ textDecoration: "none", position: "relative", height: "180px", borderRadius: "12px", overflow: "hidden", display: "block" }}>
                {dest.imageUrl
                  ? <img src={dest.imageUrl} alt={dest.name} className="dest-img" />
                  : <div style={{ width: "100%", height: "100%", background: "#1a1a2e" }} />
                }
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }} />
                <p style={{ position: "absolute", bottom: "12px", left: "12px", fontWeight: 800, fontSize: "14px", color: "#fff" }}>{dest.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── TESTIMONIOS ── */}
      <section style={{ padding: "80px 48px", background: "#0a0a0f" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ display: "inline-block", fontSize: "11px", padding: "4px 16px", borderRadius: "999px", border: "1px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.15)", color: "#a78bfa", marginBottom: "16px" }}>
            Testimonios
          </span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, marginBottom: "12px" }}>
            Nuestros viajeros{" "}
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              cuentan su experiencia
            </span>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>
            Descubre lo que dicen quienes ya vivieron la experiencia Piali
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: "#13131f", borderRadius: "20px", padding: "28px", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: "56px", fontWeight: 900, color: "rgba(233,30,140,0.25)", lineHeight: 1, marginBottom: "12px" }}>"</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, flex: 1, marginBottom: "24px" }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: GRADIENT_135, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 800 }}>{t.name}</p>
                  <p style={{ fontSize: "12px", color: "#e91e8c" }}>{t.tour}</p>
                </div>
                <p style={{ fontSize: "13px", color: "#e91e8c" }}>★★★★★</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ margin: "0 48px 80px", padding: "48px", borderRadius: "24px", border: "1px solid rgba(233,30,140,0.2)", background: "linear-gradient(135deg, rgba(233,30,140,0.12), rgba(139,92,246,0.12))", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, marginBottom: "12px" }}>
          ¿Tienes en mente{" "}
          <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            realizar un viaje?
          </span>
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "32px" }}>
          En grupo, en pareja o individualmente. Comunícate con nosotros para apoyarte.
        </p>
        <Link href="/tours" style={{ display: "inline-block", background: GRADIENT, color: "#fff", fontWeight: 800, fontSize: "15px", padding: "16px 40px", borderRadius: "999px", textDecoration: "none" }}>
          Solicitar Viaje Personalizado
        </Link>
      </section>

    </main>
  );
}