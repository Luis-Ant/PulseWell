/**
 * Privacy disclaimer banner — displayed on the login page.
 *
 * Copy from PRD Section: "Ambiente demo. Los datos utilizados son
 * simulados, anonimizados o sintéticos."
 */
export function PrivacyBanner() {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
      <p className="text-xs leading-relaxed text-slate-500">
        Ambiente demo. Los datos utilizados son simulados, anonimizados o
        sintéticos. Tus respuestas son privadas. Nunca se comparten de forma
        individual.
      </p>
    </div>
  );
}
