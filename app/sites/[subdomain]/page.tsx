export const dynamic = 'force-dynamic';  
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Footer from "@/components/lumiere/Footer";

interface Props {
  params: { subdomain: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const project = await prisma.project.findUnique({
      where: { subdomain: params.subdomain },
    });
    if (!project) return { title: "Clínica no encontrada — Lumière" };
    return {
      title: `${project.name} — Lumière`,
      description: project.description ?? `Web de ${project.name}`,
    };
  } catch {
    return { title: "Lumière" };
  }
}

export default async function SitePage({ params }: Props) {
  let project: {
    id: string;
    name: string;
    subdomain: string;
    description: string | null;
    address: string | null;
    phone: string | null;
    whatsapp: string | null;
    hours: string | null;
    services: string | null;
  } | null = null;

  let dbError = false;

  try {
    project = await prisma.project.findUnique({
      where: { subdomain: params.subdomain },
    });
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="not-found">
        <div className="not-found-code">⚠</div>
        <h1 className="not-found-title">Error de base de datos</h1>
        <p className="not-found-text">No se pudo conectar. Verifica tu configuración de Prisma.</p>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  const serviceList = project.services
    ? project.services.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const hasContact = project.phone || project.whatsapp || project.address || project.hours;

  return (
    <>
      {/* Minimal site topbar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 3rem",
          background: "rgba(253, 250, 246, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            fontWeight: 300,
            letterSpacing: "0.1em",
            color: "var(--charcoal)",
          }}
        >
          {project.name}
        </span>
        <a
          href="#contacto"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--gold)",
            fontFamily: "var(--font-body)",
          }}
        >
          Contactar
        </a>
      </header>

      <main>
        {/* Hero */}
        <section className="site-hero">
          <p className="site-hero-eyebrow">Centro de Estética · Belleza &amp; Bienestar</p>
          <h1 className="site-hero-title">{project.name}</h1>
          {project.description && (
            <p className="site-hero-desc">{project.description}</p>
          )}
          {project.whatsapp && (
            <a
              href={`https://wa.me/${project.whatsapp.replace(/\D/g, "")}`}
              className="btn-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reservar cita por WhatsApp →
            </a>
          )}
        </section>

        {/* Info strip */}
        {hasContact && (
          <div className="site-info" id="contacto">
            {project.address && (
              <div className="site-info-block">
                <span className="site-info-label">Dirección</span>
                <span className="site-info-value">{project.address}</span>
              </div>
            )}
            {project.phone && (
              <div className="site-info-block">
                <span className="site-info-label">Teléfono</span>
                <a href={`tel:${project.phone}`} className="site-info-value">
                  {project.phone}
                </a>
              </div>
            )}
            {project.whatsapp && (
              <div className="site-info-block">
                <span className="site-info-label">WhatsApp</span>
                <a
                  href={`https://wa.me/${project.whatsapp.replace(/\D/g, "")}`}
                  className="site-info-value"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.whatsapp}
                </a>
              </div>
            )}
            {project.hours && (
              <div className="site-info-block">
                <span className="site-info-label">Horario</span>
                <span className="site-info-value">{project.hours}</span>
              </div>
            )}
          </div>
        )}

        {/* Services */}
        {serviceList.length > 0 && (
          <section className="site-services">
            <h2 className="site-services-title">Nuestros tratamientos</h2>
            <div className="site-services-grid">
              {serviceList.map((s) => (
                <div key={s} className="site-service-tag">
                  {s}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="site-cta">
          <h2 className="site-cta-title">
            Reserva tu cita<br />
            <em style={{ fontStyle: "italic", color: "var(--gold-light)" }}>
              hoy mismo
            </em>
          </h2>
          <div className="site-cta-links">
            {project.whatsapp && (
              <a
                href={`https://wa.me/${project.whatsapp.replace(/\D/g, "")}`}
                className="site-cta-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            )}
            {project.phone && (
              <a href={`tel:${project.phone}`} className="site-cta-link">
                Llamar
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Powered by badge */}
      <div
        style={{
          background: "var(--charcoal)",
          borderTop: "1px solid rgba(201,169,110,0.15)",
          padding: "1rem 3rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          href="/"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            color: "rgba(201,169,110,0.4)",
            textTransform: "uppercase",
          }}
        >
          Creado con Lumière ✦
        </a>
      </div>
    </>
  );
}
