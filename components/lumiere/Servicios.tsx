const SERVICIOS = [
  { n: "01", nombre: "Tratamientos Faciales", desc: "Hidratación profunda, antiedad, manchas y luminosidad para una piel perfecta." },
  { n: "02", nombre: "Medicina Estética", desc: "Botox, rellenos dérmicos y bioestimulación con los mejores materiales." },
  { n: "03", nombre: "Tecnología Láser", desc: "Depilación láser, rejuvenecimiento y tratamiento de imperfecciones cutáneas." },
  { n: "04", nombre: "Corporal & Bienestar", desc: "Reductores, drenajes y tratamientos de relajación para cuerpo y mente." },
];

export default function Servicios() {
  return (
    <section className="section" id="servicios">
      <div className="section-header">
        <p className="section-eyebrow">Lo que incluye tu web</p>
        <h2 className="section-title">
          Todo lo que tu clínica<br />
          <em>necesita mostrar</em>
        </h2>
      </div>
      <div className="services-grid">
        {SERVICIOS.map((s) => (
          <div key={s.n} className="service-card">
            <div className="service-number">{s.n}</div>
            <h3 className="service-name">{s.nombre}</h3>
            <p className="service-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
