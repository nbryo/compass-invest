import type { RegimeAnalysis, AlertLevel } from "@/types/regime";
import { REGIMES } from "@/types/regime";

/**
 * 統合APIから取得したindicatorsを基にレジームを判定する
 */
export interface IndicatorsInput {
  treasury10y: { value: number };
  treasury2y: { value: number };
  fedfunds: { value: number };
  yieldSpread: { value: number; inverted: boolean };
  vix: { value: number };
  sp500: {
    value: number;
    ma200: number | null;
    ma200Deviation: number | null;
  };
  fearGreed: { value: number };
}

/**
 * 金融環境の判定
 * FF金利の絶対水準と、過去の金利推移から判定
 */
function judgeMonetary(input: IndicatorsInput): {
  status: "easing" | "tightening" | "neutral";
  reasoning: string;
} {
  const ff = input.fedfunds.value;

  if (ff <= 3.0) {
    return {
      status: "easing",
      reasoning: `FF金利${ff.toFixed(2)}%は緩和的水準（3%以下）`,
    };
  } else if (ff >= 4.0) {
    return {
      status: "tightening",
      reasoning: `FF金利${ff.toFixed(2)}%は引き締め水準（4%以上）`,
    };
  } else {
    return {
      status: "neutral",
      reasoning: `FF金利${ff.toFixed(2)}%は中立水準（3-4%）`,
    };
  }
}

/**
 * 景気環境の判定
 * 複数指標の組み合わせで判定
 */
function judgeEconomy(input: IndicatorsInput): {
  status: "improving" | "deteriorating" | "neutral";
  reasoning: string[];
} {
  const reasoning: string[] = [];
  let positiveScore = 0;
  let negativeScore = 0;

  if (input.sp500.ma200Deviation !== null) {
    const dev = input.sp500.ma200Deviation;
    if (dev > 5) {
      positiveScore += 2;
      reasoning.push(
        `S&P500は200日MAから+${dev.toFixed(2)}%（強い上昇トレンド）`
      );
    } else if (dev > 0) {
      positiveScore += 1;
      reasoning.push(
        `S&P500は200日MAから+${dev.toFixed(2)}%（上昇トレンド）`
      );
    } else if (dev < -5) {
      negativeScore += 2;
      reasoning.push(
        `S&P500は200日MAから${dev.toFixed(2)}%（強い下降トレンド）`
      );
    } else {
      negativeScore += 1;
      reasoning.push(
        `S&P500は200日MAから${dev.toFixed(2)}%（下降トレンド）`
      );
    }
  }

  const spread = input.yieldSpread.value;
  if (input.yieldSpread.inverted) {
    negativeScore += 2;
    reasoning.push(
      `イールドカーブ逆転（${spread.toFixed(2)}%）→ 景気後退の先行指標`
    );
  } else if (spread > 1.0) {
    positiveScore += 1;
    reasoning.push(
      `イールドカーブ正常(+${spread.toFixed(2)}%）→ 景気拡大示唆`
    );
  } else {
    reasoning.push(
      `イールドカーブ平坦(+${spread.toFixed(2)}%）→ 景気判断は中立`
    );
  }

  const vix = input.vix.value;
  if (vix < 15) {
    positiveScore += 1;
    reasoning.push(`VIX ${vix.toFixed(2)}（低位）→ 市場の安心感`);
  } else if (vix > 25) {
    negativeScore += 2;
    reasoning.push(`VIX ${vix.toFixed(2)}（高位）→ 市場のストレス`);
  } else {
    reasoning.push(`VIX ${vix.toFixed(2)}（平常）`);
  }

  let status: "improving" | "deteriorating" | "neutral";
  if (positiveScore - negativeScore >= 2) {
    status = "improving";
  } else if (negativeScore - positiveScore >= 2) {
    status = "deteriorating";
  } else {
    status = "neutral";
  }

  return { status, reasoning };
}

/**
 * 警戒レベルの判定
 */
function judgeAlertLevel(input: IndicatorsInput): {
  level: AlertLevel;
  reasoning: string[];
} {
  const reasoning: string[] = [];
  let alertScore = 0;

  if (input.vix.value > 30) {
    alertScore += 3;
    reasoning.push(`VIX ${input.vix.value.toFixed(2)}（パニック水準）`);
  } else if (input.vix.value > 20) {
    alertScore += 1;
    reasoning.push(`VIX ${input.vix.value.toFixed(2)}（やや警戒）`);
  }

  if (input.yieldSpread.inverted) {
    alertScore += 2;
    reasoning.push("イールドカーブ逆転中");
  }

  const fg = input.fearGreed.value;
  if (fg <= 25) {
    alertScore += 2;
    reasoning.push(`Fear & Greed ${fg}（極度の恐怖、底値圏の可能性）`);
  } else if (fg >= 75) {
    alertScore += 1;
    reasoning.push(`Fear & Greed ${fg}（極度の強欲、天井圏の可能性）`);
  }

  if (
    input.sp500.ma200Deviation !== null &&
    input.sp500.ma200Deviation < -10
  ) {
    alertScore += 2;
    reasoning.push(
      `S&P500が200日MA-10%以下（${input.sp500.ma200Deviation.toFixed(2)}%）`
    );
  }

  let level: AlertLevel;
  if (alertScore >= 5) level = "critical";
  else if (alertScore >= 3) level = "high";
  else if (alertScore >= 1) level = "medium";
  else level = "low";

  return { level, reasoning };
}

/**
 * 4局面分類のメインロジック
 */
function classifyRegime(
  monetary: "easing" | "tightening" | "neutral",
  economy: "improving" | "deteriorating" | "neutral"
): "bull_recovery" | "bull_growth" | "bear_rate_hike" | "bear_recession" {
  if (monetary === "easing") {
    return economy === "improving" ? "bull_growth" : "bull_recovery";
  } else if (monetary === "tightening") {
    return economy === "improving" ? "bear_rate_hike" : "bear_recession";
  } else {
    return economy === "improving" ? "bull_growth" : "bear_rate_hike";
  }
}

/**
 * 信頼度の計算
 * 各軸の判定が明確なほど高い
 */
function calculateConfidence(
  monetary: "easing" | "tightening" | "neutral",
  economy: "improving" | "deteriorating" | "neutral"
): number {
  let confidence = 0.5;

  if (monetary !== "neutral") confidence += 0.25;
  if (economy !== "neutral") confidence += 0.25;

  return Math.min(confidence, 1.0);
}

/**
 * メインの判定関数
 */
export function analyzeRegime(input: IndicatorsInput): RegimeAnalysis {
  const monetary = judgeMonetary(input);
  const economy = judgeEconomy(input);
  const alert = judgeAlertLevel(input);

  const regimeType = classifyRegime(monetary.status, economy.status);
  const confidence = calculateConfidence(monetary.status, economy.status);

  const reasoning = [monetary.reasoning, ...economy.reasoning];

  if (alert.reasoning.length > 0) {
    reasoning.push("--- 警戒事項 ---");
    reasoning.push(...alert.reasoning);
  }

  return {
    regime: REGIMES[regimeType],
    confidence,
    alertLevel: alert.level,
    reasoning,
    axes: {
      monetary: monetary.status,
      economy: economy.status,
    },
    timestamp: new Date().toISOString(),
  };
}
