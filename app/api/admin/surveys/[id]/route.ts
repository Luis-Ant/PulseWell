import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user || user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const { isActive, name } = body;

  const survey = await prisma.survey.findUnique({ where: { id } });
  if (!survey) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Encuesta no encontrada." } },
      { status: 404 }
    );
  }

  const updated = await prisma.survey.update({
    where: { id },
    data: {
      ...(typeof isActive === "boolean" ? { isActive } : {}),
      ...(name && typeof name === "string" ? { name: name.trim() } : {}),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
