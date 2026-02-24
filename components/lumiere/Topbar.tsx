"use client";

import Link from "next/link";

interface TopbarProps {
  variant?: "light" | "dark";
}

export default function Topbar({ variant = "light" }: TopbarProps) {
  return (
    <header className="topbar">
      <Link href="/" className="topbar-logo">
        Lumi<span>è</span>re
      </Link>
      <nav className="topbar-nav">
        <Link href="/#servicios">Servicios</Link>
        <Link href="/#como-funciona">Cómo funciona</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/new" className="btn-primary">
          Crear web
        </Link>
      </nav>
    </header>
  );
}
