"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
  CartesianGrid,
} from "recharts";

interface LargeChartProps {
  data: { date: string; value: number }[];
  color: "red" | "blue" | "purple" | "green" | "amber";
  height?: number;
  showGrid?: boolean;
}

const colorMap = {
  red: { stroke: "#dc2626", fill: "#fecaca" },
  blue: { stroke: "#2563eb", fill: "#bfdbfe" },
  purple: { stroke: "#9333ea", fill: "#e9d5ff" },
  green: { stroke: "#059669", fill: "#a7f3d0" },
  amber: { stroke: "#d97706", fill: "#fde68a" },
};

export function LargeChart({
  data,
  color,
  height = 200,
  showGrid = true,
}: LargeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400 bg-slate-50 rounded"
        style={{ height }}
      >
        データなし
      </div>
    );
  }

  const colors = colorMap[color];
  const gradientId = `large-gradient-${color}-${Math.random().toString(36).slice(2, 8)}`;

  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.4} />
            <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
        )}
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis
          domain={[minValue - padding, maxValue + padding]}
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toFixed(value < 100 ? 1 : 0)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            fontSize: "12px",
            padding: "8px 12px",
          }}
          labelStyle={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}
          formatter={(value: number) => [value.toFixed(2), ""]}
          labelFormatter={(label) => label}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={colors.stroke}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
