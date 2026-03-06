export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEMO_EMAIL = "demo@local.test";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, subdomain, description, address, phone, whatsapp, hours, services } = body;

    if (!name || !subdomain) {
      return NextResponse.json(
        { error: "Los campos 'name' y 'subdomain' son obligatorios." },
        { status: 400 }
      );
    }

    // Validate subdomain format
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json(
        { error: "El subdominio solo puede contener letras minúsculas, números y guiones." },
        { status: 400 }
      );
    }

    // Upsert demo user
    const user = await prisma.user.upsert({
      where: { email: DEMO_EMAIL },
      update: {},
      create: { email: DEMO_EMAIL, name: "Demo User" },
    });

    // Create project (subdomain is unique, Prisma will throw if duplicate)
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
        status: "draft",
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err: unknown) {
    // Prisma unique constraint violation
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ese subdominio ya está en uso. Elige otro." },
        { status: 409 }
      );
    }

    console.error("[/api/projects POST]", err);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
