/**
 * FRED API クライアント
 * セントルイス連邦準備銀行の経済データAPIと通信する
 */

const FRED_BASE_URL = "https://api.stlouisfed.org/fred/series/observations";

export interface FredObservation {
  date: string;
  value: string;
}

export interface FredResponse {
  observations: FredObservation[];
}

/**
 * FREDから特定のシリーズの最新データを取得する
 * @param seriesId - FRED series ID (例: "DGS10" = 10年国債金利)
 * @returns 最新の値と日付
 */
export async function getFredLatest(seriesId: string): Promise<{
  value: number;
  date: string;
}> {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    throw new Error("FRED_API_KEY is not set in environment variables");
  }

  const url = new URL(FRED_BASE_URL);
  url.searchParams.set("series_id", seriesId);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("sort_order", "desc");
  url.searchParams.set("limit", "10"); // 最新10件取得（最新が休日で欠損の場合に備えて）

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`FRED API error: ${response.status} ${response.statusText}`);
  }

  const data: FredResponse = await response.json();

  if (!data.observations || data.observations.length === 0) {
    throw new Error(`No observations found for series: ${seriesId}`);
  }

  // 最新の有効な値を探す（"."は欠損値）
  const latestValid = data.observations.find((obs) => obs.value !== ".");

  if (!latestValid) {
    throw new Error(`No valid observations found for series: ${seriesId}`);
  }

  return {
    value: parseFloat(latestValid.value),
    date: latestValid.date,
  };
}