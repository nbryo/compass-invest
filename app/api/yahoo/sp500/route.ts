import { NextResponse } from "next/server";
import { getQuote, getHistorical } from "@/lib/yahoo";

/**
 * GET /api/yahoo/sp500
 * S&P500の最新値と過去200日のチャート用データを返す
 * （200日移動平均計算用に長めに取得）
 */
export async function GET() {
  try {
    const [quote, history] = await Promise.all([
      getQuote("^GSPC"),
      getHistorical("^GSPC", 250), // 200日移動平均のために少し余裕を持たせて250日
    ]);

    // 50日移動平均と200日移動平均を計算
    const closes = history.map((h) => h.close);
    const ma50 = closes.length >= 50
      ? closes.slice(-50).reduce((a, b) => a + b, 0) / 50
      : null;
    const ma200 = closes.length >= 200
      ? closes.slice(-200).reduce((a, b) => a + b, 0) / 200
      : null;

    // 移動平均からの乖離率
    const ma50Deviation = ma50 ? ((quote.price - ma50) / ma50) * 100 : null;
    const ma200Deviation = ma200 ? ((quote.price - ma200) / ma200) * 100 : null;

    return NextResponse.json({
      symbol: "^GSPC",
      name: "S&P 500",
      value: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      date: quote.date,
      ma50,
      ma200,
      ma50Deviation,
      ma200Deviation,
      history: history.slice(-30), // チャート表示用は直近30日
    });
  } catch (error) {
    console.error("Error fetching S&P500:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}