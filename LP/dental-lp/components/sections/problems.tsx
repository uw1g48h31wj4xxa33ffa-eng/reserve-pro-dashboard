"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ProblemsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    "問い合わせは来るが予約にならない",
    "LINEを活用できていない",
    "無断キャンセルが多い",
    "掘り起こしができていない",
    "数字管理が属人化している",
    "採用に時間を取られている",
  ];

  const containerVar = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="problems" className="section-py bg-gray-50">
      <div className="container-lg">
        <div className="text-center mb-16">
          <span className="section-eyebrow">Current Issues</span>
          <h2 className="section-heading">
            こんな<span className="text-teal-600">お悩み</span>はありませんか？
          </h2>
        </div>

        <motion.div
          ref={ref}
          variants={containerVar}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              variants={itemVar}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                !
              </div>
              <p className="text-gray-700 font-bold leading-relaxed pt-1">{prob}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-xl md:text-2xl font-black text-gray-900 leading-relaxed">
            現場の課題は、机上のシステム導入だけでは解決しません。<br />
            <span className="text-teal-600">現場を理解した「運営改善パートナー」</span>が必要です。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
