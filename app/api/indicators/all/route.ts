import { NextResponse } from "next/server";
import { getFredLatest } from "@/lib/fred";
import { getQuote, getHistorical } from "@/lib/yahoo";
import { getFearGreed, classifyFearGreedJa } from "@/lib/feargreed";

/**
 * GET /api/indicators/all
 * レジーム分析に必要な全指標を一度に取得
 */
export async function GET() {
  try {
    // 全データを並列取得（速度のため）
    const [
      treasury10y,
      treasury2y,
      fedfunds,
      vixQuote,
      vixHistory,
      sp500Quote,
      sp500History,
      fearGreed,
    ] = await Promise.all([
      getFredLatest("DGS10"),
      getFredLatest("DGS2"),
      getFredLatest("FEDFUNDS"),
      getQuote("^VIX"),
      getHistorical("^VIX", 30),
      getQuote("^GSPC"),
      getHistorical("^GSPC", 250),
      getFearGreed(),
    ]);

    // S&P500の移動平均計算
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

    // イールドカーブ（10年-2年スプレッド）
    const yieldSpread = treasury10y.value - treasury2y.value;

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      indicators: {
        treasury10y: {
          name: "10年米国債金利",
          value: treasury10y.value,
          date: treasury10y.date,
          unit: "%",
        },
        treasury2y: {
          name: "2年米国債金利",
          value: treasury2y.value,
          date: treasury2y.date,
          unit: "%",
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
          history: vixHistory,
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
        },
        fearGreed: {
          name: "Fear & Greed Index",
          value: fearGreed.value,
          classification: fearGreed.classification,
          classificationJa: classifyFearGreedJa(fearGreed.value),
          date: fearGreed.date,
          history: fearGreed.history,
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
