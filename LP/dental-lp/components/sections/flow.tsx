"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    title: "LP・Webサイト",
    desc: "まずは当サイトをご覧いただき、課題感やご提供できる価値をご確認ください。",
  },
  {
    title: "お問い合わせ",
    desc: "お悩みや現状の課題をフォームよりお気軽にご連絡ください。",
  },
  {
    title: "無料Zoom相談",
    desc: "オンラインで現在の運用状況をヒアリングし、改善ポイントの初期診断を行います。",
    highlight: true,
  },
  {
    title: "個別ご提案",
    desc: "貴院に最適な改善プランと、具体的なロードマップ・お見積りをご提示します。",
  },
  {
    title: "ご契約・伴走開始",
    desc: "システム導入から日々の運用改善まで、現場に入り込んでサポートをスタートします。",
  },
];

export function FlowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVar = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVar = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="flow" className="section-py bg-gray-50 relative overflow-hidden">
      <div className="container-lg max-w-4xl relative z-10">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Support Flow</span>
          <h2 className="section-heading">
            ご相談から<span className="text-teal-600">改善開始まで</span>
          </h2>
          <p className="section-subheading">
            まずは無料のZoom相談で、貴院の現状をお聞かせください。
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVar}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="relative"
        >
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-200 via-sky-200 to-gray-200" />

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <motion.div key={i} variants={itemVar} className="relative flex items-start gap-6 md:gap-10">
                {/* Number Bubble */}
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex-shrink-0 flex flex-col items-center justify-center border-4 border-white shadow-md relative z-10 ${
                  step.highlight ? "bg-gradient-to-br from-teal-400 to-sky-500 text-white scale-110" : "bg-white text-teal-600"
                }`}>
                  <span className="text-xs md:text-sm font-bold opacity-80 leading-none mb-1">STEP</span>
                  <span className="text-2xl md:text-3xl font-black leading-none">{i + 1}</span>
                </div>

                {/* Content Card */}
                <div className={`flex-1 rounded-3xl p-6 md:p-8 border shadow-sm mt-2 ${
                  step.highlight ? "bg-white border-teal-200 shadow-teal-500/10" : "bg-white/60 border-gray-100"
                }`}>
                  <h3 className={`text-xl md:text-2xl font-black mb-3 ${step.highlight ? "text-teal-600" : "text-gray-900"}`}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
