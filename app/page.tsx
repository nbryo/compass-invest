import { Compass } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndicatorCards } from "@/components/IndicatorCards";

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

interface RegimeResponse {
  regime: {
    type: string;
    nameJa: string;
    nameEn: string;
    description: string;
    characteristics: string[];
    favorableAssets: string[];
  };
  confidence: number;
  alertLevel: "low" | "medium" | "high" | "critical";
  reasoning: string[];
  axes: {
    monetary: string;
    economy: string;
  };
  timestamp: string;
}

interface IndicatorsResponse {
  indicators: {
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
  };
}

async function fetchData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [regimeRes, indicatorsRes] = await Promise.all([
    fetch(`${baseUrl}/api/regime`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/indicators/all`, { cache: "no-store" }),
  ]);

  if (!regimeRes.ok || !indicatorsRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const regime: RegimeResponse = await regimeRes.json();
  const indicators: IndicatorsResponse = await indicatorsRes.json();

  return { regime, indicators };
}

function getAlertColor(level: string): string {
  switch (level) {
    case "low": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
    case "high": return "bg-orange-50 text-orange-700 border-orange-200";
    case "critical": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function getAlertLabel(level: string): string {
  switch (level) {
    case "low": return "低";
    case "medium": return "中";
    case "high": return "高";
    case "critical": return "極めて高い";
    default: return "不明";
  }
}

function getRegimeAccent(type: string): string {
  switch (type) {
    case "bull_growth": return "border-l-emerald-500";
    case "bull_recovery": return "border-l-blue-500";
    case "bear_rate_hike": return "border-l-amber-500";
    case "bear_recession": return "border-l-red-500";
    default: return "border-l-slate-500";
  }
}

function getMonetaryLabel(status: string): string {
  if (status === "easing") return "緩和";
  if (status === "tightening") return "引締め";
  return "中立";
}

function getEconomyLabel(status: string): string {
  if (status === "improving") return "改善";
  if (status === "deteriorating") return "悪化";
  return "中立";
}

export default async function Home() {
  const { regime, indicators } = await fetchData();

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
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                Dashboard
              </button>
              <Link
                href="/markets"
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Markets
              </Link>
              <button
                disabled
                className="px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
                title="準備中"
              >
                History
              </button>
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500">最終更新</p>
              <p className="text-xs text-slate-700 font-mono">
                {new Date(regime.timestamp).toLocaleString("ja-JP", {
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Card
          className={`bg-white border-l-4 ${getRegimeAccent(
            regime.regime.type
          )} shadow-sm`}
        >
          <div className="p-6 pb-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Current Regime
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                  {regime.regime.nameJa}
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-mono">
                  {regime.regime.nameEn}
                </p>
              </div>
              <Badge className={`${getAlertColor(regime.alertLevel)} text-xs`}>
                警戒度 {getAlertLabel(regime.alertLevel)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  信頼度
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
                  {Math.round(regime.confidence * 100)}
                  <span className="text-sm font-normal text-slate-500 ml-1">
                    %
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  金融環境
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {getMonetaryLabel(regime.axes.monetary)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  景気
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {getEconomyLabel(regime.axes.economy)}
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-50 rounded-none border-b border-slate-100">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                概要
              </TabsTrigger>
              <TabsTrigger value="characteristics" className="text-xs sm:text-sm">
                特徴
              </TabsTrigger>
              <TabsTrigger value="assets" className="text-xs sm:text-sm">
                注目資産
              </TabsTrigger>
              <TabsTrigger value="reasoning" className="text-xs sm:text-sm">
                判定根拠
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6 m-0">
              <p className="text-slate-700 leading-relaxed">
                {regime.regime.description}
              </p>
            </TabsContent>

            <TabsContent value="characteristics" className="p-6 m-0">
              <ul className="space-y-3">
                {regime.regime.characteristics.map((char, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-3 leading-relaxed">
                    <span className="text-blue-600 font-bold mt-0.5">·</span>
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="assets" className="p-6 m-0">
              <p className="text-xs text-slate-500 mb-3">
                この局面で相対的に強いとされる資産クラス
              </p>
              <ul className="space-y-3">
                {regime.regime.favorableAssets.map((asset, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-3 leading-relaxed">
                    <span className="text-emerald-600 font-bold mt-0.5">·</span>
                    <span>{asset}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="reasoning" className="p-6 m-0">
              <p className="text-xs text-slate-500 mb-3">
                以下の指標分析からこの判定が導かれました
              </p>
              <ul className="space-y-3">
                {regime.reasoning.map((reason, i) => (
                  <li
                    key={i}
                    className={`text-sm flex gap-3 leading-relaxed ${
                      reason.startsWith("---")
                        ? "text-amber-700 font-semibold mt-3 border-t border-slate-100 pt-3"
                        : "text-slate-700"
                    }`}
                  >
                    {!reason.startsWith("---") && (
                      <span className="text-slate-400 font-bold mt-0.5">·</span>
                    )}
                    <span>{reason.replace(/^---|---$/g, "").trim()}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </Card>

        <IndicatorCards
          vix={indicators.indicators.vix}
          sp500={indicators.indicators.sp500}
          treasury10y={indicators.indicators.treasury10y}
          fearGreed={indicators.indicators.fearGreed}
        />

        <footer className="text-center text-xs text-slate-400 pt-8 pb-4">
          <p>Powered by FRED, Yahoo Finance, CNN Fear & Greed Index</p>
        </footer>
      </div>
    </main>
  );
}
