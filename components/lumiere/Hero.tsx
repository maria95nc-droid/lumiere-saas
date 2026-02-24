import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hero-eyebrow fade-up fade-up-1">Plataforma SaaS para clínicas estéticas</p>
        <h1 className="hero-title fade-up fade-up-2">
          Tu clínica,<br />
          <em>una obra</em><br />
          de arte digital
        </h1>
        <p className="hero-subtitle fade-up fade-up-3">
          Crea la web de tu centro estético en minutos. Diseño editorial premium,
          ficha de servicios, contacto y reservas — sin necesidad de programar.
        </p>
        <div className="hero-cta fade-up fade-up-4">
          <Link href="/new" className="btn-primary">
            Comenzar gratis
          </Link>
          <Link href="/dashboard" className="btn-outline">
            Ver demo
          </Link>
        </div>
      </div>
      <div className="hero-right">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: "8rem 4rem 4rem",
            gap: "2rem",
          }}
        >
          {/* Decorative cards */}
          <div
            style={{
              background: "var(--warm-white)",
              border: "1px solid var(--border)",
              borderRadius: "2px",
              padding: "2rem",
              width: "100%",
              maxWidth: "380px",
              boxShadow: "0 8px 40px rgba(42,37,34,0.08)",
            }}
          >
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem" }}>
              Clínica Ejemplo
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 300, color: "var(--charcoal)", marginBottom: "0.5rem" }}>
              Centro de Belleza Aria
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Tratamientos faciales · Mesoterapia · Bioestimulación · Láser corporal
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <span style={{ padding: "0.4rem 1rem", background: "var(--charcoal)", color: "var(--cream)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: "2px" }}>
                Ver web →
              </span>
            </div>
          </div>

          <div
            style={{
              background: "var(--charcoal)",
              borderRadius: "2px",
              padding: "1.5rem 2rem",
              width: "100%",
              maxWidth: "380px",
            }}
          >
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
              Listo en minutos
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 300, color: "var(--cream)", lineHeight: 1.4 }}>
              Rellena el formulario, obtén tu URL y comparte tu web al instante.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.75rem",
              width: "100%",
              maxWidth: "380px",
            }}
          >
            {["Tratamientos", "Reservas", "Contacto"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "0.85rem",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  textAlign: "center",
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  color: "var(--muted)",
                  background: "var(--warm-white)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
