export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEMO_EMAIL = "demo@local.test";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, subdomain, description, address, phone, whatsapp, hours, services, slogan, email, instagram, facebook, years, treatments, theme, primaryColor } = body;

    if (!name || !subdomain) {
      return NextResponse.json({ error: "Los campos 'name' y 'subdomain' son obligatorios." }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json({ error: "El subdominio solo puede contener letras minúsculas, números y guiones." }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: {},
      create: { email: DEMO_EMAIL, name: "Demo User" },
    });

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        subdomain,
        description: description || null,
        address: address || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        hours: hours || null,
        services: services || null,
        slogan: slogan || null,
        email: email || null,
        instagram: instagram || null,
        facebook: facebook || null,
        years: years || null,
        treatments: treatments || null,
        theme: theme || "premium",
        primaryColor: primaryColor || "#c9907a",
        status: "active",
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "Ese subdominio ya está en uso. Elige otro." }, { status: 409 });
    }
    console.error("[/api/projects POST]", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}