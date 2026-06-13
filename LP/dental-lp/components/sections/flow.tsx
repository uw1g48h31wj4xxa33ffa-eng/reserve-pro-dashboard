"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
  { label: "問い合わせ", color: "bg-teal-500", desc: "HP・SNS・広告から" },
  { label: "予約フォーム", color: "bg-teal-500", desc: "分かりやすいフォームへ誘導" },
  { label: "LINE連携", color: "bg-sky-500", desc: "LINEで自動フォロー開始" },
  { label: "予約確定", color: "bg-sky-500", desc: "確定連絡・事前案内を送信" },
  { label: "来院", color: "bg-blue-600", desc: "リマインドでキャンセル防止" },
  { label: "掘り起こし", color: "bg-blue-600", desc: "休眠患者様へアプローチ" },
  { label: "再来院", color: "bg-indigo-600", desc: "継続的な関係構築へ" },
];

export function FlowSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="flow" className="section-py" ref={ref}>
      <div className="container-md">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">サポートイメージ</span>
          <h2 className="section-heading">
            問い合わせから再来院まで、<br className="md:hidden" />
            一気通貫でサポート
          </h2>
          <p className="section-subheading">
            それぞれのステップに適切な仕組みを設置し、<br className="hidden md:block" />
            患者様が自然と予約・来院・再来院へと進む流れを作ります。
          </p>
        </motion.div>

        {/* Flow steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-200 via-sky-200 to-indigo-200 -translate-x-1/2 hidden md:block" />

          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -32 : 32 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`md:flex items-center gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Card */}
                  <div className="flex-1">
                    <div className={`bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${isLeft ? "md:text-right" : "md:text-left"}`}>
                      <div className="text-xs text-gray-400 mb-1">STEP {i + 1}</div>
                      <div className="text-lg font-bold text-gray-900">{step.label}</div>
                      <div className="text-sm text-gray-500 mt-1">{step.desc}</div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center w-12 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full ${step.color} shadow-md ring-4 ring-white`} />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
