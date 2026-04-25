/**
 * 各APIエンドポイントを順番に叩いて、レスポンスとエラーを表示する
 * 使い方: node scripts/test-apis.mjs
 *
 * 事前に `npm run dev` で開発サーバーを起動しておくこと。
 */

const BASE = "http://localhost:3000";

const endpoints = [
  "/api/fred/treasury10y",
  "/api/fred/treasury2y",
  "/api/fred/fedfunds",
  "/api/yahoo/vix",
  "/api/yahoo/sp500",
  "/api/feargreed",
  "/api/indicators/all",
];

async function test(path) {
  const url = BASE + path;
  process.stdout.write(`\n[${path}] ... `);
  const start = Date.now();
  try {
    const res = await fetch(url);
    const ms = Date.now() - start;
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    if (!res.ok) {
      console.log(`FAIL ${res.status} (${ms}ms)`);
      console.log("  body:", JSON.stringify(body, null, 2).slice(0, 500));
      return false;
    }

    console.log(`OK ${res.status} (${ms}ms)`);
    // 返却の主要キーだけ表示（長すぎるhistoryは省く）
    const summary = summarize(body);
    console.log("  summary:", JSON.stringify(summary, null, 2).slice(0, 600));
    return true;
  } catch (err) {
    const ms = Date.now() - start;
    console.log(`ERROR (${ms}ms)`);
    console.log("  message:", err.message);
    return false;
  }
}

function summarize(obj) {
  if (Array.isArray(obj)) return `[${obj.length} items]`;
  if (obj === null || typeof obj !== "object") return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === "history") {
      out[k] = Array.isArray(v) ? `[${v.length} items]` : v;
    } else if (typeof v === "object" && v !== null) {
      out[k] = summarize(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

(async () => {
  console.log("=== API テスト開始 ===");
  const results = [];
  for (const path of endpoints) {
    const ok = await test(path);
    results.push({ path, ok });
  }

  console.log("\n=== 結果サマリー ===");
  for (const { path, ok } of results) {
    console.log(`  ${ok ? "OK  " : "FAIL"} ${path}`);
  }
  const failCount = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failCount} / ${results.length} 成功`);
  process.exit(failCount > 0 ? 1 : 0);
})();
