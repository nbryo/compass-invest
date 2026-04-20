import { NextResponse } from "next/server";
import { getFredLatest } from "@/lib/fred";

/**
 * GET /api/fred/treasury10y
 * 10年米国債金利の最新値を返す
 */
export async function GET() {
  try {
    const data = await getFredLatest("DGS10");

    return NextResponse.json({
      seriesId: "DGS10",
      name: "10-Year Treasury Constant Maturity Rate",
      value: data.value,
      date: data.date,
      unit: "percent",
    });
  } catch (error) {
    console.error("Error fetching DGS10:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}