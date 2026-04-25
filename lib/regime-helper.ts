import { analyzeRegime } from "./regime";
import type { AllIndicators } from "./indicators";

/**
 * すでに取得済みのindicatorsデータからレジーム分析を行う
 * 重複したAPI取得を避けるため、データを引数で受け取る
 */
export function analyzeFromIndicators(data: AllIndicators) {
  const ind = data.indicators;
  return analyzeRegime({
    treasury10y: { value: ind.treasury10y.value },
    treasury2y: { value: ind.treasury2y.value },
    fedfunds: { value: ind.fedfunds.value },
    yieldSpread: {
      value: ind.yieldSpread.value,
      inverted: ind.yieldSpread.inverted,
    },
    vix: { value: ind.vix.value },
    sp500: {
      value: ind.sp500.value,
      ma200: ind.sp500.ma200,
      ma200Deviation: ind.sp500.ma200Deviation,
    },
    fearGreed: { value: ind.fearGreed.value },
  });
}
