"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const PROBLEMS = [
  {
    icon: "📉",
    title: "予約枠が埋まらない\nキャンセルが多い",
    desc: "せっかくの初診予約も、無断キャンセルや直前キャンセルでチェアーが空いてしまう。",
  },
  {
    icon: "📱",
    title: "LINEを導入したが\n活用できていない",
    desc: "アカウントは作ったものの、どんなメッセージを送ればいいかわからず放置状態。",
  },
  {
    icon: "🔍",
    title: "休眠患者の\n掘り起こしができない",
    desc: "治療中断や定期検診から足が遠のいている患者様への適切なアプローチ手段がない。",
  },
  {
    icon: "👩‍⚕️",
    title: "歯科医師・衛生士が\n採用できない",
    desc: "求人を出しても応募が来ない。医院の魅力が求職者に上手く伝わっていない。",
  },
  {
    icon: "⚙️",
    title: "業務が属人化し\n数字の管理ができていない",
    desc: "受付スタッフの負担が大きく、予約率やリピート率などの正確な数値集計ができていない。",
  },
];

export function ProblemsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="problems" className="section-py bg-gray-50">
      <div className="container-lg">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Problems</span>
          <h2 className="section-heading">
            こんな<span className="text-teal-600">運営課題</span>、
            <br className="md:hidden" />
            抱えていませんか？
          </h2>
          <p className="section-subheading">
            現場のスタッフも院長も、日々の診療に追われて<br className="hidden md:block" />
            「わかってはいるけど手が回らない」状態になっていませんか？
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={i}
              variants={item}
              className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-4xl mb-6">{p.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug mb-4 whitespace-pre-line">
                {p.title}
              </h3>
              <p className="text-base text-gray-500 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}

          {/* Solution Highlight */}
          <motion.div
            variants={item}
            className="gradient-brand rounded-3xl p-10 text-white flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-6">🤝</div>
              <h3 className="text-lg font-bold leading-snug mb-4">
                これらをすべて<br />まとめて伴走支援します
              </h3>
              <p className="text-base opacity-90 leading-relaxed">
                外部のシステム会社ではなく、現場に入り込む「運営改善パートナー」として解決に導きます。
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
