"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "導入支援プラン",
      desc: "現在のシステムやLINEの初期設定・導線改善を短期集中で行います。",
      init: "198,000",
      monthly: "29,800",
      features: ["課題ヒアリング", "予約導線の再設計", "LINE公式アカウント構築", "初回マニュアル作成"],
    },
    {
      name: "運営改善プラン",
      desc: "導入後も数値を追いながら、継続的に現場の改善をサポートします。",
      init: "298,000",
      monthly: "49,800",
      features: ["月1回のオンラインMTG", "LINE配信メッセージ作成代行", "予約率・キャンセル率の集計", "スタッフ向け業務フロー改善"],
      recommended: true,
    },
  ];

  return (
    <section id="pricing" className="section-py bg-white">
      <div className="container-lg max-w-5xl">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Pricing</span>
          <h2 className="section-heading">
            料金の<span className="text-teal-600">目安</span>
          </h2>
          <p className="section-subheading">
            医院ごとの課題・業務範囲に応じて最適なプランをご提案します。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12" ref={ref}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-[2rem] p-8 md:p-10 border relative ${
                plan.recommended 
                  ? "bg-gradient-to-b from-teal-50/50 to-white border-teal-200 shadow-xl shadow-teal-500/5" 
                  : "bg-white border-gray-100 shadow-sm"
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-sky-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md">
                  Recommended
                </div>
              )}
              
              <h3 className="text-2xl font-black text-gray-900 mb-4">{plan.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8 h-10">{plan.desc}</p>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-baseline justify-between shadow-sm">
                  <span className="text-sm font-bold text-gray-500">初期費用</span>
                  <div>
                    <span className="text-2xl font-black text-gray-900">{plan.init}</span>
                    <span className="text-sm font-bold text-gray-500 ml-1">円〜</span>
                  </div>
                </div>
                <div className={`rounded-xl p-4 border flex items-baseline justify-between shadow-sm ${plan.recommended ? "bg-teal-500 border-teal-400 text-white" : "bg-white border-gray-100"}`}>
                  <span className={`text-sm font-bold ${plan.recommended ? "text-teal-50" : "text-gray-500"}`}>月額費用</span>
                  <div>
                    <span className={`text-3xl font-black ${plan.recommended ? "text-white" : "text-teal-600"}`}>{plan.monthly}</span>
                    <span className={`text-sm font-bold ml-1 ${plan.recommended ? "text-teal-100" : "text-teal-600"}`}>円〜</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="text-teal-500 flex-shrink-0">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 text-center flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">🤝</span>
            <span className="font-bold text-gray-700">伴走支援プラン（カスタマイズ）</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-gray-200" />
          <span className="text-xl font-black text-teal-600">個別お見積り</span>
        </motion.div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-6">※上記はあくまで参考価格です。まずは無料相談で現状をお聞かせください。</p>
          <button
            onClick={() => {
              const el = document.querySelector("#contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-teal-600 font-bold hover:text-teal-700 underline underline-offset-4"
          >
            無料相談（Zoom）を申し込む →
          </button>
        </div>
      </div>
    </section>
  );
}
