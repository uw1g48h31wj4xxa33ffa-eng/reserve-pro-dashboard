"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const SUPPORT_FEATURES = [
  {
    icon: "📈",
    title: "月次レポートの作成と共有",
    tag: "数値集計",
    desc: "予約率、無断キャンセル率、LINE経由の来院数などを毎月レポート化し、医院の現状を可視化します。",
  },
  {
    icon: "🎯",
    title: "目標達成に向けた改善提案",
    tag: "戦略立案",
    desc: "集計したデータに基づき、次月に取り組むべき優先課題と具体的なアクションプランをご提案します。",
  },
  {
    icon: "💻",
    title: "マニュアル化・業務効率化",
    tag: "業務改善",
    desc: "属人化している受付業務や案内フローをマニュアル化し、新人スタッフでも即戦力になる仕組みを整えます。",
  },
  {
    icon: "🤝",
    title: "定期ミーティングの実施",
    tag: "伴走支援",
    desc: "院長先生やスタッフの皆様と定期的にミーティングを行い、現場の声を吸い上げながら改善の軌道修正を行います。",
  },
  {
    icon: "💡",
    title: "採用ページの継続的改善",
    tag: "採用支援",
    desc: "求職者の反応を見ながら、募集要項やアピールポイントを定期的にブラッシュアップし、採用成功率を高めます。",
  },
];

export function FutureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVar = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="section-py relative bg-white">
      <div className="container-lg">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Continuous Support</span>
          <h2 className="section-heading">
            データに基づく<br />
            <span className="text-teal-600">継続的な業務改善</span>
          </h2>
          <p className="section-subheading">
            仕組みを作って終わりではありません。<br className="hidden md:block" />
            数字と現場の声を拾い上げ、医院の成長を長期的にサポートします。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 aspect-square md:aspect-[4/3] bg-gray-100"
            >
              <Image
                src="/ai_analysis.png"
                alt="システム・データ分析イメージ"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-6 md:right-auto md:-left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
            >
              <div className="text-sm font-bold text-gray-500 mb-2">改善のサイクル</div>
              <div className="flex gap-2 text-xl">
                <span>📊</span> ➡️ <span>💡</span> ➡️ <span>📈</span>
              </div>
            </motion.div>
          </div>

          {/* Features Side */}
          <motion.div
            ref={ref}
            variants={containerVar}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="space-y-6"
          >
            {SUPPORT_FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVar}
                className="flex items-start gap-5 bg-white rounded-3xl px-8 py-7 shadow-sm border border-gray-100 hover:shadow-md hover:translate-x-1 transition-all duration-300"
              >
                <span className="text-3xl flex-shrink-0 mt-0.5">{f.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                    <span className="text-sm px-3 py-1 rounded-full bg-teal-50 text-teal-600 font-semibold">
                      {f.tag}
                    </span>
                  </div>
                  <p className="text-base text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
