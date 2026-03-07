export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface Props { params: { subdomain: string } }

export async function generateMetadata({ params }: Props) {
  try {
    const p = await prisma.project.findUnique({ where: { subdomain: params.subdomain } });
    if (!p) return { title: "Clínica no encontrada — Lumière" };
    return { title: `${p.name} · Centro de Estética`, description: p.description ?? `Centro de estética ${p.name}` };
  } catch { return { title: "Lumière" }; }
}

export default async function SitePage({ params }: Props) {
  let project: {
    id: string; name: string; subdomain: string; description: string | null;
    address: string | null; phone: string | null; whatsapp: string | null;
    hours: string | null; services: string | null;
    theme: string | null; primaryColor: string | null;
    slogan: string | null; years: string | null; treatments: string | null;
    email: string | null; instagram: string | null; facebook: string | null;
  } | null = null;
  let dbError = false;

  try {
    project = await prisma.project.findUnique({ where: { subdomain: params.subdomain } }) as typeof project;
  } catch { dbError = true; }

  if (dbError) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "serif" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Error de conexión</h1>
      </div>
    </div>
  );

  if (!project) notFound();

  const p = project as any;

  const theme = p.theme || "premium";
  const primary = p.primaryColor || "#c9907a";

  // THEME TOKENS
  const T = {
    premium: {
      bg: "#faf7f3", bg2: "#f5ede6", text: "#3d2530", muted: "#8a6e65",
      accent: primary, dark: "#3d2530", border: "rgba(200,160,140,0.2)",
      serif: "'Playfair Display',Georgia,serif", sans: "'DM Sans',sans-serif",
      navBg: "rgba(250,247,243,0.95)", heroBg: "linear-gradient(135deg,#faf7f3 0%,#f5ede6 100%)",
      cardBg: "#ffffff", btnRadius: "0px",
    },
    minimal: {
      bg: "#ffffff", bg2: "#f5f5f5", text: "#1a1a1a", muted: "#666666",
      accent: primary, dark: "#1a1a1a", border: "rgba(0,0,0,0.1)",
      serif: "'DM Sans',sans-serif", sans: "'DM Sans',sans-serif",
      navBg: "rgba(255,255,255,0.95)", heroBg: "linear-gradient(135deg,#ffffff 0%,#f5f5f5 100%)",
      cardBg: "#f9f9f9", btnRadius: "4px",
    },
    moderno: {
      bg: "#f0f4ff", bg2: "#e8eeff", text: "#0f172a", muted: "#6366f1",
      accent: primary, dark: "#0f172a", border: "rgba(99,102,241,0.15)",
      serif: "'DM Sans',sans-serif", sans: "'DM Sans',sans-serif",
      navBg: "rgba(240,244,255,0.95)", heroBg: "linear-gradient(135deg,#f0f4ff 0%,#e8eeff 60%,#ddd6fe 100%)",
      cardBg: "#ffffff", btnRadius: "8px",
    },
  }[theme] || {
    bg: "#faf7f3", bg2: "#f5ede6", text: "#3d2530", muted: "#8a6e65",
    accent: primary, dark: "#3d2530", border: "rgba(200,160,140,0.2)",
    serif: "'Playfair Display',Georgia,serif", sans: "'DM Sans',sans-serif",
    navBg: "rgba(250,247,243,0.95)", heroBg: "linear-gradient(135deg,#faf7f3 0%,#f5ede6 100%)",
    cardBg: "#ffffff", btnRadius: "0px",
  };

  const serviceList = project.services
    ? project.services.split("\n").map((s: string) => s.trim()).filter(Boolean)
    : ["Tratamientos Faciales", "Tratamientos Corporales", "Masajes & Bienestar", "Manos y Pies", "Depilación"];

  const waNumber = project.whatsapp?.replace(/\D/g, "") ?? project.phone?.replace(/\D/g, "") ?? "34600000000";
  const waUrl = `https://wa.me/${waNumber}?text=Hola, me gustaría reservar una cita en ${project.name}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${T.bg};color:${T.text};font-family:${T.sans};font-weight:300;line-height:1.7;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .wrap{max-width:1200px;margin:0 auto;padding:0 40px}
        @media(max-width:700px){.wrap{padding:0 20px}}

        /* TOPBAR */
        .topbar{position:fixed;top:0;left:0;right:0;z-index:200;background:${T.navBg};backdrop-filter:blur(18px);border-bottom:1px solid ${T.border};transition:box-shadow .4s}
        .topbar-inner{display:flex;align-items:center;justify-content:space-between;height:70px;gap:28px}
        .brand-name{font-family:${T.serif};font-size:1.2rem;color:${T.text};letter-spacing:.05em}
        .nav{display:flex;align-items:center;gap:26px}
        .nav a{font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:${T.muted};transition:color .3s}
        .nav a:hover{color:${T.accent}}
        @media(max-width:900px){.nav{display:none}}

        /* BOOKBAR */
        .bookbar{position:fixed;bottom:0;left:0;right:0;z-index:100;background:${T.dark};border-top:1px solid ${T.border}}
        .bookbar-inner{display:flex;align-items:center;justify-content:space-between;padding:13px 40px;gap:20px}
        .bookbar-title{font-family:${T.serif};font-size:1rem;color:rgba(255,255,255,.9)}
        .bookbar-sub{font-size:.65rem;letter-spacing:.12em;color:rgba(255,255,255,.4);margin-top:2px}
        .bookbar-actions{display:flex;gap:10px}
        @media(max-width:700px){.bookbar-title,.bookbar-sub{display:none}.bookbar-inner{justify-content:center}}

        /* BUTTONS */
        .btn{display:inline-flex;align-items:center;gap:8px;padding:12px 26px;font-family:${T.sans};font-size:.68rem;font-weight:400;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;border:none;border-radius:${T.btnRadius};transition:all .3s}
        .btn-primary{background:${T.accent};color:#fff}.btn-primary:hover{opacity:.88}
        .btn-outline{background:transparent;color:${T.text};border:1px solid ${T.border}}.btn-outline:hover{border-color:${T.accent};color:${T.accent}}
        .btn-ghost-light{background:transparent;color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.25)}.btn-ghost-light:hover{border-color:rgba(255,255,255,.5);color:#fff}

        /* HERO */
        .hero{min-height:100vh;display:flex;align-items:center;padding-top:70px;background:${T.heroBg};position:relative;overflow:hidden}
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .hero-eyebrow{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:${T.accent};margin-bottom:1.5rem;display:flex;align-items:center;gap:10px}
        .hero-eyebrow::before{content:'';width:28px;height:1px;background:${T.accent}}
        .hero-h1{font-family:${T.serif};font-size:clamp(2.5rem,5vw,4.5rem);font-weight:300;line-height:1.1;color:${T.text};margin-bottom:1.5rem}
        .hero-h1 em{font-style:italic;color:${T.accent}}
        .hero-lead{font-size:.95rem;color:${T.muted};line-height:1.8;margin-bottom:2.5rem;max-width:480px}
        .hero-btns{display:flex;gap:14px;flex-wrap:wrap}
        .hero-stats{display:flex;gap:32px;margin-top:3rem;padding-top:2rem;border-top:1px solid ${T.border}}
        .hero-stat-num{font-family:${T.serif};font-size:1.8rem;color:${T.text};line-height:1}
        .hero-stat-label{font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:${T.muted};margin-top:4px}
        .hero-card{background:${T.cardBg};border:1px solid ${T.border};border-radius:16px;padding:24px;backdrop-filter:blur(12px)}
        .hero-card-dark{background:${T.dark};border-radius:16px;padding:24px;color:#fff}
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr}.hero-cards{display:none}}

        /* TICKER */
        .ticker{background:${T.bg2};border-top:1px solid ${T.border};border-bottom:1px solid ${T.border};padding:14px 0;overflow:hidden}
        .ticker-track{display:flex;gap:48px;animation:ticker 30s linear infinite;width:max-content}
        .ticker-track:hover{animation-play-state:paused}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .ticker-item{font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:${T.muted};white-space:nowrap;display:flex;align-items:center;gap:16px}
        .ticker-dot{width:5px;height:5px;border-radius:50%;background:${T.accent};flex-shrink:0}

        /* SERVICIOS */
        .servicios{padding:120px 0;background:${T.bg}}
        .section-eyebrow{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;color:${T.accent};margin-bottom:1rem}
        .section-title{font-family:${T.serif};font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:300;color:${T.text};margin-bottom:1.5rem;line-height:1.2}
        .section-title em{font-style:italic;color:${T.accent}}
        .servicios-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem;margin-top:3rem}
        .servicio-card{background:${T.cardBg};border:1px solid ${T.border};border-radius:12px;padding:1.5rem;transition:all .3s;position:relative;overflow:hidden}
        .servicio-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:${T.accent};transform:scaleX(0);transition:transform .35s;transform-origin:left}
        .servicio-card:hover{border-color:${T.accent};transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.08)}
        .servicio-card:hover::after{transform:scaleX(1)}
        .servicio-num{font-size:.65rem;letter-spacing:.15em;color:${T.accent};margin-bottom:.75rem}
        .servicio-name{font-family:${T.serif};font-size:1.1rem;color:${T.text};margin-bottom:.5rem}
        .servicio-meta{font-size:.75rem;color:${T.muted};display:flex;gap:12px}

        /* CONTACTO */
        .contacto{padding:120px 0;background:${T.dark};color:#fff}
        .contacto-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
        .contacto-title{font-family:${T.serif};font-size:2.5rem;font-weight:300;color:#fff;margin-bottom:1.5rem;line-height:1.2}
        .contacto-title em{font-style:italic;color:${T.accent}}
        .contacto-item{display:flex;gap:16px;align-items:flex-start;margin-bottom:1.5rem}
        .contacto-icon{width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
        .contacto-item-label{font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:.25rem}
        .contacto-item-value{font-size:.9rem;color:rgba(255,255,255,.85)}
        .contacto-form{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:2rem;position:relative;overflow:hidden}
        .contacto-form::before{content:'';position:absolute;top:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,${T.accent},transparent)}

        /* FOOTER */
        footer{background:${T.dark};border-top:1px solid rgba(255,255,255,.05);padding:40px 0 100px;text-align:center}
        footer .brand-name{color:rgba(255,255,255,.8);font-size:1.1rem}
        footer p{font-size:.72rem;color:rgba(255,255,255,.3);margin-top:.5rem}

        @media(max-width:900px){
          .contacto-grid{grid-template-columns:1fr}
          .hero-stats{gap:20px}
        }
      `}</style>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="wrap">
          <div className="topbar-inner">
            <div className="brand-name">{project.name}</div>
            <nav className="nav">
              <a href="#servicios">Servicios</a>
              <a href="#contacto">Contacto</a>
            </nav>
            <a href={waUrl} className="btn btn-primary" style={{ borderRadius: T.btnRadius }}>
              Reservar cita
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="wrap" style={{ width: "100%" }}>
          <div className="hero-grid">
            <div>
              <p className="hero-eyebrow">Centro de estética de alta gama</p>
              <h1 className="hero-h1">
                Tu momento<br />
                <em>de belleza</em><br />
                y bienestar
              </h1>
              <p className="hero-lead">
                {project.description || `Bienvenida a ${project.name}, donde cada visita es una experiencia única de bienestar y belleza.`}
              </p>
              {project.slogan && (
                <p style={{ fontSize: ".85rem", color: T.accent, fontStyle: "italic", marginBottom: "1.5rem" }}>
                  "{project.slogan}"
                </p>
              )}
              <div className="hero-btns">
                <a href={waUrl} className="btn btn-primary" style={{ borderRadius: T.btnRadius }}>
                  Reservar por WhatsApp →
                </a>
                <a href="#servicios" className="btn btn-outline" style={{ borderRadius: T.btnRadius }}>
                  Ver servicios
                </a>
              </div>
              <div className="hero-stats">
                {[
                  { num: project.years ? `+${project.years}` : "+10", label: "Años de experiencia" },
                  { num: project.treatments ? `+${project.treatments}` : "+30", label: "Tratamientos" },
                  { num: "5.0 ★", label: "Valoración Google" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="hero-stat-num">{s.num}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-cards" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="hero-card">
                <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={T.accent}><path d="M12 2l2.9 6.2 6.8.8-5 4.6 1.4 6.7L12 17.9 5.9 20.3 7.3 13.6 2.3 9l6.8-.8L12 2z"/></svg>
                  ))}
                  <span style={{ fontSize: ".72rem", color: T.muted, marginLeft: "6px" }}>5.0 Google</span>
                </div>
                <p style={{ fontFamily: T.serif, fontSize: "1rem", color: T.text, fontStyle: "italic" }}>
                  "Una experiencia increíble. El trato es exquisito y los resultados son visibles desde la primera sesión."
                </p>
                <p style={{ fontSize: ".72rem", color: T.muted, marginTop: "12px" }}>— Ana García</p>
              </div>
              <div className="hero-card-dark">
                <p style={{ fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: T.accent, marginBottom: "12px" }}>
                  Servicios destacados
                </p>
                {serviceList.slice(0, 3).map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.06)", fontSize: ".82rem", color: "rgba(255,255,255,.8)" }}>
                    <span>{s.split(",")[0]}</span>
                    {s.split(",")[2] && <span style={{ color: T.accent }}>{s.split(",")[2].trim()}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...Array(2)].map((_, j) => (
            ["+Años de experiencia", "Productos certificados", "Trato exquisito", "Horario amplio", "Espacio exclusivo", "Bonos y tarjetas regalo"].map((item, i) => (
              <span key={`${j}-${i}`} className="ticker-item">
                <span className="ticker-dot" />
                {item}
              </span>
            ))
          ))}
        </div>
      </div>

      {/* SERVICIOS */}
      <section className="servicios" id="servicios">
        <div className="wrap">
          <p className="section-eyebrow">Nuestros tratamientos</p>
          <h2 className="section-title">Todo lo que <em>necesitas</em></h2>
          <div className="servicios-grid">
            {serviceList.map((s, i) => {
              const parts = s.split(",");
              return (
                <div key={i} className="servicio-card">
                  <div className="servicio-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="servicio-name">{parts[0]}</div>
                  <div className="servicio-meta">
                    {parts[1] && <span>⏱ {parts[1].trim()}</span>}
                    {parts[2] && <span style={{ color: T.accent, fontWeight: 500 }}>{parts[2].trim()}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <a href={waUrl} className="btn btn-primary" style={{ borderRadius: T.btnRadius }}>
              Reservar tratamiento →
            </a>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contacto" id="contacto">
        <div className="wrap">
          <div className="contacto-grid">
            <div>
              <p style={{ fontSize: ".68rem", letterSpacing: ".2em", textTransform: "uppercase", color: T.accent, marginBottom: "1rem" }}>
                Reserva tu cita
              </p>
              <h2 className="contacto-title">Tu momento<br /><em>empieza aquí</em></h2>
              <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.55)", marginBottom: "2rem", lineHeight: 1.8 }}>
                Contáctanos y te ayudamos a elegir el tratamiento perfecto para ti.
              </p>
              {project.address && (
                <div className="contacto-item">
                  <div className="contacto-icon">📍</div>
                  <div>
                    <div className="contacto-item-label">Dirección</div>
                    <div className="contacto-item-value">{project.address}</div>
                  </div>
                </div>
              )}
              {project.phone && (
                <div className="contacto-item">
                  <div className="contacto-icon">📞</div>
                  <div>
                    <div className="contacto-item-label">Teléfono</div>
                    <div className="contacto-item-value">{project.phone}</div>
                  </div>
                </div>
              )}
              {project.hours && (
                <div className="contacto-item">
                  <div className="contacto-icon">🕐</div>
                  <div>
                    <div className="contacto-item-label">Horario</div>
                    <div className="contacto-item-value">{project.hours}</div>
                  </div>
                </div>
              )}
              {project.instagram && (
                <div className="contacto-item">
                  <div className="contacto-icon">📸</div>
                  <div>
                    <div className="contacto-item-label">Instagram</div>
                    <div className="contacto-item-value">{project.instagram}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="contacto-form">
              <p style={{ fontFamily: T.serif, fontSize: "1.3rem", color: "#fff", marginBottom: "1.5rem" }}>
                Solicitar cita
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { placeholder: "Tu nombre" },
                  { placeholder: "Tu teléfono" },
                  { placeholder: "Tratamiento de interés" },
                ].map((f, i) => (
                  <input key={i} placeholder={f.placeholder} style={{
                    background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "8px", padding: "12px 16px", color: "#fff", fontSize: ".85rem",
                    outline: "none", width: "100%", fontFamily: T.sans,
                  }} readOnly />
                ))}
                <a href={waUrl} className="btn btn-primary" style={{ borderRadius: T.btnRadius, justifyContent: "center", marginTop: ".5rem" }}>
                  Enviar por WhatsApp →
                </a>
                <p style={{ fontSize: ".68rem", color: "rgba(255,255,255,.3)", textAlign: "center" }}>
                  Te responderemos en menos de 24 horas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="brand-name">{project.name}</div>
          <p>© {new Date().getFullYear()} {project.name} · Todos los derechos reservados</p>
          {project.email && (
            <p style={{ marginTop: ".5rem" }}>{project.email}</p>
          )}
        </div>
      </footer>

      {/* BOOKBAR */}
      <div className="bookbar">
        <div className="bookbar-inner">
          <div>
            <div className="bookbar-title">Reserva tu momento de bienestar</div>
            <div className="bookbar-sub">Respuesta en menos de 24h · Sin compromiso</div>
          </div>
          <div className="bookbar-actions">
            <a href={waUrl} className="btn btn-primary" style={{ borderRadius: T.btnRadius }}>WhatsApp</a>
            {project.phone && (
              <a href={`tel:${project.phone}`} className="btn btn-ghost-light" style={{ borderRadius: T.btnRadius }}>Llamar</a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
