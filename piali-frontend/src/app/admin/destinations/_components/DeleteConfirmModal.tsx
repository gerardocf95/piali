"use client";

// ─────────────────────────────────────────────────────────────────────────────
// DeleteConfirmModal
//
// Recibe:
//   name      → nombre del destino que se va a eliminar (para mostrarlo)
//   onConfirm → callback que ejecuta el delete real
//   onCancel  → callback que cierra el modal sin hacer nada
//   loading   → mientras se ejecuta el DELETE, el botón muestra spinner
// ─────────────────────────────────────────────────────────────────────────────

const GRADIENT = "linear-gradient(135deg, #e91e8c, #8b5cf6)";

interface Props {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmModal({ name, onConfirm, onCancel, loading }: Props) {
  return (
    // Overlay oscuro que cubre toda la pantalla
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}
      // Clic fuera del modal lo cierra (igual que presionar "Cancelar")
      onClick={onCancel}
    >
      {/* Card del modal — stopPropagation evita que el clic interno cierre el overlay */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#13131f",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "20px",
          padding: "32px",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
        }}
      >
        {/* Icono */}
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "rgba(239,68,68,0.12)",
          border: "1px solid rgba(239,68,68,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", margin: "0 auto 20px",
        }}>
          🗑️
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "10px" }}>
          ¿Eliminar destino?
        </h3>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "28px", lineHeight: 1.6 }}>
          Estás por eliminar <strong style={{ color: "#fff" }}>{name}</strong>.
          Esta acción no se puede deshacer.
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* Cancelar */}
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, padding: "12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "rgba(255,255,255,0.65)",
              fontSize: "14px", fontWeight: 700,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            }}
          >
            Cancelar
          </button>

          {/* Confirmar */}
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: "12px",
              background: loading ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.85)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "14px", fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Nunito', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Eliminando...
              </>
            ) : "Sí, eliminar"}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}