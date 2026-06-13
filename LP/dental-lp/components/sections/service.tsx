"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const SERVICES = [
  { icon: "📅", title: "予約導線改善", desc: "離脱を防ぐフォーム設計" },
  { icon: "💬", title: "LINE運用改善", desc: "自動応答・シナリオ構築" },
  { icon: "🔄", title: "掘り起こし支援", desc: "休眠患者へのアプローチ" },
  { icon: "📝", title: "予約フォーム構築", desc: "使いやすい専用フォーム" },
  { icon: "📊", title: "数値管理", desc: "キャンセル率等の可視化" },
  { icon: "👩‍⚕️", title: "採用支援", desc: "求人導線・ページの最適化" },
  { icon: "⚙️", title: "業務改善", desc: "受付スタッフの負担軽減" },
  { icon: "💡", title: "改善提案", desc: "毎月のデータに基づく提案" },
];

function LineMockup() {
  return (
    <div className="w-full max-w-[280px] bg-[#86afcb] rounded-[2.5rem] p-4 shadow-2xl border-8 border-gray-900 mx-auto relative overflow-hidden h-[500px] flex flex-col">
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-gray-900 rounded-b-xl z-20" />
      
      {/* LINE Header */}
      <div className="bg-[#273246] text-white text-center py-3 rounded-t-2xl font-bold text-sm shadow-sm relative z-10 pt-6">
        DentalConnect 矯正歯科
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col gap-3 p-3 mt-2 relative z-10">
        
        {/* Chat Bubble (Bot) */}
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-xs">🦷</div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none text-xs text-gray-800 shadow-sm leading-relaxed relative">
            こんにちは！<br/>
            現在の歯の状態で一番気になることは何ですか？
          </div>
        </div>

        {/* User Choice (Card/Rich Menu style) */}
        <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-teal-500 text-white text-xs font-bold p-2 text-center">
            ご希望のメニューを選択
          </div>
          <div className="p-2 flex flex-col gap-2">
            <button className="bg-gray-50 text-xs py-2 px-3 rounded text-gray-700 border border-gray-200 text-left hover:bg-gray-100">
              前歯の並びが気になる
            </button>
            <button className="bg-gray-50 text-xs py-2 px-3 rounded text-gray-700 border border-gray-200 text-left hover:bg-gray-100">
              全体の噛み合わせ
            </button>
            <button className="bg-gray-50 text-xs py-2 px-3 rounded text-gray-700 border border-gray-200 text-left hover:bg-gray-100">
              費用について知りたい
            </button>
          </div>
        </div>

        {/* Chat Bubble (Campaign/Followup) */}
        <div className="mt-4 flex gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-xs">🦷</div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-none text-xs text-gray-800 shadow-sm leading-relaxed relative">
            <div className="font-bold text-teal-600 mb-1">春の検診キャンペーン🌸</div>
            しばらくご来院がない方に、特別なご案内です。
            <div className="mt-2 bg-teal-50 text-teal-700 text-center py-1 rounded font-bold">
              ご予約はこちら
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mask component for privacy
const PrivacyMask = ({ className }: { className?: string }) => (
  <div className={`absolute backdrop-blur-md bg-white/60 border border-white/40 shadow-sm rounded-md z-10 ${className}`} />
);

export function ServicesSection() {
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
    <section id="services" className="section-py bg-white">
      <div className="container-lg">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Our Services</span>
          <h2 className="section-heading">
            8つの<span className="text-teal-600">運営改善支援</span>
          </h2>
          <p className="section-subheading">
            単なるツール導入ではなく、貴院の状況に合わせた実務支援を行います。
          </p>
        </div>

        {/* Feature Highlights with UI / Images */}
        <div className="space-y-24 mb-24">
          
          {/* Highlight 1: LINE */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-bold mb-6">
                LINE運用・掘り起こし
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                患者が迷わず進める<br/>LINE導線を設計・運用
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Q&A形式で患者の希望や不安を整理し、最適な矯正メニューや予約導線へつなげます。
                また、配信して終わりではなく反応率を見ながら画像や文面を改善し、休眠顧客の掘り起こしを支援します。
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <LineMockup />
            </motion.div>
          </div>

          {/* Highlight 2: App screens (Raw images with mask) */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex gap-4 h-[400px]"
            >
              {/* App Image 1 */}
              <div className="relative w-1/2 h-full rounded-2xl shadow-lg border border-gray-100 overflow-hidden bg-gray-50 group hover:-translate-y-2 transition-transform">
                <Image src="/uploads/app-1.jpg" alt="予約管理画面1" fill className="object-cover object-top" />
                {/* Privacy Masks */}
                <PrivacyMask className="top-[15%] left-[5%] w-[90%] h-8" />
                <PrivacyMask className="top-[25%] left-[5%] w-[90%] h-48" />
              </div>
              {/* App Image 2 */}
              <div className="relative w-1/2 h-full rounded-2xl shadow-lg border border-gray-100 overflow-hidden bg-gray-50 group hover:-translate-y-2 transition-transform mt-8">
                <Image src="/uploads/app-2.jpg" alt="予約管理画面2" fill className="object-cover object-top" />
                {/* Privacy Masks */}
                <PrivacyMask className="top-[15%] left-[5%] w-[90%] h-8" />
                <PrivacyMask className="top-[35%] left-[5%] w-[60%] h-32" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 text-sm font-bold mb-6">
                予約管理・業務改善
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                予約申請・顧客情報を<br/>管理しやすい形へ
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                自作の専用アプリやツールを活用し、予約状況、顧客情報、ブロック設定を整理。
                受付現場の対応漏れや確認の手間を大幅に減らし、業務を効率化します。
              </p>
            </motion.div>
          </div>

        </div>

        {/* 8 Services Grid */}
        <motion.div
          ref={ref}
          variants={containerVar}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {SERVICES.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVar}
              className="bg-gray-50 rounded-3xl p-6 border border-gray-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
