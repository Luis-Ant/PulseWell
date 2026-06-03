import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";
import { validateName, validateRole } from "@/lib/admin/validation";

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

  const raw = body as Record<string, unknown>;

  // Validate role if provided
  if (raw?.role !== undefined) {
    const roleResult = validateRole(raw.role);
    if ("code" in roleResult) {
      return NextResponse.json(
        { success: false, error: { code: roleResult.code, message: "Rol inválido." } },
        { status: 400 },
      );
    }
  }

  // Validate teamId if provided
  if (raw?.teamId !== undefined && raw.teamId !== null) {
    const tid = typeof raw.teamId === "string" ? raw.teamId : null;
    if (tid) {
      const team = await prisma.team.findUnique({ where: { id: tid } });
      if (!team) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION", message: "El equipo seleccionado no existe." } },
          { status: 400 },
        );
      }
    }
  }

  // Build update data — only include provided fields
  const updateData: Record<string, unknown> = {};

  if (raw?.name !== undefined) {
    const nameResult = validateName(raw.name);
    if ("code" in nameResult) {
      return NextResponse.json(
        { success: false, error: { code: nameResult.code, message: "El nombre es requerido." } },
        { status: 400 },
      );
    }
    updateData.name = nameResult.value;
  }

  if (raw?.role !== undefined) {
    updateData.role = raw.role;
  }

  if (raw?.teamId !== undefined) {
    const tid = typeof raw.teamId === "string" && raw.teamId.length > 0 ? raw.teamId : null;
    updateData.teamId = tid;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ success: true, data: updated });
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

  // Don't allow deleting yourself
  if (id === user.id) {
    return NextResponse.json(
      { success: false, error: { code: "CONFLICT", message: "No podés eliminar tu propio usuario." } },
      { status: 409 },
    );
  }

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Usuario no encontrado." } },
      { status: 404 },
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true, data: { deleted: true } });
}
