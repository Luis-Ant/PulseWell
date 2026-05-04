"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import { prisma } from "@/lib/prisma";

function getDashboardPath(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "HR_ANALYST":
      return "/hr";
    case "MANAGER":
      return "/manager";
    default:
      return "/survey";
  }
}

/**
 * Server Action: sign in with email + password.
 *
 * Called from the LoginForm client component via `useActionState`.
 * On success, redirects to the role-appropriate dashboard.
 * On failure, returns an error object that the form displays inline.
 */
export async function signIn(
  _prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Credenciales inválidas. Intentá de nuevo." };
  }

  // Resolve internal user to get the authoritative role for redirect.
  const dbUser = await prisma.user.findUnique({
    where: { supabaseUid: data.user.id },
  });

  const dashboardPath = getDashboardPath(dbUser?.role ?? "EMPLOYEE");

  revalidatePath("/", "layout");
  redirect(dashboardPath);
}

/**
 * Server Action: sign out the current user.
 *
 * Destroys the Supabase session and redirects to the login page.
 * Used as a form action in the protected layout's logout button.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
