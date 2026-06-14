"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  label: string;
  before: string;
  after: string;
  description: string;
}

const STATS: Stat[] = [
  {
    label: "予約確定率",
    before: "30%",
    after: "50%",
    description: "問い合わせからの予約確定が大幅に向上",
  },
  {
    label: "無断キャンセル",
    before: "月3件",
    after: "0〜1件",
    description: "リマインド運用で無断キャンセルをほぼゼロに",
  },
  {
    label: "掘り起こし",
    before: "0件",
    after: "平均13件",
    description: "休眠患者様へのアプローチで再来院を創出",
  },
];

export function ResultsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" className="section-py bg-white" ref={ref}>
      <div className="container-lg">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">改善実績</span>
          <h2 className="section-heading">数字が証明する、改善の成果</h2>
          <p className="section-subheading">
            仕組みを整えるだけで、これだけ変わります。
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-14 max-w-5xl mx-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center text-center"
            >
              <p className="text-sm font-bold text-teal-600 mb-6 bg-teal-50 px-4 py-1.5 rounded-full">{stat.label}</p>

              <div className="text-xl text-gray-400 font-bold mb-2">
                {stat.before}
              </div>
              
              <div className="text-2xl text-teal-300 font-black mb-2">↓</div>
              
              <div className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600">
                {stat.after}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed font-bold">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
