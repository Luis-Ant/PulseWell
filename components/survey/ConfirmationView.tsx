import { CheckCircle2 } from "lucide-react";
import { PrivacyBanner } from "@/components/shared/PrivacyBanner";

// ── Types ──────────────────────────────────────────────────────────────
interface ConfirmationViewProps {
  period: string;
}

// ── Component ──────────────────────────────────────────────────────────
export function ConfirmationView({ period }: ConfirmationViewProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="flex flex-col items-center">
        <CheckCircle2 className="size-16 text-emerald-400" />

        <h1 className="mt-6 text-3xl font-bold text-white">
          ¡Gracias por responder!
        </h1>

        <p className="mt-3 text-slate-400">
          Tu respuesta fue registrada para el período{" "}
          <span className="font-semibold text-slate-200">{period}</span>.
        </p>

        <p className="mt-8 max-w-md text-sm leading-relaxed text-slate-500">
          Tus respuestas son anónimas y se usan de forma agregada. Nunca se
          comparten de forma individual.
        </p>

        <div className="mt-8 w-full max-w-md">
          <PrivacyBanner />
        </div>
      </div>
    </div>
  );
}
