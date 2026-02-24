import Link from "next/link";
import Topbar from "@/components/lumiere/Topbar";
import Hero from "@/components/lumiere/Hero";
import Servicios from "@/components/lumiere/Servicios";
import ComoFunciona from "@/components/lumiere/ComoFunciona";
import Footer from "@/components/lumiere/Footer";

export default function LandingPage() {
  return (
    <>
      <Topbar />
      <main>
        <Hero />

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-ornament">✦ ✦ ✦</span>
          <div className="divider-line" />
        </div>

        <Servicios />

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-ornament">✦</span>
          <div className="divider-line" />
        </div>

        <ComoFunciona />

        {/* CTA band */}
        <div className="cta-band">
          <p className="cta-band-text">
            ¿Lista para tener<br />
            <em>tu web de ensueño?</em>
          </p>
          <Link href="/new" className="btn-gold">
            Crear mi web ahora →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
