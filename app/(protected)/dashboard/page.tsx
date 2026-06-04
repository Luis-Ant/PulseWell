import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

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

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  redirect(getDashboardPath(user.role));
}
