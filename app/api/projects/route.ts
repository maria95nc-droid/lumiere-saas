export const dynamic = 'force-dynamic';  
import { NextRequest, NextResponse } from "next/server";  
import prisma from "@/lib/prisma";  
const DEMO_EMAIL = "demo@local.test";  
export async function POST(req: NextRequest) {  
  try {  
    const body = await req.json();  
    const { name, subdomain, description, address, phone, whatsapp, hours, services } = body;  
    if (!name || !subdomain) return NextResponse.json({ error: "Faltan campos." }, { status: 400 });  
    const user = await prisma.user.upsert({ where: { email: DEMO_EMAIL }, update: {}, create: { email: DEMO_EMAIL, name: "Demo" } });  
    const project = await prisma.project.create({ data: { userId: user.id, name, subdomain, description: description||null, address: address||null, phone: phone||null, whatsapp: whatsapp||null, hours: hours||null, services: services||null, status: "draft" } });  
    return NextResponse.json({ project }, { status: 201 });  
  } catch(err: any) {  
    if (err?.code === "P2002") return NextResponse.json({ error: "Subdominio en uso." }, { status: 409 });  
    return NextResponse.json({ error: "Error interno." }, { status: 500 });  
  }  
} 
