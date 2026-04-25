# Compass Invest プロジェクトガイド

このドキュメントは、Compass Invest のコードベース全体を理解するための学習用ガイドです。
全くの初心者向けに、各ファイル・フォルダの役割を解説しています。

## 全体のメンタルモデル

このアプリは「**レストラン**」だと思ってください。

| 役割 | フォルダ | 例えると |
|------|---------|---------|
| お客さんが見る画面 | `app/` のページ | ホール（テーブル席） |
| データを取りに行く係 | `lib/` | 仕入れ担当（FRED/Yahoo に買い出し） |
| 画面の部品 | `components/` | 食器・カトラリー（再利用） |
| データの設計図 | `types/` | レシピの規格 |
| 動かない情報 | `data/` | メニュー表（毎回変わらない） |
| 画像など | `public/` | 看板・装飾 |
| 開発用ツール | `scripts/` | 厨房の便利グッズ |

データの流れ: `lib/` で取得 → `app/api/` で加工 → `app/page.tsx` で受取り → `components/` で表示

## ルートにある設定ファイル

| ファイル | 役割 |
|---------|------|
| `package.json` | プロジェクトの「身分証」。使ってるライブラリ一覧、起動コマンド (`npm run dev`) を定義 |
| `tsconfig.json` | TypeScript の設定。`@/lib/...` のような短縮パスもここで定義 |
| `next.config.ts` | Next.js（フレームワーク）の設定 |
| `.env.local` | 秘密の鍵を入れる場所。FRED の API キー等。**Gitに上げない** |
| `.gitignore` | Git に上げないファイルのリスト（`.env.local`, `node_modules/` 等） |
| `eslint.config.mjs` | コードの書き方ルール（自動チェック） |
| `postcss.config.mjs` | CSS の処理設定（Tailwind が動くようにする） |
| `README.md` | プロジェクトの説明書 |

## app/ — 画面とAPI

Next.js では「ファイルを置くだけ」でURLが作られます。`app/markets/page.tsx` を作ると `/markets` で見れる、というシンプルな仕組み。

### 画面（ページ）

| ファイル | URL | 役割 |
|---------|-----|------|
| `app/page.tsx` | `/` | ダッシュボード。レジーム判定・主要指標・タブ |
| `app/markets/page.tsx` | `/markets` | Markets画面。4つの大きなチャート＋統計 |
| `app/history/page.tsx` | `/history` | History画面。6つの歴史的局面の解説 |
| `app/layout.tsx` | （全ページ共通） | フォント・PWA設定・titleタグなど。全画面の外枠 |
| `app/globals.css` | （全ページ共通） | Tailwind CSS の読み込み・基本スタイル |
| `app/favicon.ico` | — | ブラウザタブに出る小さなアイコン |

### API ルート

`app/api/xxx/route.ts` は **画面ではなくJSONを返すエンドポイント**。`/api/xxx` にアクセスすると JSON が返る。

| ファイル | URL | 何を返すか |
|---------|-----|----------|
| `app/api/fred/treasury10y/route.ts` | `/api/fred/treasury10y` | 10年米国債金利 |
| `app/api/fred/treasury2y/route.ts` | `/api/fred/treasury2y` | 2年米国債金利 |
| `app/api/fred/fedfunds/route.ts` | `/api/fred/fedfunds` | FF金利 |
| `app/api/yahoo/vix/route.ts` | `/api/yahoo/vix` | VIX恐怖指数 |
| `app/api/yahoo/sp500/route.ts` | `/api/yahoo/sp500` | S&P500（移動平均込み） |
| `app/api/feargreed/route.ts` | `/api/feargreed` | Fear & Greed Index |
| `app/api/indicators/all/route.ts` | `/api/indicators/all` | 上記全部を1つに統合 |
| `app/api/regime/route.ts` | `/api/regime` | レジーム判定結果 |

## lib/ — データ取得・ロジック

「外部APIを叩く処理」と「分析ロジック」を入れる場所。同じコードをコピペしないためにここに集約。

| ファイル | 役割 |
|---------|------|
| `lib/fred.ts` | FRED API（米連邦準備銀行）から金利データを取る。`getFredLatest`（最新値）と `getFredHistory`（過去N日）を提供 |
| `lib/yahoo.ts` | Yahoo Financeから株価・VIXを取る。`getQuote`（現在値）と `getHistorical`（過去N日） |
| `lib/feargreed.ts` | CNN Fear & Greed Index を取る。日本語分類（「強欲」など）も提供 |
| `lib/indicators.ts` | 全指標を一気に取得＋比較計算（1週/1ヶ月/3ヶ月）＋移動平均計算。`getAllIndicators()` 一発呼ぶだけで全データ揃う |
| `lib/regime.ts` | **レジーム判定の頭脳**。指標値を入れると「業績相場」「逆金融相場」等を返す |
| `lib/regime-helper.ts` | indicators データを `regime.ts` 用の形に変換するブリッジ |
| `lib/utils.ts` | shadcn/ui が使う雑用関数（`cn` = className を結合する） |

## components/ — UI部品

再利用するUIパーツ。`Card`、`Badge`、ボタンなどはここから import して使う。

### 自作コンポーネント

| ファイル | 役割 |
|---------|------|
| `components/IndicatorCards.tsx` | ダッシュボードの4つの指標カード＋期間タブ（現在/1週/1ヶ月/3ヶ月）。クリックで切り替わる |
| `components/MiniChart.tsx` | 指標カードに表示する小さなチャート（高さ50px） |
| `components/LargeChart.tsx` | Markets画面の大きなチャート（高さ180px、X/Y軸付き） |

### components/ui/ — shadcn/ui の標準部品

| ファイル | 何 |
|---------|---|
| `card.tsx` | 白いカード（影付き） |
| `badge.tsx` | 「警戒度: 低」みたいな小さなバッジ |
| `button.tsx` | ボタン |
| `tabs.tsx` | タブUI（概要/特徴/注目資産/判定根拠の切替） |
| `alert.tsx` | 警告メッセージ用（今は未使用） |
| `skeleton.tsx` | 読み込み中のグレー枠（今は未使用） |

これらはコマンド `npx shadcn@latest add xxx` で自動生成された汎用部品。中身を編集してカスタムも可能。

## types/ — TypeScriptの設計図

| ファイル | 役割 |
|---------|------|
| `types/regime.ts` | レジーム関連の型定義。`RegimeType`（4局面の文字列）、`RegimeAnalysis`（判定結果の形）、`REGIMES` 定数（4局面の説明文）を提供 |

「型」とは「**このデータはこういう形をしてるはず**」というルール。型がついてるとIDEで補完が効くし、間違えると赤線で警告される。

## data/ — 静的データ

| ファイル | 役割 |
|---------|------|
| `data/historical-events.ts` | History画面で表示する6つの歴史的局面（世界恐慌、ブラックマンデー、ITバブル、リーマン、コロナ、2022利上げ）の解説データ |

API から取ってこない、ハードコード（手書き）の固定データ。

## public/ — 静的ファイル

ブラウザから直接アクセスできるファイル置き場。`/icon.svg` で参照される。

| ファイル | 役割 |
|---------|------|
| `icon.svg` | 元の羅針盤アイコン（青背景） |
| `icon-192.png`, `icon-512.png` | PWA用アイコン（Android / 高解像度） |
| `apple-touch-icon.png` | iOS のホーム画面用 |
| `favicon-32.png` | ブラウザタブの小さなアイコン |
| `manifest.json` | PWA 設定（アプリ名・色・アイコン） |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Next.jsのテンプレートに最初から入ってる**未使用ファイル**（消してOK） |

## scripts/ — 開発用スクリプト

`npm run dev` の本番経路には入らない、手動で叩く便利ツール。

| ファイル | 役割 |
|---------|------|
| `scripts/test-apis.mjs` | `node scripts/test-apis.mjs` で全APIの動作確認（デバッグ用） |
| `scripts/generate-icons.mjs` | `icon.svg` から各サイズのPNGを自動生成 |

## 実際の処理フロー（例：ダッシュボード表示）

ブラウザで `localhost:3000` にアクセスすると…

1. `app/layout.tsx` が外枠（HTML, body, font）を用意
2. `app/page.tsx` が `getAllIndicators()` を呼ぶ
3. `lib/indicators.ts` が**並列で**
   - `lib/fred.ts` → FRED API（金利）
   - `lib/yahoo.ts` → Yahoo Finance（株価/VIX）
   - `lib/feargreed.ts` → CNN（Fear & Greed）
4. 取得データを加工（移動平均、変化率）
5. `lib/regime-helper.ts` → `lib/regime.ts` でレジーム判定
6. データを `components/IndicatorCards.tsx` に渡して表示
7. ユーザーがタブをクリックすると、ブラウザ側で `components/IndicatorCards.tsx` が再描画

## 覚えておくべき大事なルール

- `page.tsx` という名前のファイル = **ページになる**（Next.js の決まり）
- `route.ts` という名前のファイル = **APIエンドポイントになる**
- `.tsx` は React UI、`.ts` はロジックだけ
- `@/lib/foo` の `@/` は**プロジェクトルートを指す**（`tsconfig.json` で定義）
- `"use client"` が先頭にあるファイル = **ブラウザで動く**。それ以外は**サーバーで動く**

## 用語集（最低限）

| 用語 | 意味 |
|-----|------|
| Next.js | React ベースのフレームワーク。今回のアプリの土台 |
| TypeScript | JavaScript に「型」を加えた言語。バグを事前に検出できる |
| React | UIを部品化するライブラリ。ボタンやカードを「コンポーネント」として定義 |
| API ルート | サーバーで実行される、JSONを返すエンドポイント |
| Server Component | サーバー側でHTMLを生成するReactコンポーネント。デフォルト |
| Client Component | ブラウザで動くReactコンポーネント。`"use client"` を先頭に書く |
| Tailwind CSS | クラス名でスタイルを当てるCSSフレームワーク（`bg-blue-500` など） |
| shadcn/ui | Tailwindベースの再利用可能なUI部品集 |
| PWA | Progressive Web App。スマホのホーム画面に追加できるWebアプリ |
| FRED | Federal Reserve Economic Data。米国の経済データAPI |

## 次に学ぶべきこと（優先順）

1. **TypeScriptの型** — `interface`、`type`、ジェネリクス
2. **React Hooks** — `useState`、`useEffect`、`useMemo`
3. **Next.js の Server/Client Components の違い**
4. **非同期処理** — `async`/`await`、`Promise.all`
5. **CSS** — Flexbox、Grid、レスポンシブデザイン

各トピックは、このプロジェクトのコードを「実例」として見ると理解が早いです。
