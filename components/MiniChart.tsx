"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";

interface MiniChartProps {
  data: { date: string; value: number }[];
  color: "red" | "blue" | "purple" | "green" | "amber";
  height?: number;
}

const colorMap = {
  red: { stroke: "#dc2626", fill: "#fecaca" },
  blue: { stroke: "#2563eb", fill: "#bfdbfe" },
  purple: { stroke: "#9333ea", fill: "#e9d5ff" },
  green: { stroke: "#059669", fill: "#a7f3d0" },
  amber: { stroke: "#d97706", fill: "#fde68a" },
};

export function MiniChart({ data, color, height = 60 }: MiniChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-slate-400"
        style={{ height }}
      >
        データなし
      </div>
    );
  }

  const colors = colorMap[color];
  const gradientId = `gradient-${color}-${Math.random().toString(36).slice(2, 8)}`;

  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.4} />
            <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={[minValue - padding, maxValue + padding]} hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            fontSize: "11px",
            padding: "4px 8px",
          }}
          labelStyle={{ color: "#64748b", fontSize: "10px" }}
          formatter={(value: number) => [value.toFixed(2), ""]}
          labelFormatter={(label) => label}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={colors.stroke}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
