"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const FUTURE_FEATURES = [
  {
    icon: "👥",
    title: "患者分析",
    desc: "患者様の来院傾向・行動パターンをデータで可視化します。",
    tag: "近日公開",
  },
  {
    icon: "📈",
    title: "予約率分析",
    desc: "曜日・時間帯別の予約率をグラフで確認し、最適化を支援します。",
    tag: "開発中",
  },
  {
    icon: "💬",
    title: "LINE分析",
    desc: "配信メッセージの開封率・返答率を分析し、改善に役立てます。",
    tag: "開発中",
  },
  {
    icon: "🔁",
    title: "掘り起こし分析",
    desc: "休眠患者様の割合・復帰率を継続的にトラッキングします。",
    tag: "計画中",
  },
  {
    icon: "🤖",
    title: "AI改善提案",
    desc: "データを基にAIが最適な改善アクションを自動で提案します。",
    tag: "計画中",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function FutureSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="future" className="section-py bg-gray-50" ref={ref}>
      <div className="container-lg">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">将来追加予定</span>
          <h2 className="section-heading">さらなる改善のために、<br className="md:hidden" />進化し続けます</h2>
          <p className="section-subheading">
            現在のサポートに加え、データ分析・AI活用機能を順次追加予定です。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <Image
                src="/ai_analysis.png"
                alt="AI分析・データ活用のイメージ"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="space-y-4"
          >
            {FUTURE_FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVar}
                className="flex items-start gap-5 bg-white rounded-3xl px-8 py-7 shadow-sm border border-gray-100"
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
