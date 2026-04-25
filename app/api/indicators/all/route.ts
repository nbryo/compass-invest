import { NextResponse } from "next/server";
import { getFredLatest, getFredHistory } from "@/lib/fred";
import { getQuote, getHistorical } from "@/lib/yahoo";
import { getFearGreed, classifyFearGreedJa } from "@/lib/feargreed";

/**
 * 配列から「N日前の値」を取得する
 */
function getValueDaysAgo<T extends { date: string }>(
  history: T[],
  daysAgo: number,
  valueKey: keyof T
): number | null {
  if (history.length === 0) return null;

  // 営業日換算で索引を計算（土日除いて約5/7）
  const businessDaysAgo = Math.floor(daysAgo * (5 / 7));
  const index = history.length - 1 - businessDaysAgo;

  if (index < 0) return null;

  const value = history[index][valueKey];
  return typeof value === "number" ? value : null;
}

function calculateChange(current: number, past: number | null) {
  if (past === null || past === 0) return null;
  return {
    past,
    change: current - past,
    changePercent: ((current - past) / past) * 100,
  };
}

export async function GET() {
  try {
    const [
      treasury10y,
      treasury10yHistory,
      treasury2y,
      treasury2yHistory,
      fedfunds,
      vixQuote,
      vixHistory,
      sp500Quote,
      sp500History,
      fearGreed,
    ] = await Promise.all([
      getFredLatest("DGS10"),
      getFredHistory("DGS10", 100),
      getFredLatest("DGS2"),
      getFredHistory("DGS2", 100),
      getFredLatest("FEDFUNDS"),
      getQuote("^VIX"),
      getHistorical("^VIX", 100),
      getQuote("^GSPC"),
      getHistorical("^GSPC", 250),
      getFearGreed(),
    ]);

    const sp500Closes = sp500History.map((h) => h.close);
    const ma50 =
      sp500Closes.length >= 50
        ? sp500Closes.slice(-50).reduce((a, b) => a + b, 0) / 50
        : null;
    const ma200 =
      sp500Closes.length >= 200
        ? sp500Closes.slice(-200).reduce((a, b) => a + b, 0) / 200
        : null;
    const ma200Deviation = ma200
      ? ((sp500Quote.price - ma200) / ma200) * 100
      : null;

    const yieldSpread = treasury10y.value - treasury2y.value;

    const vixCompare = {
      week1: calculateChange(
        vixQuote.price,
        getValueDaysAgo(vixHistory, 7, "close")
      ),
      month1: calculateChange(
        vixQuote.price,
        getValueDaysAgo(vixHistory, 30, "close")
      ),
      month3: calculateChange(
        vixQuote.price,
        getValueDaysAgo(vixHistory, 90, "close")
      ),
    };

    const sp500Compare = {
      week1: calculateChange(
        sp500Quote.price,
        getValueDaysAgo(sp500History, 7, "close")
      ),
      month1: calculateChange(
        sp500Quote.price,
        getValueDaysAgo(sp500History, 30, "close")
      ),
      month3: calculateChange(
        sp500Quote.price,
        getValueDaysAgo(sp500History, 90, "close")
      ),
    };

    const treasury10yCompare = {
      week1: calculateChange(
        treasury10y.value,
        getValueDaysAgo(treasury10yHistory, 7, "value")
      ),
      month1: calculateChange(
        treasury10y.value,
        getValueDaysAgo(treasury10yHistory, 30, "value")
      ),
      month3: calculateChange(
        treasury10y.value,
        getValueDaysAgo(treasury10yHistory, 90, "value")
      ),
    };

    const treasury2yCompare = {
      week1: calculateChange(
        treasury2y.value,
        getValueDaysAgo(treasury2yHistory, 7, "value")
      ),
      month1: calculateChange(
        treasury2y.value,
        getValueDaysAgo(treasury2yHistory, 30, "value")
      ),
      month3: calculateChange(
        treasury2y.value,
        getValueDaysAgo(treasury2yHistory, 90, "value")
      ),
    };

    const fearGreedCompare = {
      week1: calculateChange(
        fearGreed.value,
        getValueDaysAgo(fearGreed.history, 7, "value")
      ),
      month1: calculateChange(
        fearGreed.value,
        getValueDaysAgo(fearGreed.history, 30, "value")
      ),
      month3: calculateChange(
        fearGreed.value,
        getValueDaysAgo(fearGreed.history, 90, "value")
      ),
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      indicators: {
        treasury10y: {
          name: "10年米国債金利",
          value: treasury10y.value,
          date: treasury10y.date,
          unit: "%",
          history: treasury10yHistory.slice(-30),
          compare: treasury10yCompare,
        },
        treasury2y: {
          name: "2年米国債金利",
          value: treasury2y.value,
          date: treasury2y.date,
          unit: "%",
          compare: treasury2yCompare,
        },
        fedfunds: {
          name: "FF金利",
          value: fedfunds.value,
          date: fedfunds.date,
          unit: "%",
        },
        yieldSpread: {
          name: "イールドカーブ（10年-2年）",
          value: yieldSpread,
          unit: "%",
          inverted: yieldSpread < 0,
        },
        vix: {
          name: "VIX恐怖指数",
          value: vixQuote.price,
          change: vixQuote.change,
          changePercent: vixQuote.changePercent,
          date: vixQuote.date,
          history: vixHistory.slice(-30),
          compare: vixCompare,
        },
        sp500: {
          name: "S&P 500",
          value: sp500Quote.price,
          change: sp500Quote.change,
          changePercent: sp500Quote.changePercent,
          date: sp500Quote.date,
          ma50,
          ma200,
          ma200Deviation,
          history: sp500History.slice(-30),
          compare: sp500Compare,
        },
        fearGreed: {
          name: "Fear & Greed Index",
          value: fearGreed.value,
          classification: fearGreed.classification,
          classificationJa: classifyFearGreedJa(fearGreed.value),
          date: fearGreed.date,
          history: fearGreed.history,
          compare: fearGreedCompare,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching all indicators:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
