"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const PROBLEMS = [
  {
    icon: "📋",
    title: "問い合わせが来ても\n予約にならない",
    desc: "せっかく来た問い合わせが、対応が遅れたりフォームが分かりにくかったりで予約に結びつかない。",
  },
  {
    icon: "📵",
    title: "無断キャンセルが\n繰り返される",
    desc: "リマインドがなく、当日になって無断キャンセルが発覚。診療枠の無駄と収益損失が続いている。",
  },
  {
    icon: "💬",
    title: "LINEを\n活用できていない",
    desc: "LINEは登録してもらっているのに、一斉配信だけで予約導線やフォロー運用には使えていない。",
  },
  {
    icon: "🔍",
    title: "過去の患者様に\nアプローチできない",
    desc: "来院が途絶えた患者様を把握できておらず、掘り起こしの仕組みがまったくない状態。",
  },
  {
    icon: "👥",
    title: "スタッフ対応が\n属人化している",
    desc: "担当者によって対応がバラバラで、引き継ぎや標準化ができておらず、教育コストがかかる。",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function ProblemsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="problems" className="section-py bg-gray-50" ref={ref}>
      <div className="container-lg">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">よくあるお悩み</span>
          <h2 className="section-heading">
            こんなお悩み、<br className="md:hidden" />
            ありませんか？
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
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

          {/* CTA card */}
          <motion.div
            variants={item}
            className="gradient-brand rounded-3xl p-10 text-white flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl mb-6">💡</div>
              <h3 className="text-lg font-bold leading-snug mb-4">
                これらをすべて<br />まとめて解決します
              </h3>
              <p className="text-base opacity-90 leading-relaxed">
                個人事業主だからこそできる、現場に寄り添った柔軟なサポートです。
              </p>
            </div>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-6 inline-block text-sm font-bold text-white underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              無料相談する →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
