const PASOS = [
  { icon: "✦", title: "Rellena el formulario", text: "Nombre de tu clínica, servicios, teléfono, horarios. Solo tarda 3 minutos." },
  { icon: "◆", title: "Generamos tu web", text: "Creamos tu sitio con diseño editorial premium bajo tu subdominio único." },
  { icon: "◈", title: "Comparte tu URL", text: "Comparte el enlace en Instagram, WhatsApp o en tu tarjeta de visita." },
];

export default function ComoFunciona() {
  return (
    <section className="section section-alt" id="como-funciona">
      <div className="section-header">
        <p className="section-eyebrow">Proceso</p>
        <h2 className="section-title">
          De cero a web en<br />
          <em>menos de 5 minutos</em>
        </h2>
      </div>
      <div className="features-grid">
        {PASOS.map((p) => (
          <div key={p.title} className="feature-item">
            <div className="feature-icon" style={{ color: "var(--gold)", fontFamily: "var(--font-display)" }}>
              {p.icon}
            </div>
            <h3 className="feature-title">{p.title}</h3>
            <p className="feature-text">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
