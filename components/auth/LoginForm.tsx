"use client";

import { useActionState } from "react";
import { Loader2, Mail, Lock, Info } from "lucide-react";
import { signIn } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="space-y-4">
      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Mail className="size-3" />
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="hr@pulsewell.demo"
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Lock className="size-3" />
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      {/* Forgot password — disabled for demo */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled
          className="text-[11px] text-slate-600 cursor-not-allowed"
          title="No disponible en la demo"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Error */}
      {state?.error && (
        <div className="rounded-lg border border-red-800/50 bg-red-950/20 px-4 py-2.5">
          <p className="text-sm text-red-400">{state.error}</p>
        </div>
      )}

      {/* Submit */}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-900 px-3 text-[10px] uppercase tracking-wider text-slate-600">
            Cuentas demo
          </span>
        </div>
      </div>

      {/* Demo credentials — cleaner layout */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 size-3.5 shrink-0 text-slate-500" />
          <div>
            <p className="text-[11px] font-medium text-slate-400">Credenciales de prueba</p>
            <div className="mt-2 space-y-0.5">
              {[
                "admin@pulsewell.demo",
                "hr@pulsewell.demo",
                "manager-eng@pulsewell.demo",
                "employee1-eng@pulsewell.demo",
              ].map((email) => (
                <p key={email} className="font-mono text-[11px] text-slate-500">{email}</p>
              ))}
            </div>
            <div className="mt-3 rounded-md border border-cyan-800/30 bg-cyan-950/20 px-3 py-2">
              <p className="text-[11px] text-cyan-400">
                Contraseña: <span className="font-mono font-bold text-cyan-300">Demo1234!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
