import { LoginForm } from "@/components/auth/LoginForm";
import { PrivacyBanner } from "@/components/shared/PrivacyBanner";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            PulseWell
          </h1>
          <p className="text-sm text-slate-400">
            Iniciá sesión para acceder al panel
          </p>
        </div>

        <LoginForm />

        <PrivacyBanner />
      </div>
    </main>
  );
}
