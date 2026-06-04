import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";
import { validateName } from "@/lib/admin/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user || user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 },
    );
  }

  const { id } = await params;

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

  const team = await prisma.team.update({
    where: { id },
    data: { name: nameResult.value },
  });

  return NextResponse.json({ success: true, data: team });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUser();
  if (!user || user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 },
    );
  }

  const { id } = await params;

  const team = await prisma.team.findUnique({ where: { id }, select: { name: true } });
  if (!team) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Equipo no encontrado." } },
      { status: 404 },
    );
  }

  const userCount = await prisma.user.count({ where: { teamId: id } });
  if (userCount > 0) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CONFLICT",
          message: `No se puede eliminar "${team.name}" porque tiene ${userCount} usuarios asignados. Reasigná los usuarios a otro equipo antes de eliminar.`,
        },
      },
      { status: 409 },
    );
  }

  await prisma.team.delete({ where: { id } });
  return NextResponse.json({ success: true, data: { deleted: true } });
}
