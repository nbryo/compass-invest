import { NextResponse } from "next/server";
import { getFredLatest } from "@/lib/fred";

/**
 * GET /api/fred/treasury2y
 * 2年米国債金利の最新値を返す
 */
export async function GET() {
  try {
    const data = await getFredLatest("DGS2");

    return NextResponse.json({
      seriesId: "DGS2",
      name: "2-Year Treasury Constant Maturity Rate",
      value: data.value,
      date: data.date,
      unit: "percent",
    });
  } catch (error) {
    console.error("Error fetching DGS2:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}