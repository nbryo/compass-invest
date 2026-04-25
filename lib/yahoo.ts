import YahooFinance from "yahoo-finance2";

/**
 * Yahoo Finance クライアント
 * 市場データ（指数、株価）を取得する
 */

const yahooFinance = new YahooFinance();

export interface QuoteData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  date: string;
}

/**
 * 指定したシンボルの最新クォート情報を取得
 * @param symbol - Yahoo Financeシンボル (例: "^VIX", "^GSPC")
 */
export async function getQuote(symbol: string): Promise<QuoteData> {
  const quote = await yahooFinance.quote(symbol);

  if (!quote || typeof quote.regularMarketPrice !== "number") {
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }

  return {
    symbol: quote.symbol || symbol,
    name: quote.longName || quote.shortName || symbol,
    price: quote.regularMarketPrice,
    change: quote.regularMarketChange ?? 0,
    changePercent: quote.regularMarketChangePercent ?? 0,
    date: quote.regularMarketTime
      ? new Date(quote.regularMarketTime).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  };
}

/**
 * 指定したシンボルの過去データを取得
 * @param symbol - Yahoo Financeシンボル
 * @param days - 取得する日数（デフォルト30日）
 */
export async function getHistorical(
  symbol: string,
  days: number = 30
): Promise<{ date: string; close: number }[]> {
  const endDate = new Date();
  const startDate = new Date();
  // 営業日換算で十分な日数を確保（土日祝で約30%欠損するので1.5倍）
  startDate.setDate(startDate.getDate() - Math.ceil(days * 1.5));

  const result = await yahooFinance.chart(symbol, {
    period1: startDate,
    period2: endDate,
    interval: "1d",
  });

  if (!result.quotes || result.quotes.length === 0) {
    throw new Error(`No historical data for ${symbol}`);
  }

  return result.quotes
    .filter((q) => q.close !== null && q.close !== undefined)
    .map((q) => ({
      date: new Date(q.date).toISOString().split("T")[0],
      close: q.close as number,
    }));
}