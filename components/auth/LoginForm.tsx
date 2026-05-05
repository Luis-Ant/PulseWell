"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-400"
        >
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

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-400"
        >
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

      {state?.error && (
        <div className="rounded-lg border border-red-800 bg-red-950/30 px-4 py-2.5">
          <p className="text-sm text-red-400">{state.error}</p>
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900 p-4">
        <p className="mb-2 text-sm font-medium text-slate-400">
          Credenciales demo:
        </p>
        <p className="font-mono text-xs text-slate-500">
          hr@pulsewell.demo / Demo1234!
        </p>
      </div>
    </form>
  );
}
