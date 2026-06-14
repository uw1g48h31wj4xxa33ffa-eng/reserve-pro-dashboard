"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { LayoutDashboard, CalendarDays, MessageSquare, Users, RefreshCw, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const screens = [
  {
    id: "dashboard",
    label: "ダッシュボード",
    icon: <LayoutDashboard size={16} />,
    description: "予約数・予約率・掘り起こし数をリアルタイムで把握医院全体の状態を一目で確認できます",
    mockup: (
      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {[
            { v: "127件", l: "今月予約" },
            { v: "50%", l: "予約率" },
            { v: "13件", l: "掘り起こし" },
            { v: "0件", l: "キャンセル" },
          ].map((s) => (
            <div key={s.l} className="bg-white rounded-lg p-2 border border-gray-100">
              <div className="text-xs text-gray-400">{s.l}</div>
              <div className="text-base font-bold gradient-text">{s.v}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-2">今週の予約推移</div>
          <div className="flex items-end gap-1 h-10">
            {[60, 75, 55, 85, 70, 90, 80].map((h, i) => (
              <div key={i} className="flex-1 rounded-t gradient-brand opacity-60" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "reservation",
    label: "予約管理",
    icon: <CalendarDays size={16} />,
    description: "予約状況をカレンダーとリストで管理ステータス変更やリマインド送信をワンクリックで完結",
    mockup: (
      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
        {[
          { time: "10:00", name: "田中 ○○ 様", type: "初診相談", status: "確定", sc: "bg-turquoise-100 text-turquoise-700" },
          { time: "11:30", name: "鈴木 ○○ 様", type: "矯正カウンセリング", status: "リマインド済", sc: "bg-sky-100 text-sky-700" },
          { time: "14:00", name: "山田 ○○ 様", type: "ホワイトニング", status: "確定", sc: "bg-turquoise-100 text-turquoise-700" },
          { time: "15:30", name: "佐藤 ○○ 様", type: "一般診療", status: "要確認", sc: "bg-yellow-100 text-yellow-700" },
        ].map((r) => (
          <div key={r.time} className="bg-white rounded-lg px-3 py-2 border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-500">{r.time}</span>
              <div>
                <div className="text-xs font-medium text-gray-800">{r.name}</div>
                <div className="text-xs text-gray-400">{r.type}</div>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.sc}`}>{r.status}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "patient",
    label: "患者管理",
    icon: <Users size={16} />,
    description: "患者ごとのLINEやり取り履歴、問い合わせ内容、AIタグを一元管理担当者が引き継いでも迷わない",
    mockup: (
      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
        {[
          { name: "田中 ○○ 様", tag: "即予約型", msg: "矯正について興味があります", sc: "bg-turquoise-100 text-turquoise-700" },
          { name: "鈴木 ○○ 様", tag: "日程調整型", msg: "平日の夕方以降希望です", sc: "bg-sky-100 text-sky-700" },
          { name: "山田 ○○ 様", tag: "価格不安型", msg: "費用が心配で...", sc: "bg-royal-100 text-royal-700" },
        ].map((p) => (
          <div key={p.name} className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-800">{p.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.sc}`}>{p.tag}</span>
            </div>
            <p className="text-xs text-gray-500">「{p.msg}」</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "line",
    label: "LINE管理",
    icon: <MessageSquare size={16} />,
    description: "患者とのLINEメッセージを一覧管理テンプレート返信や一括送信でスタッフの負担を大幅削減",
    mockup: (
      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="flex items-start gap-2 mb-2">
            <div className="w-7 h-7 rounded-full gradient-brand flex-shrink-0" />
            <div className="bg-gray-100 rounded-lg p-2 text-xs text-gray-700 max-w-48">
              矯正相談を考えているのですが...
            </div>
          </div>
          <div className="flex items-start gap-2 flex-row-reverse">
            <div className="w-7 h-7 rounded-full bg-turquoise-500 flex-shrink-0" />
            <div className="bg-turquoise-50 rounded-lg p-2 text-xs text-turquoise-800 max-w-48 border border-turquoise-100">
              ご興味を持っていただきありがとうございますまずは無料カウンセリングはいかがでしょうか？
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1.5">テンプレート一覧</div>
          {["初回挨拶", "予約確認", "リマインド", "再予約促進"].map((t) => (
            <div key={t} className="text-xs text-turquoise-600 py-1 border-b border-gray-50 last:border-0">{t}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "followup",
    label: "掘り起こし管理",
    icon: <RefreshCw size={16} />,
    description: "問い合わせたまま止まっている患者をAIが優先度付けして提示スタッフはリストに従って声がけするだけ",
    mockup: (
      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
        <div className="text-xs font-medium text-gray-600 mb-1">今月の掘り起こし候補 13件</div>
        {[
          { name: "佐藤 ○○ 様", days: "45日経過", priority: "高", pc: "bg-red-100 text-red-700" },
          { name: "伊藤 ○○ 様", days: "32日経過", priority: "中", pc: "bg-yellow-100 text-yellow-700" },
          { name: "渡辺 ○○ 様", days: "28日経過", priority: "中", pc: "bg-yellow-100 text-yellow-700" },
          { name: "中村 ○○ 様", days: "21日経過", priority: "低", pc: "bg-green-100 text-green-700" },
        ].map((f) => (
          <div key={f.name} className="bg-white rounded-lg px-3 py-2 border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-gray-800">{f.name}</div>
              <div className="text-xs text-gray-400">{f.days}</div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.pc}`}>優先度：{f.priority}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "ai",
    label: "AI分析",
    icon: <BarChart3 size={16} />,
    description: "患者の会話内容をAIが分析し、タイプ分類・改善提案を自動生成スタッフの感覚頼みをデータで補完",
    mockup: (
      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
        <div className="text-xs font-medium text-gray-600 mb-1">患者タイプ分布</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: "即予約型", pct: 35, color: "bg-turquoise-500" },
            { type: "検討中型", pct: 28, color: "bg-sky-500" },
            { type: "日程調整型", pct: 22, color: "bg-royal-500" },
            { type: "価格不安型", pct: 15, color: "bg-gray-400" },
          ].map((t) => (
            <div key={t.type} className="bg-white rounded-lg p-2 border border-gray-100">
              <div className="text-xs text-gray-600 mb-1">{t.type}</div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-700">{t.pct}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-turquoise-50 rounded-lg p-2 border border-turquoise-100">
          <div className="text-xs font-medium text-turquoise-700 mb-0.5">💡 AIからの改善提案</div>
          <div className="text-xs text-turquoise-600">価格不安型が増加しています費用についてのFAQページ追加をご検討ください</div>
        </div>
      </div>
    ),
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("dashboard");

  const activeScreen = screens.find((s) => s.id === active)!;

  return (
    <section id="features" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge variant="royal" className="mb-4">システム紹介</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            すべての管理を、
            <br />
            <span className="gradient-text">ひとつの画面から</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            複数のシステムを行き来する必要はありません
            予約・患者・LINE・分析をすべて一元管理
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-gray-200 bg-white">
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setActive(screen.id)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px
                  ${active === screen.id
                    ? "border-turquoise-500 text-turquoise-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {screen.icon}
                {screen.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{activeScreen.label}</h3>
                  <p className="text-gray-600 leading-relaxed">{activeScreen.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200 bg-white/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeScreen.mockup}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
