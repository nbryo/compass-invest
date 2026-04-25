import { Compass, ArrowLeft, AlertTriangle, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HISTORICAL_EVENTS } from "@/data/historical-events";
import { REGIMES } from "@/types/regime";
import type { RegimeType } from "@/types/regime";

function getRegimeColor(type: RegimeType): string {
  switch (type) {
    case "bull_growth":
      return "border-l-emerald-500";
    case "bull_recovery":
      return "border-l-blue-500";
    case "bear_rate_hike":
      return "border-l-amber-500";
    case "bear_recession":
      return "border-l-red-500";
    default:
      return "border-l-slate-500";
  }
}

function getRegimeBadgeColor(type: RegimeType): string {
  switch (type) {
    case "bull_growth":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "bull_recovery":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "bear_rate_hike":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "bear_recession":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

function formatDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  if (months === 0) return "1日（単日イベント）";
  if (months < 12) return `${months}ヶ月`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths === 0
    ? `${years}年`
    : `${years}年${remainingMonths}ヶ月`;
}

export default function HistoryPage() {
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
              <Link
                href="/markets"
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Markets
              </Link>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                History
              </button>
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
          <h2 className="text-xl font-bold text-slate-900">
            History — 歴史的局面
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            過去の主要な市場局面を学び、現在のレジーム判定に活かす
          </p>
        </div>

        <div className="space-y-4">
          {HISTORICAL_EVENTS.map((event) => {
            const regime = REGIMES[event.regime];
            return (
              <Card
                key={event.id}
                className={`bg-white border-l-4 ${getRegimeColor(
                  event.regime
                )} shadow-sm`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {event.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono">
                        {event.nameEn}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(event.startDate)} 〜{" "}
                        {formatDate(event.endDate)}（
                        {formatDuration(event.startDate, event.endDate)}）
                      </p>
                    </div>
                    <Badge
                      className={`${getRegimeBadgeColor(event.regime)} text-xs`}
                    >
                      {regime.nameJa}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    {event.summary}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-md p-4">
                    {event.keyMetrics.vixPeak !== undefined && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          VIX最高値
                        </p>
                        <p className="text-lg font-bold text-red-600 font-mono mt-0.5">
                          {event.keyMetrics.vixPeak.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {event.keyMetrics.sp500Drop !== undefined && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          S&P500下落率
                        </p>
                        <p className="text-lg font-bold text-red-600 font-mono mt-0.5">
                          {event.keyMetrics.sp500Drop.toFixed(1)}%
                        </p>
                      </div>
                    )}
                    {event.keyMetrics.sp500RecoveryMonths !== undefined && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          回復期間
                        </p>
                        <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                          {event.keyMetrics.sp500RecoveryMonths}ヶ月
                        </p>
                      </div>
                    )}
                    {event.keyMetrics.federalFundsRate && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          FF金利推移
                        </p>
                        <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                          {event.keyMetrics.federalFundsRate.start}%→
                          {event.keyMetrics.federalFundsRate.end}%
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        引き金（Triggers）
                      </h4>
                      <ul className="space-y-1.5">
                        {event.triggers.map((trigger, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-600 flex gap-2 leading-relaxed"
                          >
                            <span className="text-amber-600 font-bold mt-0.5">
                              ·
                            </span>
                            <span>{trigger}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-emerald-600" />
                        教訓（Lessons）
                      </h4>
                      <ul className="space-y-1.5">
                        {event.lessons.map((lesson, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-600 flex gap-2 leading-relaxed"
                          >
                            <span className="text-emerald-600 font-bold mt-0.5">
                              ·
                            </span>
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white shadow-sm border border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              レジーム凡例
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(
                [
                  "bull_growth",
                  "bull_recovery",
                  "bear_rate_hike",
                  "bear_recession",
                ] as RegimeType[]
              ).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className={`w-1 h-8 rounded ${
                      type === "bull_growth"
                        ? "bg-emerald-500"
                        : type === "bull_recovery"
                        ? "bg-blue-500"
                        : type === "bear_rate_hike"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {REGIMES[type].nameJa}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {REGIMES[type].nameEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-slate-400 pt-8 pb-4">
          <p>
            歴史的データは公開情報に基づきます。投資判断の参考としてご利用ください。
          </p>
        </footer>
      </div>
    </main>
  );
}
