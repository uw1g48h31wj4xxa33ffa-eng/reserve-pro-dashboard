"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const SERVICES = [
  {
    icon: "📝",
    title: "予約フォーム制作",
    desc: "患者様が迷わず予約できる、シンプルで分かりやすいフォームを設計・制作します。",
  },
  {
    icon: "💬",
    title: "LINE導線設計",
    desc: "問い合わせからLINE登録・予約へとスムーズに誘導する導線を設計します。",
  },
  {
    icon: "✅",
    title: "予約確定フォロー",
    desc: "予約後の事前案内・確認メッセージを自動化し、来院率を高めます。",
  },
  {
    icon: "🚫",
    title: "無断キャンセル対策",
    desc: "前日・当日のリマインドメッセージを自動送信し、無断キャンセルを劇的に削減します。",
  },
  {
    icon: "🔁",
    title: "掘り起こし運用",
    desc: "来院が途絶えた患者様へ、タイミングを見計らったメッセージで再来院を促します。",
  },
  {
    icon: "📊",
    title: "分析レポート",
    desc: "予約率・キャンセル率・掘り起こし実績などを毎月レポートとしてご報告します。",
  },
  {
    icon: "💡",
    title: "改善提案",
    desc: "データに基づき、さらなる予約率向上のための改善案を継続的にご提案します。",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="section-py bg-gray-50" ref={ref}>
      <div className="container-lg">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">サービス内容</span>
          <h2 className="section-heading">提供しているサービス</h2>
          <p className="section-subheading">
            システムの導入だけではありません。<br />
            個人事業主だからこそできる、現場に寄り添った運用まで一緒に取り組みます。
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Service list */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="space-y-4"
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

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/system_mockup.png"
                alt="予約管理・LINE運用のイメージ"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-lg border border-gray-100"
            >
              <div className="text-xs text-teal-600 font-semibold">実績</div>
              <div className="text-lg font-black text-gray-900">予約確定率 50%</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
