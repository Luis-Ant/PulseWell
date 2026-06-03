import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";
import { validateName } from "@/lib/admin/validation";

export async function GET() {
  const user = await getUser();
  if (!user || user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 },
    );
  }

  const teams = await prisma.team.findMany({
    include: {
      _count: { select: { users: true, surveyResults: true } },
      wellbeingScore: { orderBy: { period: "desc" }, take: 1, select: { owi: true } },
    },
  });

  const data = teams.map((t) => ({
    id: t.id,
    name: t.name,
    userCount: t._count.users,
    responseCount: t._count.surveyResults,
    latestOwi: t.wellbeingScore[0]?.owi ?? null,
  }));

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user || user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION", message: "Invalid JSON body." } },
      { status: 400 },
    );
  }

  const nameResult = validateName((body as Record<string, unknown>)?.name);
  if ("code" in nameResult) {
    return NextResponse.json(
      { success: false, error: { code: nameResult.code, message: "El nombre del equipo es requerido." } },
      { status: 400 },
    );
  }

  const org = await prisma.organization.findFirst();
  if (!org) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "No hay organización configurada." } },
      { status: 400 },
    );
  }

  const team = await prisma.team.create({
    data: { name: nameResult.value, organizationId: org.id },
  });

  return NextResponse.json({ success: true, data: team }, { status: 201 });
}
