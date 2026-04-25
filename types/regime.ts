/**
 * レジーム分析の型定義
 */

/**
 * 4局面分類
 * - bull_recovery: 金融相場（金融緩和×景気悪化）
 * - bull_growth: 業績相場（金融緩和×景気改善）
 * - bear_rate_hike: 逆金融相場（金融引締め×景気改善）
 * - bear_recession: 逆業績相場（金融引締め×景気悪化）
 */
export type RegimeType =
  | "bull_recovery"
  | "bull_growth"
  | "bear_rate_hike"
  | "bear_recession";

/**
 * 警戒レベル
 */
export type AlertLevel = "low" | "medium" | "high" | "critical";

/**
 * レジーム情報
 */
export interface RegimeInfo {
  type: RegimeType;
  nameJa: string;
  nameEn: string;
  description: string;
  characteristics: string[];
  favorableAssets: string[];
}

/**
 * レジーム判定の結果
 */
export interface RegimeAnalysis {
  regime: RegimeInfo;
  confidence: number; // 0-1
  alertLevel: AlertLevel;
  reasoning: string[]; // 判定の根拠
  axes: {
    monetary: "easing" | "tightening" | "neutral"; // 金融環境
    economy: "improving" | "deteriorating" | "neutral"; // 景気
  };
  timestamp: string;
}

/**
 * 4局面のメタデータ
 */
export const REGIMES: Record<RegimeType, RegimeInfo> = {
  bull_recovery: {
    type: "bull_recovery",
    nameJa: "金融相場",
    nameEn: "Liquidity-Driven Bull",
    description:
      "中央銀行の金融緩和によって株価が上昇する局面。景気はまだ悪いが、金融引き締めの心配がなく、低金利でリスク資産にお金が流れる。",
    characteristics: [
      "金融緩和が継続",
      "景気指標は弱いが先行きへの期待で上昇",
      "ハイテク・グロース株が特に強い",
      "バリュエーション拡大が起きやすい",
    ],
    favorableAssets: ["ハイテク株（QQQ）", "グロース株", "イノベーション関連"],
  },
  bull_growth: {
    type: "bull_growth",
    nameJa: "業績相場",
    nameEn: "Earnings-Driven Bull",
    description:
      "金融環境は緩和的なまま、企業業績が改善し株価上昇。最も健全な強気相場。リスク資産の黄金期。",
    characteristics: [
      "金融緩和継続 + 企業業績回復",
      "雇用・設備投資が拡大",
      "幅広い銘柄が上昇（市場の質が良い）",
      "シクリカル株も強い",
    ],
    favorableAssets: ["S&P500（SPY）", "全米株（VTI）", "シクリカル株"],
  },
  bear_rate_hike: {
    type: "bear_rate_hike",
    nameJa: "逆金融相場",
    nameEn: "Tightening Headwind",
    description:
      "景気が良いため中央銀行が利上げ。金利上昇で株価のバリュエーションに逆風。グロース株から資金が流出する。",
    characteristics: [
      "利上げサイクル入り",
      "10年金利上昇",
      "ハイテク・グロース株に逆風",
      "バリュー株・金融株が相対的に強い",
    ],
    favorableAssets: [
      "金融株（XLF）",
      "バリュー株（VTV）",
      "短期債",
      "コモディティ",
    ],
  },
  bear_recession: {
    type: "bear_recession",
    nameJa: "逆業績相場",
    nameEn: "Recession",
    description:
      "金融引き締めの累積効果と業績悪化の二重苦。最も厳しい局面。ディフェンシブ資産以外は全面的に弱い。",
    characteristics: [
      "業績下方修正の連鎖",
      "信用スプレッド拡大",
      "VIX高止まり",
      "イールドカーブ逆転からの正常化過程",
    ],
    favorableAssets: [
      "長期国債（TLT）",
      "金（GLD）",
      "ディフェンシブ株",
      "現金",
    ],
  },
};
