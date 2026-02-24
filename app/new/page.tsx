"use client";

import { useState } from "react";
import Link from "next/link";
import Topbar from "@/components/lumiere/Topbar";
import Footer from "@/components/lumiere/Footer";

interface FormData {
  name: string;
  subdomain: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
  services: string;
}

const INITIAL: FormData = {
  name: "",
  subdomain: "",
  description: "",
  address: "",
  phone: "",
  whatsapp: "",
  hours: "",
  services: "",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewProjectPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ subdomain: string; name: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "name" && !prev.subdomain) {
        next.subdomain = slugify(value);
      }
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

      if (!res.ok) {
        setError(data.error ?? "Error desconocido");
      } else {
        setCreated({ subdomain: data.project.subdomain, name: data.project.name });
        setForm(INITIAL);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Topbar />
      <div className="page-shell">
        <div className="page-header">
          <p className="page-eyebrow">Nuevo proyecto</p>
          <h1 className="page-title">Crea tu web de clínica</h1>
        </div>

        <div className="page-content">
          <div className="form-shell">
            {created ? (
              <div className="form-success">
                <h2 className="form-success-title">¡Web creada con éxito! ✦</h2>
                <p className="form-success-text">
                  Tu sitio <strong>{created.name}</strong> ya está disponible en:
                </p>
                <Link
                  href={`/sites/${created.subdomain}`}
                  className="btn-gold"
                  style={{ marginBottom: "1rem" }}
                >
                  Ver /sites/{created.subdomain} →
                </Link>
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="btn-outline"
                    onClick={() => setCreated(null)}
                  >
                    Crear otro proyecto
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="form-section-title">Información principal</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="name">Nombre de la clínica *</label>
                  <input
                    id="name"
                    name="name"
                    className="form-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Centro Estético Lumière"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="subdomain">Subdominio *</label>
                  <input
                    id="subdomain"
                    name="subdomain"
                    className="form-input"
                    value={form.subdomain}
                    onChange={handleChange}
                    placeholder="centro-lumiere"
                    required
                    pattern="[a-z0-9-]+"
                    title="Solo letras minúsculas, números y guiones"
                  />
                  <p className="form-hint">
                    Tu web será accesible en <strong>/sites/{form.subdomain || "tu-subdominio"}</strong>
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-textarea"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Breve descripción de tu clínica y su filosofía..."
                  />
                </div>

                <p className="form-section-title">Contacto & ubicación</p>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Teléfono</label>
                    <input
                      id="phone"
                      name="phone"
                      className="form-input"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="whatsapp">WhatsApp</label>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      className="form-input"
                      value={form.whatsapp}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Dirección</label>
                  <input
                    id="address"
                    name="address"
                    className="form-input"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Calle Gran Vía 1, Madrid"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="hours">Horario</label>
                  <input
                    id="hours"
                    name="hours"
                    className="form-input"
                    value={form.hours}
                    onChange={handleChange}
                    placeholder="Lun–Vie 10:00–20:00 · Sáb 10:00–14:00"
                  />
                </div>

                <p className="form-section-title">Servicios</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="services">Lista de servicios</label>
                  <textarea
                    id="services"
                    name="services"
                    className="form-textarea"
                    value={form.services}
                    onChange={handleChange}
                    placeholder="Tratamiento Facial, Botox, Rellenos, Láser, Mesoterapia, Depilación"
                  />
                  <p className="form-hint">Separados por comas</p>
                </div>

                {error && (
                  <div className="form-error">⚠️ {error}</div>
                )}

                <div className="form-submit-row">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? "Creando..." : "Crear web →"}
                  </button>
                  <Link href="/dashboard" className="btn-outline">
                    Cancelar
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
