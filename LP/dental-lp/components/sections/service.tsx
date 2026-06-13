"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SERVICES = [
  {
    num: "01",
    icon: "📅",
    title: "予約導線改善",
    desc: "予約フォームの導線見直しや、無断キャンセルを防ぐリマインド整備など、確実な来院に繋げる仕組みをゼロから構築します。",
  },
  {
    num: "02",
    icon: "💬",
    title: "LINE運用改善",
    desc: "公式LINEの立ち上げから、患者様に読まれる配信メッセージの作成・自動応答の設定まで、実務をまるごとサポートします。",
  },
  {
    num: "03",
    icon: "🔄",
    title: "掘り起こし支援",
    desc: "過去の患者データを活用し、適切なタイミングで再来院を促す施策を実施。定期検診への移行率を高めます。",
  },
  {
    num: "04",
    icon: "👩‍⚕️",
    title: "採用サポート",
    desc: "歯科医師・衛生士の求人媒体の最適化から、採用専用ページの制作まで。貴院の魅力を正しく伝え、採用成功を後押しします。",
  },
  {
    num: "05",
    icon: "📊",
    title: "数値管理・集計",
    desc: "予約率・キャンセル率・LINE経由来院数などを定期集計し、数字に基づいた経営判断をサポートします。",
  },
  {
    num: "06",
    icon: "⚙️",
    title: "業務改善",
    desc: "受付業務の属人化を解消し、スタッフ全員が動きやすいフロー・マニュアルを整備。現場の負担を減らします。",
  },
  {
    num: "07",
    icon: "🖥️",
    title: "システム構築・活用",
    desc: "必要に応じて予約管理システムやLINE連携ツールを導入・設定。システムは「主役」ではなく、改善を支える補助ツールとして活用します。",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const containerVar = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVar = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="services" className="section-py bg-gray-50">
      <div className="container-lg">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Support Menu</span>
          <h2 className="section-heading">
            7つの<span className="text-teal-600">運営改善支援</span>
          </h2>
          <p className="section-subheading">
            ツールを売るのではなく、貴院の現場に入り込んで<br className="hidden md:block" />
            一緒に改善を積み重ねます。
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVar}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {SERVICES.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVar}
              className={`flex items-start gap-5 bg-white rounded-3xl px-8 py-7 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
                i === SERVICES.length - 1 ? "md:col-span-2 lg:max-w-2xl lg:mx-auto w-full" : ""
              }`}
            >
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs font-black text-teal-400 tracking-wider">{s.num}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-base text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 mb-6">まずは貴院の現状をお聞かせください</p>
          <button
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 text-base font-bold text-white rounded-full gradient-brand shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            無料相談を申し込む →
          </button>
        </div>
      </div>
    </section>
  );
}
