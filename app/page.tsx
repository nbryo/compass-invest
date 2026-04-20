import { Compass } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <Compass className="h-20 w-20 text-blue-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          Compass Invest
        </h1>
        <p className="text-xl text-slate-400 max-w-md mx-auto">
          市場レジーム分析で、投資の羅針盤を手に入れる
        </p>
        <div className="pt-4">
          <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20">
            開発中 - v0.1
          </span>
        </div>
      </div>
    </main>
  );
}