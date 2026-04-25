"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MiniChart } from "@/components/MiniChart";

type Period = "now" | "week1" | "month1" | "month3";

interface CompareData {
  past: number;
  change: number;
  changePercent: number;
}

interface CompareSet {
  week1: CompareData | null;
  month1: CompareData | null;
  month3: CompareData | null;
}

interface IndicatorCardsProps {
  vix: {
    value: number;
    changePercent: number;
    history: { date: string; close: number }[];
    compare: CompareSet;
  };
  sp500: {
    value: number;
    ma200Deviation: number | null;
    history: { date: string; close: number }[];
    compare: CompareSet;
  };
  treasury10y: {
    value: number;
    history: { date: string; value: number }[];
    compare: CompareSet;
  };
  fearGreed: {
    value: number;
    classificationJa: string;
    history: { date: string; value: number }[];
    compare: CompareSet;
  };
}

export function IndicatorCards({
  vix,
  sp500,
  treasury10y,
  fearGreed,
}: IndicatorCardsProps) {
  const [period, setPeriod] = useState<Period>("now");

  const periodLabels: Record<Period, string> = {
    now: "現在",
    week1: "1週",
    month1: "1ヶ月",
    month3: "3ヶ月",
  };

  function getCompareForPeriod(compare: CompareSet): CompareData | null {
    if (period === "week1") return compare.week1;
    if (period === "month1") return compare.month1;
    if (period === "month3") return compare.month3;
    return null;
  }

  function renderChange(compare: CompareData | null, isPercent: boolean = false) {
    if (compare === null) {
      return <p className="text-xs mt-1 text-slate-400">— 比較データなし</p>;
    }

    const isPositive = compare.changePercent >= 0;
    const arrow = isPositive ? "▲" : "▼";
    const colorClass = isPositive ? "text-red-600" : "text-emerald-600";

    return (
      <div className="text-xs mt-1 space-y-0.5">
        <p className={`font-mono ${colorClass}`}>
          {arrow} {Math.abs(compare.changePercent).toFixed(2)}%
        </p>
        <p className="text-slate-400 font-mono text-[10px]">
          {periodLabels[period]}前: {compare.past.toFixed(isPercent ? 2 : 0)}
        </p>
      </div>
    );
  }

  const vixChartData = vix.history.map((h) => ({
    date: h.date,
    value: h.close,
  }));
  const sp500ChartData = sp500.history.map((h) => ({
    date: h.date,
    value: h.close,
  }));
  const fearGreedChartData = fearGreed.history;

  const vixCompare = getCompareForPeriod(vix.compare);
  const sp500Compare = getCompareForPeriod(sp500.compare);
  const treasury10yCompare = getCompareForPeriod(treasury10y.compare);
  const fearGreedCompare = getCompareForPeriod(fearGreed.compare);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
          主要指標
        </h3>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-md p-0.5">
          {(["now", "week1", "month1", "month3"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                period === p
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden">
          <CardContent className="pt-6 pb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              VIX
            </p>
            <p className="text-3xl font-bold text-slate-900 font-mono">
              {vix.value.toFixed(2)}
            </p>
            {period === "now" ? (
              <p
                className={`text-xs mt-1 font-mono ${
                  vix.changePercent >= 0 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {vix.changePercent >= 0 ? "▲" : "▼"}
                {Math.abs(vix.changePercent).toFixed(2)}%
              </p>
            ) : (
              renderChange(vixCompare, true)
            )}
            <div className="mt-3 -mx-2">
              <MiniChart data={vixChartData} color="red" height={50} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden">
          <CardContent className="pt-6 pb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              S&P 500
            </p>
            <p className="text-3xl font-bold text-slate-900 font-mono">
              {sp500.value.toFixed(0)}
            </p>
            {period === "now" ? (
              sp500.ma200Deviation !== null && (
                <p className="text-xs mt-1 text-slate-500 font-mono">
                  200MA{" "}
                  {sp500.ma200Deviation >= 0 ? "+" : ""}
                  {sp500.ma200Deviation.toFixed(2)}%
                </p>
              )
            ) : (
              renderChange(sp500Compare)
            )}
            <div className="mt-3 -mx-2">
              <MiniChart data={sp500ChartData} color="blue" height={50} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden">
          <CardContent className="pt-6 pb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              10年金利
            </p>
            <p className="text-3xl font-bold text-slate-900 font-mono">
              {treasury10y.value.toFixed(2)}
              <span className="text-lg ml-1 text-slate-500">%</span>
            </p>
            {period === "now" ? (
              <p className="text-xs mt-1 text-slate-400">最新値</p>
            ) : (
              renderChange(treasury10yCompare, true)
            )}
            <div className="mt-3 -mx-2">
              <MiniChart data={treasury10y.history} color="amber" height={50} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-slate-200 overflow-hidden">
          <CardContent className="pt-6 pb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Fear & Greed
            </p>
            <p className="text-3xl font-bold text-slate-900 font-mono">
              {fearGreed.value}
            </p>
            {period === "now" ? (
              <p className="text-xs mt-1 text-slate-500">
                {fearGreed.classificationJa}
              </p>
            ) : (
              renderChange(fearGreedCompare)
            )}
            <div className="mt-3 -mx-2">
              <MiniChart
                data={fearGreedChartData}
                color="purple"
                height={50}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
