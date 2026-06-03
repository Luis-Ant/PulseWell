import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <p className="font-display text-8xl font-bold text-slate-800">404</p>
      <h1 className="mt-6 text-2xl font-bold text-white">
        Página no encontrada
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
        La página que buscás no existe o fue movida.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </main>
  );
}
