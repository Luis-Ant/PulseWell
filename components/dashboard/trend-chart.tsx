"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatPeriod } from "@/lib/format-utils";
interface TrendDataPoint {
  period: string;
  [teamName: string]: string | number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
}

const TEAM_COLORS: Record<string, string> = {
  Engineering: "#ef4444", // red-500
  Sales: "#f59e0b", // amber-500
  Operations: "#22c55e", // green-500
  "Customer Success": "#3b82f6", // blue-500
  Marketing: "#a855f7", // purple-500
  Finance: "#06b6d4", // cyan-500
};

const FALLBACK_COLORS = [
  "#a78bfa", // violet-400
  "#f97316", // orange-500
  "#14b8a6", // teal-500
  "#e879f9", // fuchsia-400
  "#2dd4bf", // teal-400
  "#fb923c", // orange-400
];

const CHART_STYLE = {
  gridLine: "#1e293b", // slate-800
  axisText: "#64748b", // slate-500
  tooltipBg: "#0f172a", // slate-900
  tooltipBorder: "#1e293b", // slate-800
  tooltipText: "#e2e8f0", // slate-200
};

function getTeamColor(teamName: string, index: number): string {
  if (teamName in TEAM_COLORS) return TEAM_COLORS[teamName];
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

/**
 * Custom tooltip styled for dark theme.
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: CHART_STYLE.tooltipBg,
        border: `1px solid ${CHART_STYLE.tooltipBorder}`,
        borderRadius: "12px",
        padding: "12px 16px",
      }}
    >
      <p
        style={{
          color: CHART_STYLE.axisText,
          fontSize: "12px",
          marginBottom: "8px",
        }}
      >
        {formatPeriod(label!)}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "4px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: entry.color,
              display: "inline-block",
            }}
          />
          <span style={{ color: CHART_STYLE.tooltipText, fontSize: "13px" }}>
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12">
        <p className="text-sm text-slate-500">Sin datos para mostrar</p>
      </div>
    );
  }

  // Extract team names from the first data point (skip "period")
  const firstPoint = data[0];
  const teamNames = Object.keys(firstPoint).filter((k) => k !== "period");

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/50">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">
        Tendencia de OWI por Equipo
      </h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_STYLE.gridLine}
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tick={{ fill: CHART_STYLE.axisText, fontSize: 12 }}
              axisLine={{ stroke: CHART_STYLE.gridLine }}
              tickLine={false}
              tickFormatter={(val) => formatPeriod(val as string)}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: CHART_STYLE.axisText, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                color: CHART_STYLE.axisText,
              }}
            />
            {teamNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                name={name}
                stroke={getTeamColor(name, index)}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: "#0f172a" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: getTeamColor(name, index) }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
