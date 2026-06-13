"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const SERVICES = [
  {
    icon: "📅",
    title: "予約率の改善・最適化",
    desc: "予約フォームの導線見直しや、無断キャンセルを防ぐためのリマインド設定など、確実な来院に繋げる仕組みを構築します。",
  },
  {
    icon: "💬",
    title: "LINE運用の構築・代行",
    desc: "公式LINEの立ち上げから、患者様に読まれる配信メッセージの作成、自動応答の設定まで、実務をまるごとサポートします。",
  },
  {
    icon: "🔄",
    title: "休眠患者の掘り起こし運用",
    desc: "過去の患者データを活用し、適切なタイミングで再来院を促すアプローチを実施。定期検診への移行率を高めます。",
  },
  {
    icon: "👨‍⚕️",
    title: "採用支援（歯科医師・衛生士）",
    desc: "求人媒体の最適化や、採用特設ページの改善により、貴院の魅力を正しく伝え、質の高いスタッフ採用を実現します。",
  },
  {
    icon: "📊",
    title: "業務改善・数値集計サポート",
    desc: "受付スタッフの業務負担を軽減するためのフロー見直しや、経営判断に必要な数値（予約率・リピート率等）の集計を代行します。",
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVar = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="services" className="section-py relative bg-white">
      <div className="container-lg">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Our Support</span>
          <h2 className="section-heading">
            現場に入り込む<br />
            <span className="text-teal-600">5つの運営サポート</span>
          </h2>
          <p className="section-subheading">
            単なるツール導入ではなく、貴院の状況に合わせた実務支援を行います。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text/List Side */}
          <motion.div
            ref={ref}
            variants={containerVar}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="order-2 lg:order-1 space-y-6"
          >
            {SERVICES.map((s, i) => (
              <motion.div
                key={i}
                variants={itemVar}
                className="flex items-start gap-5 bg-white rounded-3xl px-8 py-7 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-x-1 transition-all duration-300"
              >
                <span className="text-3xl flex-shrink-0 mt-0.5">{s.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Image Side */}
          <div className="order-1 lg:order-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 flex items-center justify-center p-4"
            >
              <img
                src="/system_mockup.png"
                alt="システム画面モックアップ"
                className="w-full h-auto object-contain rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
