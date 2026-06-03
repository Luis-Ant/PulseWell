import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";

export async function GET() {
  const user = await getUser();
  if (!user || user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 }
    );
  }

  const surveys = await prisma.survey.findMany({
    include: { _count: { select: { responses: true } } },
    orderBy: { createdAt: "desc" },
  });

  const data = surveys.map((s) => ({
    id: s.id,
    name: s.name,
    isActive: s.isActive,
    responseCount: s._count.responses,
    createdAt: s.createdAt.toISOString(),
  }));

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user || user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION", message: "El nombre de la encuesta es requerido." } },
      { status: 400 }
    );
  }

  const org = await prisma.organization.findFirst();
  if (!org) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "No hay organización configurada." } },
      { status: 400 }
    );
  }

  const survey = await prisma.survey.create({
    data: { name: name.trim(), isActive: true, organizationId: org.id },
  });

  return NextResponse.json({ success: true, data: survey }, { status: 201 });
}
