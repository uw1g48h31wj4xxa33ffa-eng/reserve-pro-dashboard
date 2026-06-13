"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function SystemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const tools = [
    {
      icon: "📱",
      title: "LINE公式アカウント",
      desc: "患者様へのリマインド・掘り起こし・情報配信に活用。設定から運用まで代行します。",
    },
    {
      icon: "📋",
      title: "予約管理システム",
      desc: "既存の予約システムの見直しや、より使いやすいツールへの移行をサポートします。",
    },
    {
      icon: "📊",
      title: "データ集計ツール",
      desc: "予約率・来院数・キャンセル率などを可視化し、改善の進捗を数字で確認できます。",
    },
    {
      icon: "👤",
      title: "採用・求人ページ",
      desc: "貴院の強みが伝わる採用ページを制作し、歯科医師・衛生士の採用を支援します。",
    },
  ];

  return (
    <section id="system" className="section-py bg-white">
      <div className="container-lg">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Tools & System</span>
          <h2 className="section-heading">
            改善を支える<span className="text-teal-600">ツール・システム</span>
          </h2>
          <p className="section-subheading">
            システムはあくまで「改善の手段」です。
            <br className="hidden md:block" />
            現場の状況に合わせて必要なものだけを、適切に活用します。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 flex items-center justify-center p-4"
          >
            <img
              src="/system_mockup.png"
              alt="活用するシステム・管理画面イメージ"
              className="w-full h-auto object-contain rounded-xl"
            />
          </motion.div>

          {/* Tools list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm font-bold mb-4">
              <span>💡</span> システムは主役ではありません
            </div>
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              当サービスの主役は「改善の実績と成果」です。
              ツールや仕組みは、その実現を後押しするための手段として必要な場合のみ導入します。
            </p>
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-start gap-4 bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{tool.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
