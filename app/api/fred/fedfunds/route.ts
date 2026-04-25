import { NextResponse } from "next/server";
import { getFredLatest } from "@/lib/fred";

/**
 * GET /api/fred/fedfunds
 * FF金利（フェデラルファンド金利）の最新値を返す
 */
export async function GET() {
  try {
    const data = await getFredLatest("FEDFUNDS");

    return NextResponse.json({
      seriesId: "FEDFUNDS",
      name: "Federal Funds Effective Rate",
      value: data.value,
      date: data.date,
      unit: "percent",
    });
  } catch (error) {
    console.error("Error fetching FEDFUNDS:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}