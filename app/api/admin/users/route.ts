import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";
import { validateEmail, validateName, validateRole } from "@/lib/admin/validation";

export async function GET() {
  const user = await getUser();
  if (!user || user.role !== USER_ROLE.ADMIN) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
      { status: 403 },
    );
  }

  const users = await prisma.user.findMany({
    include: { team: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const data = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    teamId: u.teamId,
    teamName: u.team?.name ?? null,
    createdAt: u.createdAt.toISOString(),
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

  const raw = body as Record<string, unknown>;

  // Validate required fields
  const emailResult = validateEmail(raw?.email);
  if ("code" in emailResult) {
    return NextResponse.json(
      { success: false, error: { code: emailResult.code, message: "Email, nombre y rol son requeridos." } },
      { status: 400 },
    );
  }

  const nameResult = validateName(raw?.name);
  if ("code" in nameResult) {
    return NextResponse.json(
      { success: false, error: { code: nameResult.code, message: "Email, nombre y rol son requeridos." } },
      { status: 400 },
    );
  }

  const roleResult = validateRole(raw?.role);
  if ("code" in roleResult) {
    return NextResponse.json(
      { success: false, error: { code: roleResult.code, message: "Rol inválido." } },
      { status: 400 },
    );
  }

  // Check email uniqueness
  const existing = await prisma.user.findUnique({ where: { email: emailResult.value } });
  if (existing) {
    return NextResponse.json(
      { success: false, error: { code: "CONFLICT", message: "Ya existe un usuario con ese email." } },
      { status: 409 },
    );
  }

  // Get organization
  const org = await prisma.organization.findFirst();
  if (!org) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "No hay organización configurada." } },
      { status: 400 },
    );
  }

  // Validate teamId if provided
  const teamId = typeof raw?.teamId === "string" && raw.teamId.length > 0 ? raw.teamId : null;
  if (teamId) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION", message: "El equipo seleccionado no existe." } },
        { status: 400 },
      );
    }
  }

  // Create Supabase Auth user
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const tempPassword = "Temp1234!";
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: emailResult.value,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name: nameResult.value, role: roleResult.value },
  });

  if (authError) {
    return NextResponse.json(
      { success: false, error: { code: "AUTH_ERROR", message: authError.message } },
      { status: 500 },
    );
  }

  // Create Prisma user
  const dbUser = await prisma.user.create({
    data: {
      email: emailResult.value,
      name: nameResult.value,
      role: roleResult.value,
      supabaseUid: authUser.user.id,
      organizationId: org.id,
      teamId,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        tempPassword,
      },
    },
    { status: 201 },
  );
}
