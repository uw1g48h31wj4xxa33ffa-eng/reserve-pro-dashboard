"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

export function HeroSection() {
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Decorative orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-turquoise-200/30 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="absolute top-40 left-1/2 w-64 h-64 rounded-full bg-royal-100/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <Badge variant="turquoise" className="mb-6">
              <MessageCircle size={13} />
              歯科医院向け LINE 予約率改善サービス
            </Badge>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
          >
            問い合わせを
            <br />
            <span className="gradient-text">予約につなげる仕組みを。</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4 max-w-2xl mx-auto"
          >
            歯科医院向け LINE 予約導線最適化サービス
          </motion.p>

          <motion.p
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto"
          >
            問い合わせから予約確定、掘り起こしまで。
            <br />
            予約率改善のための仕組みをご提供します。
          </motion.p>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleScroll("#contact")}
              className="w-full sm:w-auto"
            >
              <CalendarCheck size={18} />
              無料相談を予約する
              <ArrowRight size={16} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleScroll("#contact")}
              className="w-full sm:w-auto"
            >
              デモを依頼する
            </Button>
          </motion.div>

          <motion.p
            custom={5}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-5 text-sm text-gray-400"
          >
            ※ 無料相談は30分。契約の強制は一切ありません。
          </motion.p>
        </div>

        {/* Hero dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          {/* Shadow/glow */}
          <div className="absolute inset-x-8 bottom-0 h-20 bg-turquoise-300/20 blur-2xl rounded-full" />

          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4 h-6 bg-white rounded border border-gray-200 flex items-center px-3 text-xs text-gray-400">
                app.dentalconnect.jp/dashboard
              </div>
            </div>

            {/* Dashboard UI */}
            <div className="p-5 bg-gray-50 min-h-64">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "今月の予約数", value: "127", unit: "件", color: "turquoise" },
                  { label: "予約率", value: "50", unit: "%", color: "sky" },
                  { label: "掘り起こし数", value: "13", unit: "件", color: "royal" },
                  { label: "無断キャンセル", value: "0", unit: "件", color: "green" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                    <div className={`text-2xl font-bold gradient-text`}>
                      {stat.value}
                      <span className="text-sm font-medium text-gray-500 ml-0.5">{stat.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Fake chart */}
                <div className="md:col-span-2 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs font-medium text-gray-600 mb-3">予約推移（直近30日）</div>
                  <div className="flex items-end gap-1.5 h-16">
                    {[40, 55, 45, 60, 50, 70, 65, 80, 75, 85, 78, 90, 85, 95, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t gradient-brand opacity-70"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Patient list */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs font-medium text-gray-600 mb-3">掘り起こし候補</div>
                  {[
                    { name: "田中 ○○ 様", tag: "検討中", color: "bg-sky-100 text-sky-700" },
                    { name: "鈴木 ○○ 様", tag: "日程調整中", color: "bg-turquoise-100 text-turquoise-700" },
                    { name: "山田 ○○ 様", tag: "価格不安", color: "bg-royal-100 text-royal-700" },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-700">{p.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.color}`}>{p.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
