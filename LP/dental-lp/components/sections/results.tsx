"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface Stat {
  label: string;
  before: string;
  after: string;
  afterNum: number;
  unit: string;
  description: string;
}

const STATS: Stat[] = [
  {
    label: "予約確定率",
    before: "30%",
    after: "50%",
    afterNum: 50,
    unit: "%",
    description: "問い合わせからの予約確定が大幅に向上",
  },
  {
    label: "無断キャンセル",
    before: "月平均 3件",
    after: "0〜1件",
    afterNum: 1,
    unit: "件/月",
    description: "リマインド運用で無断キャンセルをほぼゼロに",
  },
  {
    label: "掘り起こし件数",
    before: "0件",
    after: "平均 13件",
    afterNum: 13,
    unit: "件/月",
    description: "休眠患者様へのアプローチで再来院を創出",
  },
];

function AnimatedNumber({
  target,
  unit,
  inView,
}: {
  target: number;
  unit: string;
  inView: boolean;
}) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20, mass: 1 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      motionVal.set(target);
    }
  }, [inView, target, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [spring]);

  return (
    <span>
      {display}
      {unit}
    </span>
  );
}

export function ResultsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" className="section-py" ref={ref}>
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
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 gradient-brand rounded-t-3xl" />

              <p className="text-sm font-bold text-teal-600 mb-5">{stat.label}</p>

              {/* Before → After */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl text-gray-400 line-through font-bold">
                    {stat.before}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">改善前</div>
                </div>
                <div className="text-2xl text-teal-400 font-bold">→</div>
                <div className="text-center">
                  <div className="text-3xl font-black text-gray-900">
                    <AnimatedNumber
                      target={stat.afterNum}
                      unit={stat.unit}
                      inView={inView}
                    />
                  </div>
                  <div className="text-xs text-teal-600 font-semibold mt-1">改善後</div>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center text-xs text-gray-400"
        >
          ※ 上記はサポート実施医院の実績例です。効果は医院の状況によって異なります。
        </motion.div>
      </div>
    </section>
  );
}
