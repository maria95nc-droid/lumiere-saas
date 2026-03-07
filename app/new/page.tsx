"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "@/components/lumiere/Topbar";
import Footer from "@/components/lumiere/Footer";

interface FormData {
  name: string; subdomain: string; description: string; address: string;
  phone: string; whatsapp: string; hours: string; services: string;
  slogan: string; instagram: string; facebook: string; email: string;
  years: string; treatments: string; theme: string; primaryColor: string;
}

const INITIAL: FormData = {
  name: "", subdomain: "", description: "", address: "",
  phone: "", whatsapp: "", hours: "", services: "",
  slogan: "", instagram: "", facebook: "", email: "",
  years: "", treatments: "", theme: "premium", primaryColor: "#c9907a",
};

const THEMES = [
  { id: "premium", name: "Premium", desc: "Elegante · Crema y ciruela · Playfair Display", colors: ["#faf7f3", "#c9907a", "#3d2530"] },
  { id: "minimal", name: "Minimalista", desc: "Limpio · Blanco y negro · Tipografía moderna", colors: ["#ffffff", "#1a1a1a", "#888888"] },
  { id: "moderno", name: "Moderno", desc: "Vibrante · Gradientes · Diseño atrevido", colors: ["#f0f4ff", "#6366f1", "#0f172a"] },
];

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function NewProjectPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ subdomain: string; name: string } | null>(null);
  const [step, setStep] = useState(1);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "name" && !prev.subdomain) next.subdomain = slugify(value);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error desconocido"); }
      else { setCreated({ subdomain: data.project.subdomain, name: data.project.name }); setForm(INITIAL); setStep(1); }
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setLoading(false); }
  }

  const stepLabels = ["Estilo", "Información", "Contacto", "Servicios"];

  return (
    <>
      <Topbar />
      <div className="page-shell">
        <div className="page-header">
          <p className="page-eyebrow">Nuevo proyecto</p>
          <h1 className="page-title">Crea tu web de clínica</h1>
        </div>

        {!created && (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
            {stepLabels.map((s, i) => (
              <div key={i} onClick={() => setStep(i + 1)} style={{
                padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.75rem",
                fontFamily: "var(--sans)", letterSpacing: "0.08em", cursor: "pointer",
                background: step === i + 1 ? "var(--plum)" : "transparent",
                color: step === i + 1 ? "white" : "var(--muted)",
                border: `1px solid ${step === i + 1 ? "var(--plum)" : "var(--border-mid)"}`,
                transition: "all 0.2s",
              }}>{i + 1}. {s}</div>
            ))}
          </div>
        )}

        <div className="page-content">
          <div className="form-shell">
            {created ? (
              <div className="form-success">
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✦</div>
                <h2 className="form-success-title">¡Web creada con éxito!</h2>
                <p className="form-success-text">Tu sitio <strong>{created.name}</strong> ya está disponible en:</p>
                <Link href={`/sites/${created.subdomain}`} className="btn-gold" style={{ marginBottom: "1rem" }}>
                  Ver /sites/{created.subdomain} →
                </Link>
                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <button className="btn-outline" onClick={() => setCreated(null)}>+ Crear otro</button>
                  <Link href="/dashboard" className="btn-outline">← Dashboard</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {step === 1 && (
                  <div>
                    <p className="form-section-title">Elige el estilo de tu web</p>
                    <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "1.5rem" }}>Puedes cambiarlo después desde el panel de edición</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                      {THEMES.map((t) => (
                        <div key={t.id} onClick={() => setForm((p) => ({ ...p, theme: t.id }))} style={{
                          border: `2px solid ${form.theme === t.id ? "var(--rose)" : "var(--border)"}`,
                          borderRadius: "12px", padding: "1.25rem", cursor: "pointer",
                          background: form.theme === t.id ? "var(--blush-light)" : "white",
                          transition: "all 0.2s", display: "flex", alignItems: "center", gap: "1rem",
                        }}>
                          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                            {t.colors.map((c, i) => (
                              <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.08)" }} />
                            ))}
                          </div>
                          <div>
                            <div style={{ fontFamily: "var(--serif)", fontSize: "1rem", color: "var(--plum)", fontWeight: 500 }}>
                              {t.name} {form.theme === t.id && <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", background: "var(--rose)", color: "white", borderRadius: "999px", padding: "0.1rem 0.5rem" }}>✓ Seleccionado</span>}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.2rem" }}>{t.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="form-section-title">Color principal</p>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                      {["#c9907a","#a86b55","#7c9e8f","#8b7bb5","#c4a35a","#e08080","#5b8db8","#2d6a4f"].map((c) => (
                        <div key={c} onClick={() => setForm((p) => ({ ...p, primaryColor: c }))} style={{
                          width: 36, height: 36, borderRadius: "50%", background: c, cursor: "pointer",
                          border: form.primaryColor === c ? "3px solid var(--plum)" : "2px solid transparent",
                          boxShadow: form.primaryColor === c ? "0 0 0 2px white, 0 0 0 4px var(--plum)" : "none",
                          transition: "all 0.15s",
                        }} />
                      ))}
                    </div>
                    <div className="form-submit-row">
                      <button type="button" className="btn-primary" onClick={() => setStep(2)}>Siguiente: Información →</button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <p className="form-section-title">Información principal</p>
                    <div className="form-group">
                      <label className="form-label">Nombre de la clínica *</label>
                      <input name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="Centro Estético Lumière" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subdominio *</label>
                      <input name="subdomain" className="form-input" value={form.subdomain} onChange={handleChange} placeholder="centro-lumiere" required pattern="[a-z0-9-]+" />
                      <p className="form-hint">Tu web: <strong>/sites/{form.subdomain || "tu-subdominio"}</strong></p>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Slogan</label>
                      <input name="slogan" className="form-input" value={form.slogan} onChange={handleChange} placeholder="Belleza que transforma · Bienestar que perdura" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Descripción</label>
                      <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} placeholder="Describe tu clínica, su filosofía y lo que la hace especial..." rows={4} />
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Años de experiencia</label>
                        <input name="years" className="form-input" value={form.years} onChange={handleChange} placeholder="10" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nº de tratamientos</label>
                        <input name="treatments" className="form-input" value={form.treatments} onChange={handleChange} placeholder="30+" />
                      </div>
                    </div>
                    <div className="form-submit-row">
                      <button type="button" className="btn-outline" onClick={() => setStep(1)}>← Atrás</button>
                      <button type="button" className="btn-primary" onClick={() => setStep(3)}>Siguiente: Contacto →</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <p className="form-section-title">Contacto & ubicación</p>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input name="phone" className="form-input" value={form.phone} onChange={handleChange} placeholder="+34 600 000 000" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">WhatsApp</label>
                        <input name="whatsapp" className="form-input" value={form.whatsapp} onChange={handleChange} placeholder="+34 600 000 000" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input name="email" className="form-input" value={form.email} onChange={handleChange} placeholder="hola@tuclinica.com" type="email" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dirección</label>
                      <input name="address" className="form-input" value={form.address} onChange={handleChange} placeholder="Calle Gran Vía 1, Madrid" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Horario</label>
                      <input name="hours" className="form-input" value={form.hours} onChange={handleChange} placeholder="Lun–Vie 10:00–20:00 · Sáb 10:00–14:00" />
                    </div>
                    <p className="form-section-title">Redes sociales</p>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Instagram</label>
                        <input name="instagram" className="form-input" value={form.instagram} onChange={handleChange} placeholder="@tuclinica" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Facebook</label>
                        <input name="facebook" className="form-input" value={form.facebook} onChange={handleChange} placeholder="tuclinica" />
                      </div>
                    </div>
                    <div className="form-submit-row">
                      <button type="button" className="btn-outline" onClick={() => setStep(2)}>← Atrás</button>
                      <button type="button" className="btn-primary" onClick={() => setStep(4)}>Siguiente: Servicios →</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <p className="form-section-title">Servicios de tu clínica</p>
                    <div className="form-group">
                      <label className="form-label">Lista de servicios</label>
                      <textarea name="services" className="form-textarea" value={form.services} onChange={handleChange}
                        placeholder={"Hidratación profunda, 45min, 55€\nLimpieza profunda, 60min, 65€\nMasaje relajante, 60min, 65€\nDepilación láser, 30min, 40€"} rows={8} />
                      <p className="form-hint">Formato: Nombre, duración, precio — uno por línea</p>
                    </div>
                    <div style={{ background: "var(--blush-light)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", marginBottom: "1.5rem" }}>
                      <p style={{ fontSize: "0.78rem", color: "var(--earth)", marginBottom: "0.5rem", fontWeight: 500 }}>✦ Resumen</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.8 }}>
                        <strong>Nombre:</strong> {form.name || "—"}<br />
                        <strong>Estilo:</strong> {THEMES.find(t => t.id === form.theme)?.name || "—"}<br />
                        <strong>URL:</strong> /sites/{form.subdomain || "—"}<br />
                        <strong>WhatsApp:</strong> {form.whatsapp || "—"}
                      </p>
                    </div>
                    {error && <div className="form-error">⚠️ {error}</div>}
                    <div className="form-submit-row">
                      <button type="button" className="btn-outline" onClick={() => setStep(3)}>← Atrás</button>
                      <button type="submit" className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
                        {loading ? "Creando tu web..." : "✦ Crear mi web →"}
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
