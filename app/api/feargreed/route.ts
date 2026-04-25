import { NextResponse } from "next/server";
import { getFearGreed, classifyFearGreedJa } from "@/lib/feargreed";

/**
 * GET /api/feargreed
 * CNN Fear & Greed Indexの最新値と過去30日のデータを返す
 */
export async function GET() {
  try {
    const data = await getFearGreed();

    return NextResponse.json({
      name: "CNN Fear & Greed Index",
      value: data.value,
      classification: data.classification,
      classificationJa: classifyFearGreedJa(data.value),
      date: data.date,
      history: data.history,
    });
  } catch (error) {
    console.error("Error fetching Fear & Greed:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
