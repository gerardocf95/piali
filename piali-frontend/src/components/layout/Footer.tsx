import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "32px", textAlign: "center" }}>
      <Image src="/logo.png" alt="Piali" width={60} height={40} style={{ marginBottom: "12px", opacity: 0.7 }} />
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
        © {new Date().getFullYear()} Piali · Pueblos Mágicos de México
      </p>
    </footer>
  );
}