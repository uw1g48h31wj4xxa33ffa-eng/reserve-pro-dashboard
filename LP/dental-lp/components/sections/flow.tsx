"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    num: "01",
    title: "現状のヒアリング・課題抽出",
    desc: "まずはオンラインまたはご訪問にて、貴院が抱える運営上の課題（予約、採用、業務負担など）を詳しくお伺いします",
  },
  {
    num: "02",
    title: "改善プランの策定",
    desc: "ヒアリング内容をもとに、貴院に最適な「改善の優先順位」と「具体的な施策プラン」をご提案いたします",
  },
  {
    num: "03",
    title: "LINE・予約導線の構築",
    desc: "即効性の高い予約率の改善やLINE公式アカウントの構築・設定など、土台となる仕組みづくりから着手します",
  },
  {
    num: "04",
    title: "スタッフへの共有・運用テスト",
    desc: "新しい仕組みが現場の負担にならないよう、スタッフ様へ丁寧に共有し、テスト運用を行いながら調整します",
  },
  {
    num: "05",
    title: "掘り起こし・採用支援の開始",
    desc: "土台が整った段階で、休眠患者へのアプローチや、求人媒体の見直しなど、より高度な課題解決へと進みます",
  },
  {
    num: "06",
    title: "数値集計と効果測定",
    desc: "施策の結果（予約数、キャンセル率、採用応募数など）を定期的に集計し、データに基づいた効果測定を行います",
  },
  {
    num: "07",
    title: "継続的な業務改善の伴走",
    desc: "月に1回のミーティング等を通じて、新たな課題の発見や運用改善を繰り返し、貴院の発展を継続的にサポートします",
  },
];

export function FlowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVar = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="flow" className="section-py bg-gray-50 overflow-hidden">
      <div className="container-md">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Support Flow</span>
          <h2 className="section-heading">伴走サポートの流れ</h2>
          <p className="section-subheading">
            システムの導入で終わらせず、<br className="md:hidden" />着実な改善まで寄り添います
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVar}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="relative"
        >
          {/* Vertical line connecting steps */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-teal-100 -translate-x-1/2" />

          <div className="space-y-12">
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={step.num}
                  variants={itemVar}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Center Node */}
                  <div className="absolute left-6 md:left-1/2 w-12 h-12 rounded-full bg-white border-4 border-teal-100 shadow-sm flex items-center justify-center -translate-x-1/2 z-10">
                    <div className="w-4 h-4 rounded-full gradient-brand" />
                  </div>

                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                      <div className="text-sm font-black text-teal-600 mb-2 tracking-wider">
                        STEP {step.num}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        {step.desc}
                      </p>
                      
                      {/* Hover highlight bar */}
                      <div className={`absolute top-0 bottom-0 w-1.5 gradient-brand opacity-0 group-hover:opacity-100 transition-opacity ${isEven ? "right-0 rounded-r-3xl" : "left-0 rounded-l-3xl"}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
