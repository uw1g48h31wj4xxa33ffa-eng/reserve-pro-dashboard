"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  label: string;
  before: string;
  after: string;
}

const STATS: Stat[] = [
  {
    label: "予約確定率",
    before: "30%",
    after: "50%",
  },
  {
    label: "無断キャンセル",
    before: "月3件",
    after: "0〜1件",
  },
  {
    label: "掘り起こし",
    before: "0件",
    after: "平均13件",
  },
];

export function ResultsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" className="py-24 bg-white" ref={ref}>
      <div className="container-lg">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col items-center justify-center text-center"
            >
              <p className="text-sm font-bold text-gray-500 mb-6">{stat.label}</p>

              <div className="text-xl text-gray-300 font-bold mb-2">
                {stat.before}
              </div>
              
              <div className="text-xl text-gray-200 mb-2">↓</div>
              
              <div className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
                {stat.after}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
