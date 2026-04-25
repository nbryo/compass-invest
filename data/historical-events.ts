import type { RegimeType } from "@/types/regime";

export interface HistoricalEvent {
  id: string;
  name: string;
  nameEn: string;
  startDate: string;
  endDate: string;
  regime: RegimeType;
  summary: string;
  description: string;
  keyMetrics: {
    vixPeak?: number;
    sp500Drop?: number;
    sp500RecoveryMonths?: number;
    federalFundsRate?: { start: number; end: number };
  };
  lessons: string[];
  triggers: string[];
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: "great-depression-1929",
    name: "世界恐慌",
    nameEn: "Great Depression",
    startDate: "1929-10-24",
    endDate: "1932-07-08",
    regime: "bear_recession",
    summary:
      "20世紀最大の経済危機。ブラックサーズデー（暗黒の木曜日）から始まり、株価は約3年間で約90%下落した。",
    description:
      "1929年10月の株式市場大暴落から始まった世界規模の経済恐慌。投機バブルの崩壊、銀行の連鎖倒産、保護主義的な貿易政策により事態は悪化した。失業率は25%に達し、世界中の経済が崩壊。回復には第二次世界大戦の戦時経済まで時間を要した。",
    keyMetrics: {
      sp500Drop: -89,
      sp500RecoveryMonths: 300,
    },
    lessons: [
      "投機バブルの危険性",
      "中央銀行の機能不全が事態を悪化させた",
      "保護主義は世界経済を破壊する",
      "分散投資と現金保有の重要性",
    ],
    triggers: [
      "株式市場の過熱（過剰なレバレッジ）",
      "中央銀行の引き締め過ぎ",
      "スムート・ホーリー関税法による保護主義",
    ],
  },
  {
    id: "black-monday-1987",
    name: "ブラックマンデー",
    nameEn: "Black Monday",
    startDate: "1987-10-19",
    endDate: "1987-10-19",
    regime: "bear_recession",
    summary:
      "1日でダウ平均が22.6%下落した史上最大級の単日下落。プログラム取引が連鎖的売りを引き起こした。",
    description:
      "1987年10月19日の月曜日、ダウ平均株価が1日で22.6%下落。この下落幅は1929年の暴落を上回る単日記録となった。原因はプログラム取引の連鎖、貿易赤字への懸念、金利上昇など複合的。ただし、迅速な金融政策対応により短期間で回復。",
    keyMetrics: {
      sp500Drop: -33,
      sp500RecoveryMonths: 21,
    },
    lessons: [
      "プログラム取引の連鎖リスク",
      "中央銀行の迅速な対応で危機は収まる",
      "短期暴落は買いの機会になりうる",
    ],
    triggers: [
      "プログラム取引（ポートフォリオ・インシュランス）",
      "貿易赤字とドル安懸念",
      "金利上昇",
    ],
  },
  {
    id: "dot-com-bubble-2000",
    name: "ITバブル崩壊",
    nameEn: "Dot-com Bubble",
    startDate: "2000-03-10",
    endDate: "2002-10-09",
    regime: "bear_rate_hike",
    summary:
      "インターネット関連企業の株価が暴騰した後、2年半かけて約78%下落。ナスダックの暴落として知られる。",
    description:
      "1990年代後半、インターネット関連企業への過剰な期待で株価が異常な水準まで上昇。多くの企業が利益を出していないにも関わらず高評価を得ていた。FRBの利上げ、Y2K問題、企業の業績不振が引き金となり、ナスダックは2000年3月のピークから2002年10月まで約78%下落。",
    keyMetrics: {
      vixPeak: 45,
      sp500Drop: -49,
      sp500RecoveryMonths: 84,
      federalFundsRate: { start: 4.75, end: 6.5 },
    },
    lessons: [
      "PERや収益性を無視した投資の危険性",
      "セクター集中投資のリスク",
      "金融引き締めはバブルを破裂させる",
      "新技術への過剰期待を冷静に評価する",
    ],
    triggers: [
      "FRBの利上げサイクル",
      "ドットコム企業の業績不振",
      "9/11同時多発テロ（2001年）",
      "エンロン・ワールドコム不正会計",
    ],
  },
  {
    id: "lehman-shock-2008",
    name: "リーマンショック",
    nameEn: "Global Financial Crisis",
    startDate: "2008-09-15",
    endDate: "2009-03-09",
    regime: "bear_recession",
    summary:
      "リーマン・ブラザーズの破綻を契機とする世界金融危機。S&P500は約56%下落し、世界経済を揺るがした。",
    description:
      "サブプライムローン問題から始まった金融危機がリーマン・ブラザーズの破綻で頂点に達した。住宅ローン担保証券の暴落、銀行の連鎖危機、信用収縮で世界経済は深刻な不況に陥った。各国中央銀行の前例のない量的緩和で危機は終息したが、回復には数年を要した。",
    keyMetrics: {
      vixPeak: 80.86,
      sp500Drop: -56.8,
      sp500RecoveryMonths: 49,
      federalFundsRate: { start: 5.25, end: 0.25 },
    },
    lessons: [
      "システミックリスクの恐ろしさ",
      "レバレッジの危険性",
      "金融機関の相互接続性",
      "暴落時の現金の重要性",
      "中央銀行の量的緩和政策の効果",
    ],
    triggers: [
      "サブプライムローンのデフォルト",
      "住宅バブル崩壊",
      "金融機関の過剰なレバレッジ",
      "格付け機関の機能不全",
    ],
  },
  {
    id: "covid-crash-2020",
    name: "コロナショック",
    nameEn: "COVID-19 Crash",
    startDate: "2020-02-19",
    endDate: "2020-03-23",
    regime: "bear_recession",
    summary:
      "新型コロナウイルスのパンデミックで市場が約1ヶ月で34%下落。史上最速の弱気相場入りとなった。",
    description:
      "2020年初頭、新型コロナウイルスの世界的流行で経済活動が一斉停止。S&P500は約1ヶ月で34%下落し、史上最速の弱気相場入りとなった。FRBは緊急利下げと無制限量的緩和を実施。財政出動と組み合わせ、市場は驚くべきスピードで回復。約半年で前回高値を更新した。",
    keyMetrics: {
      vixPeak: 82.69,
      sp500Drop: -33.9,
      sp500RecoveryMonths: 5,
      federalFundsRate: { start: 1.75, end: 0.25 },
    },
    lessons: [
      "想定外のリスク（テールリスク）への備え",
      "中央銀行の積極的介入の効果",
      "暴落と回復のスピードは年々速くなっている",
      "ハイテク株が新時代のディフェンシブとして機能",
    ],
    triggers: [
      "新型コロナウイルスのパンデミック",
      "経済活動の一斉停止",
      "原油先物のマイナス価格",
    ],
  },
  {
    id: "rate-hike-2022",
    name: "金利急上昇局面",
    nameEn: "Aggressive Rate Hikes",
    startDate: "2022-01-03",
    endDate: "2022-10-12",
    regime: "bear_rate_hike",
    summary:
      "FRBの急速な利上げによりS&P500が約25%下落。グロース株、特にハイテク株が大きな打撃を受けた。",
    description:
      "コロナ後の財政出動と供給制約から起きた高インフレに対し、FRBは1980年代以来の急速な利上げを実施。FF金利は0.25%から4.5%まで急上昇。長期金利の上昇でグロース株のバリュエーションが圧縮され、ナスダックは33%下落。バリュー株は相対的に堅調だった。",
    keyMetrics: {
      vixPeak: 36.5,
      sp500Drop: -25.4,
      sp500RecoveryMonths: 13,
      federalFundsRate: { start: 0.25, end: 4.5 },
    },
    lessons: [
      "金融引き締め局面ではグロース株に逆風",
      "バリュー株とグロース株の循環",
      "インフレと金利の関係",
      "債券価格と金利の逆相関",
    ],
    triggers: [
      "急激なインフレ（ピーク9.1%）",
      "FRBの積極的利上げ",
      "ロシアのウクライナ侵攻によるエネルギー価格高騰",
      "サプライチェーン混乱",
    ],
  },
];
