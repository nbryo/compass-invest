/**
 * CNN Fear & Greed Index クライアント
 * 非公式エンドポイントを使用
 */

const FEAR_GREED_URL =
  "https://production.dataviz.cnn.io/index/fearandgreed/graphdata";

export interface FearGreedData {
  value: number;
  classification: string;
  date: string;
  history: { date: string; value: number }[];
}

/**
 * Fear & Greed Indexの分類
 * @param value 0-100の値
 */
function classifyFearGreed(value: number): string {
  if (value <= 25) return "Extreme Fear";
  if (value <= 45) return "Fear";
  if (value <= 55) return "Neutral";
  if (value <= 75) return "Greed";
  return "Extreme Greed";
}

/**
 * 日本語分類
 */
export function classifyFearGreedJa(value: number): string {
  if (value <= 25) return "極度の恐怖";
  if (value <= 45) return "恐怖";
  if (value <= 55) return "中立";
  if (value <= 75) return "強欲";
  return "極度の強欲";
}

export async function getFearGreed(): Promise<FearGreedData> {
  const response = await fetch(FEAR_GREED_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
    // Next.js のキャッシュを5分に設定
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(
      `Fear & Greed API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!data.fear_and_greed) {
    throw new Error("Invalid Fear & Greed response structure");
  }

  const current = data.fear_and_greed;
  const historical = data.fear_and_greed_historical?.data || [];

  // 過去30日分を抽出
  const history = historical
    .slice(-90)
    .map((item: { x: number; y: number }) => ({
      date: new Date(item.x).toISOString().split("T")[0],
      value: Math.round(item.y),
    }));

  return {
    value: Math.round(current.score),
    classification: classifyFearGreed(current.score),
    date: new Date(current.timestamp).toISOString().split("T")[0],
    history,
  };
}
