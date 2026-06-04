import { Check, Minus } from "lucide-react";
import { formatPeriod } from "@/lib/format-utils";

interface HistoryItem {
  period: string;
  responded: boolean;
}

interface HistoryGridProps {
  history: HistoryItem[];
}

export function HistoryGrid({ history }: HistoryGridProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-sm font-semibold text-white">Historial</h3>
      <div className="mt-4 flex gap-3">
        {history.map((item) => (
          <div
            key={item.period}
            className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-slate-800 p-3"
          >
            <span className="text-[10px] text-slate-500">{formatPeriod(item.period)}</span>
            {item.responded ? (
              <Check className="size-5 text-emerald-400" />
            ) : (
              <Minus className="size-5 text-slate-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}