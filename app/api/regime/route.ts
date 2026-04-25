import { NextResponse } from "next/server";
import { getFredLatest } from "@/lib/fred";
import { getQuote, getHistorical } from "@/lib/yahoo";
import { getFearGreed } from "@/lib/feargreed";
import { analyzeRegime } from "@/lib/regime";

/**
 * GET /api/regime
 * 現在のマーケットレジームを判定して返す
 */
export async function GET() {
  try {
    const [
      treasury10y,
      treasury2y,
      fedfunds,
      vixQuote,
      sp500Quote,
      sp500History,
      fearGreed,
    ] = await Promise.all([
      getFredLatest("DGS10"),
      getFredLatest("DGS2"),
      getFredLatest("FEDFUNDS"),
      getQuote("^VIX"),
      getQuote("^GSPC"),
      getHistorical("^GSPC", 250),
      getFearGreed(),
    ]);

    const sp500Closes = sp500History.map((h) => h.close);
    const ma200 =
      sp500Closes.length >= 200
        ? sp500Closes.slice(-200).reduce((a, b) => a + b, 0) / 200
        : null;
    const ma200Deviation = ma200
      ? ((sp500Quote.price - ma200) / ma200) * 100
      : null;

    const yieldSpread = treasury10y.value - treasury2y.value;

    const analysis = analyzeRegime({
      treasury10y: { value: treasury10y.value },
      treasury2y: { value: treasury2y.value },
      fedfunds: { value: fedfunds.value },
      yieldSpread: { value: yieldSpread, inverted: yieldSpread < 0 },
      vix: { value: vixQuote.price },
      sp500: {
        value: sp500Quote.price,
        ma200,
        ma200Deviation,
      },
      fearGreed: { value: fearGreed.value },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing regime:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
