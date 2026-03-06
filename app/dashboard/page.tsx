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
  }> = [];

  let dbError = false;

  try {
    const user = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
      include: {
        projects: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    projects = user?.projects ?? [];
  } catch {
    dbError = true;
  }

  return (
    <>
      <Topbar />
      <div className="page-shell">
        <div className="page-header">
          <p className="page-eyebrow">Dashboard</p>
          <h1 className="page-title">Mis proyectos</h1>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem" }}>
            Usuario: <strong>{DEMO_EMAIL}</strong>
          </p>
        </div>

        <div className="page-content">
          {dbError && (
            <div className="form-error" style={{ marginBottom: "2rem" }}>
              ⚠️ No se pudo conectar a la base de datos. Comprueba que{" "}
              <code>DATABASE_URL</code> es correcta en <code>.env</code> y que has ejecutado{" "}
              <code>npx prisma migrate dev</code>.
            </div>
          )}

          <div className="projects-header">
            <p className="projects-count">
              {projects.length} proyecto{projects.length !== 1 ? "s" : ""}
            </p>
            <Link href="/new" className="btn-primary">
              + Nuevo proyecto
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">◇</div>
              <h2 className="empty-state-title">Aún no tienes proyectos</h2>
              <p className="empty-state-text">
                Crea tu primera web para clínica estética en menos de 5 minutos.
              </p>
              <Link href="/new" className="btn-gold">
                Crear mi primera web →
              </Link>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <p className="project-status">{project.status}</p>
                  <h2 className="project-name">{project.name}</h2>
                  <p className="project-subdomain">
                    /sites/<strong>{project.subdomain}</strong>
                  </p>
                  {project.description && (
                    <p className="project-desc">{project.description}</p>
                  )}
                  <div className="project-actions">
                    <Link
                      href={`/sites/${project.subdomain}`}
                      className="btn-gold"
                      style={{ fontSize: "0.7rem", padding: "0.5rem 1.25rem" }}
                    >
                      Ver web →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
