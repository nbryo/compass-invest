import { NextResponse } from "next/server";
import { getQuote, getHistorical } from "@/lib/yahoo";

/**
 * GET /api/yahoo/vix
 * VIX恐怖指数の最新値と過去30日チャート用データを返す
 */
export async function GET() {
  try {
    const [quote, history] = await Promise.all([
      getQuote("^VIX"),
      getHistorical("^VIX", 30),
    ]);

    return NextResponse.json({
      symbol: "^VIX",
      name: "CBOE Volatility Index (VIX)",
      value: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
      date: quote.date,
      history,
    });
  } catch (error) {
    console.error("Error fetching VIX:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}