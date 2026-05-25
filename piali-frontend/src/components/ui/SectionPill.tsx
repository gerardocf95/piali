export default function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] px-4 py-1 rounded-full border mb-4"
      style={{ background: "rgba(139,92,246,0.18)", borderColor: "rgba(139,92,246,0.35)", color: "#a78bfa" }}>
      {children}
    </span>
  );
}