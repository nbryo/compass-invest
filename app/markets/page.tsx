import { Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LargeChart } from "@/components/LargeChart";

async function fetchAllIndicators() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/indicators/all`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch indicators");
  }

  return res.json();
}

function getStatistics(data: { value: number }[]) {
  if (!data || data.length === 0) {
    return { high: null, low: null, avg: null };
  }
  const values = data.map((d) => d.value);
  return {
    high: Math.max(...values),
    low: Math.min(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
  };
}

function MarketCard({
  title,
  subtitle,
  value,
  unit,
  history,
  compare,
  color,
  precision = 2,
}: {
  title: string;
  subtitle?: string;
  value: number;
  unit?: string;
  history: { date: string; value: number }[];
  compare: {
    week1: { past: number; changePercent: number } | null;
    month1: { past: number; changePercent: number } | null;
    month3: { past: number; changePercent: number } | null;
  };
  color: "red" | "blue" | "purple" | "green" | "amber";
  precision?: number;
}) {
  const stats = getStatistics(history);

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {subtitle}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900 font-mono">
              {value.toFixed(precision)}
              {unit && <span className="text-base text-slate-500 ml-1">{unit}</span>}
            </p>
          </div>
        </div>

        <div>
          <LargeChart data={history} color={color} height={180} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs text-slate-500 uppercase">高値</p>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
              {stats.high !== null ? stats.high.toFixed(precision) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase">安値</p>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
              {stats.low !== null ? stats.low.toFixed(precision) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase">平均</p>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
              {stats.avg !== null ? stats.avg.toFixed(precision) : "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-md p-3">
          <div>
            <p className="text-xs text-slate-500 uppercase">1週間</p>
            {compare.week1 ? (
              <p
                className={`text-sm font-bold font-mono mt-0.5 ${
                  compare.week1.changePercent >= 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {compare.week1.changePercent >= 0 ? "▲" : "▼"}
                {Math.abs(compare.week1.changePercent).toFixed(2)}%
              </p>
            ) : (
              <p className="text-sm text-slate-400 mt-0.5">—</p>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase">1ヶ月</p>
            {compare.month1 ? (
              <p
                className={`text-sm font-bold font-mono mt-0.5 ${
                  compare.month1.changePercent >= 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {compare.month1.changePercent >= 0 ? "▲" : "▼"}
                {Math.abs(compare.month1.changePercent).toFixed(2)}%
              </p>
            ) : (
              <p className="text-sm text-slate-400 mt-0.5">—</p>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase">3ヶ月</p>
            {compare.month3 ? (
              <p
                className={`text-sm font-bold font-mono mt-0.5 ${
                  compare.month3.changePercent >= 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {compare.month3.changePercent >= 0 ? "▲" : "▼"}
                {Math.abs(compare.month3.changePercent).toFixed(2)}%
              </p>
            ) : (
              <p className="text-sm text-slate-400 mt-0.5">—</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function MarketsPage() {
  const data = await fetchAllIndicators();
  const indicators = data.indicators;

  const vixHistory = (indicators.vix.history || []).map(
    (h: { date: string; close: number }) => ({
      date: h.date,
      value: h.close,
    })
  );
  const sp500History = (indicators.sp500.history || []).map(
    (h: { date: string; close: number }) => ({
      date: h.date,
      value: h.close,
    })
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Compass className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900">
                  Compass Invest
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  市場レジーム分析
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Dashboard
              </Link>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                Markets
              </button>
              <Link
                href="/history"
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                History
              </Link>
            </div>

            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="h-3 w-3" />
              戻る
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Markets</h2>
          <p className="text-sm text-slate-500 mt-1">
            主要マーケット指標の詳細データと過去30日の推移
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketCard
            title="VIX"
            subtitle="CBOE Volatility Index（恐怖指数）"
            value={indicators.vix.value}
            history={vixHistory}
            compare={indicators.vix.compare}
            color="red"
          />

          <MarketCard
            title="S&P 500"
            subtitle="Standard & Poor's 500 Index"
            value={indicators.sp500.value}
            history={sp500History}
            compare={indicators.sp500.compare}
            color="blue"
            precision={0}
          />

          <MarketCard
            title="10年米国債金利"
            subtitle="10-Year Treasury Yield (DGS10)"
            value={indicators.treasury10y.value}
            unit="%"
            history={indicators.treasury10y.history}
            compare={indicators.treasury10y.compare}
            color="amber"
          />

          <MarketCard
            title="Fear & Greed Index"
            subtitle="CNN Fear & Greed Index"
            value={indicators.fearGreed.value}
            history={indicators.fearGreed.history}
            compare={indicators.fearGreed.compare}
            color="purple"
            precision={0}
          />
        </div>

        <footer className="text-center text-xs text-slate-400 pt-8 pb-4">
          <p>Powered by FRED, Yahoo Finance, CNN Fear & Greed Index</p>
        </footer>
      </div>
    </main>
  );
}
