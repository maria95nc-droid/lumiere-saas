export const dynamic = 'force-dynamic';

import Link from "next/link";
import prisma from "@/lib/prisma";
import Topbar from "@/components/lumiere/Topbar";
import Footer from "@/components/lumiere/Footer";

const DEMO_EMAIL = "demo@local.test";

export default async function DashboardPage() {
  let projects: Array<{
    id: string;
    name: string;
    subdomain: string;
    description: string | null;
    status: string;
    createdAt: Date;
    services: string | null;
    phone: string | null;
    whatsapp: string | null;
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

  const total = projects.length;
  const activas = projects.filter((p) => p.status === "active").length;
  const borradores = projects.filter((p) => p.status === "draft").length;

  return (
    <>
      <Topbar />
      <div className="page-shell">
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
              No se pudo conectar a la base de datos.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", color: "var(--rose)" }}>◇</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", color: "var(--plum)" }}>{total}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total webs</div>
            </div>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", color: "#2d6a4f" }}>●</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", color: "var(--plum)" }}>{activas}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Activas</div>
            </div>
            <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", color: "var(--muted)" }}>○</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "1.8rem", color: "var(--plum)" }}>{borradores}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Borradores</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--plum)" }}>
              {total} {total === 1 ? "proyecto" : "proyectos"}
            </p>
            <Link href="/new" className="btn-primary">+ Nueva web</Link>
          </div>

          {total === 0 && !dbError && (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.3 }}>◇</div>
              <h2 className="empty-state-title">Aún no tienes webs</h2>
              <p className="empty-state-text">Crea tu primera web en menos de 5 minutos.</p>
              <Link href="/new" className="btn-gold">Crear mi primera web →</Link>
            </div>
          )}

          <div className="projects-grid">
            {projects.map((project) => {
              const serviceList = project.services
                ? project.services.split("\n").filter(Boolean).slice(0, 3)
                : [];
              return (
                <div key={project.id} className="project-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{
                      fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
                      color: project.status === "active" ? "#2d6a4f" : "var(--muted)",
                      background: project.status === "active" ? "#d8f3dc" : "var(--blush-light)",
                      padding: "0.2rem 0.6rem", borderRadius: "999px",
                    }}>
                      {project.status === "active" ? "● Activa" : "○ Borrador"}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                      {new Date(project.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>

                  <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--plum)", marginBottom: "0.25rem" }}>
                    {project.name}
                  </h2>

                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                    /sites/<strong style={{ color: "var(--rose-dark)" }}>{project.subdomain}</strong>
                  </p>

                  {serviceList.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      {serviceList.map((s, i) => (
                        <span key={i} style={{
                          display: "inline-block", fontSize: "0.68rem",
                          background: "var(--blush-light)", color: "var(--earth)",
                          borderRadius: "999px", padding: "0.2rem 0.6rem",
                          margin: "0.15rem", border: "1px solid var(--border)",
                        }}>
                          {s.split(",")[0]}
                        </span>
                      ))}
                    </div>
                  )}

                  {(project.phone || project.whatsapp) && (
                    <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "1rem" }}>
                      📞 {project.phone || project.whatsapp}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                    <Link href={`/sites/${project.subdomain}`} className="btn-gold" style={{ fontSize: "0.7rem", padding: "0.5rem 1rem", flex: 1, textAlign: "center" }}>
                      Ver web →
                    </Link>
                    <Link href={`/new`} className="btn-outline" style={{ fontSize: "0.7rem", padding: "0.5rem 1rem" }}>
                      ✎ Editar
                    </Link>
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
