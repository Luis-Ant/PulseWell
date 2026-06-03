import { LoginForm } from "@/components/auth/LoginForm";
import { PrivacyBanner } from "@/components/shared/PrivacyBanner";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-2xl uppercase tracking-[0.15em] text-white">
            PULSEWELL
          </h1>
          <p className="font-light text-sm text-slate-400">
            Iniciá sesión para acceder al panel
          </p>
        </div>

        <LoginForm />

        <PrivacyBanner />
      </div>
    </main>
  );
}
