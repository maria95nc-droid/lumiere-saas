import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumière — Plataforma Web para Clínicas Estéticas",
  description:
    "Crea la web de tu clínica estética en minutos. Diseño editorial, reservas online y presencia digital premium.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
