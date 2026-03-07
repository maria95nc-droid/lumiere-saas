export const dynamic = 'force-dynamic';

import Link from "next/link";
import prisma from "@/lib/prisma";
import Topbar from "@/components/lumiere/Topbar";
import Footer from "@/components/lumiere/Footer";

const DEMO_EMAIL = "demo@local.test";

const THEME_LABELS: Record<string, { name: string; colors: string[] }> = {
  premium: { name: "Premium", colors: ["#faf7f3", "#c9907a", "#3d2530"] },
  minimal: { name: "Minimalista", colors: ["#ffffff", "#1a1a1a", "#888888"] },
  moderno: { name: "Moderno", colors: ["#f0f4ff", "#6366f1", "#0f172a"] },
};

export default async function DashboardPage() {
  let projects: Array<{
    id: string; name: string; subdomain: string;
    description: string | null; status: string;
    createdAt: Date; services: string | null;
    phone: string | null; whatsapp: string | null;
    slogan: string | null; theme: string | null;
  }> = [];
  let dbError = false;

  try {
    const user = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
      include: { projects: { orderBy: { createdAt: "desc" } } },
    });
    projects = (user?.projects ?? []) as unknown as typeof projects;
  } catch {
    dbError = true;
  }

  return (
    <>
      <Topbar />
      <div className="page-shell">

        {/* CABECERA */}
        <div className="page-header" style={{ paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
          <p className="page-eyebrow">Panel de control</p>
          <h1 className="page-title">Mis webs</h1>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>
            Usuario: <strong>{DEMO_EMAIL}</strong>
          </p>
        </div>

        <div className="page-content">
          {dbError && (
            <div className="form-error" style={{ marginBottom: "2rem" }}>
              ⚠️ No se pudo conectar a la base de datos.
            </div>
          )}

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              { label: "Webs creadas", value: projects.length, icon: "◇" },
              { label: "Activas", value: projects.filter(p => p.status === "active").length, icon: "●" },
              { label: "Borradores", value: projects.filter(p => p.status === "draft").length, icon: "○" },
            ].map((s, i) => (
              <div key={i} style={{
                background: "white", border: "1px solid var(--border)", borderRadius: "12px",
                padding: "1.25rem", textAlign: "center",
              }}>
                <div style={{ fontSize: "1.5rem", color: "var(--rose)", marginBottom: "0.25rem" }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", color: "var(--plum)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* HEADER PROYECTOS */}
          <div className="projects-header" style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--plum)" }}>
              {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"}
            </p>
            <Link href="/new" className="btn-primary">+ Nueva web</Link>
          </div>

          {/* EMPTY STATE */}
          {projects.length === 0 && !dbError && (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.3 }}>◇</div>
              <h2 className="empty-state-title">Aún no tienes webs</h2>
              <p className="empty-state-text">Crea tu primera web para clínica estética en menos de 5 minutos.</p>
              <Link href="/new" className="btn-gold">Crear mi primera web →</Link>
            </div>
          )}

          {/* GRID DE PROYECTOS */}
          <div className="projects-grid">
            {projects.map((project) => {
              const theme = THEME_LABELS[project.theme ?? "premium"] ?? THEME_LABELS.premium;
              const serviceList = project.services ? project.services.split("\n").filter(Boolean).slice(0, 3) : [];
              return (
                <div key={project.id} className="project-card" style={{ display: "flex", flexDirection: "column", gap: "0" }}>

                  {/* TOP BAR DE COLORES DEL TEMA */}
                  <div style={{ height: "6px", borderRadius: "10px 10px 0 0", background: `linear-gradient(90deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`, margin: "-1px -1px 0 -1px" }} />

                  <div style={{ padding: "1.25rem" }}>
                    {/* STATUS + TEMA */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <span style={{
                        fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
                        color: project.status === "active" ? "#2d6a4f" : "var(--muted)",
                        background: project.status === "active" ? "#d8f3dc" : "var(--blush-light)",
                        padding: "0.2rem 0.6rem", borderRadius: "999px",
                      }}>
                        {project.status === "active" ? "● Activa" : "○ Borrador"}
                      </span>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {theme.colors.map((c, i) => (
                          <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.1)" }} />
                        ))}
                        <span style={{ fontSize: "0.65rem", color: "var(--muted)", marginLeft: "4px" }}>{theme.name}</span>
                      </div>
                    </div>

                    {/* NOMBRE */}
                    <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--plum)", marginBottom: "0.25rem" }}>
                      {project.name}
                    </h2>

                    {/* SLOGAN */}
                    {project.slogan && (
                      <p style={{ fontSize: "0.78rem", color: "var(--earth)", fontStyle: "italic", marginBottom: "0.5rem" }}>
                        "{project.slogan}"
                      </p>
                    )}

                    {/* URL */}
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                      /sites/<strong style={{ color: "var(--rose-dark)" }}>{project.subdomain}</strong>
                    </p>

                    {/* SERVICIOS PREVIEW */}
                    {serviceList.length > 0 && (
                      <div style={{ marginBottom: "1rem" }}>
                        {serviceList.map((s, i) => (
                          <span key={i} style={{
                            display: "inline-block", fontSize: "0.68rem", background: "var(--blush-light)",
                            color: "var(--earth)", borderRadius: "999px", padding: "0.2rem 0.6rem",
                            margin: "0.15rem", border: "1px solid var(--border)",
                          }}>{s.split(",")[0]}</span>
                        ))}
                        {project.services && project.services.split("\n").length > 3 && (
                          <span style={{ fontSize: "0.68rem", color: "var(--muted)", marginLeft: "4px" }}>
                            +{project.services.split("\n").length - 3} más
                          </span>
                        )}
                      </div>
                    )}

                    {/* CONTACTO */}
                    {(project.phone || project.whatsapp) && (
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "1rem" }}>
                        📞 {project.phone || project.whatsapp}
                      </p>
                    )}

                    {/* ACCIONES */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "auto" }}>
                      <Link href={`/sites/${project.subdomain}`} className="btn-gold" style={{ fontSize: "0.7rem", padding: "0.5rem 1rem", flex: 1, textAlign: "center" }}>
                        Ver web →
                      </Link>
                      <Link href={`/new`} className="btn-outline" style={{ fontSize: "0.7rem", padding: "0.5rem 1rem" }}>
                        ✎ Editar
                      </Link>
                      <button style={{
                        fontSize: "0.7rem", padding: "0.5rem 0.75rem", border: "1px solid var(--border)",
                        borderRadius: "6px", background: "transparent", color: "var(--muted)", cursor: "pointer",
                      }} title="Copiar enlace" onClick={() => {}}>
                        ⎘
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
