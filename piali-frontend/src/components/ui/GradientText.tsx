export default function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: "linear-gradient(90deg, #e91e8c, #8b5cf6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      {children}
    </span>
  );
}