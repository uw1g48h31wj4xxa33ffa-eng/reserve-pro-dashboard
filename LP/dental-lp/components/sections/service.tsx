"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SERVICES = [
  { icon: "📅", title: "予約導線" },
  { icon: "💬", title: "LINE運用" },
  { icon: "🔄", title: "掘り起こし" },
  { icon: "👩‍⚕️", title: "採用" },
  { icon: "📊", title: "集計・数値管理" },
  { icon: "⚙️", title: "業務改善" },
];

const DETAILS = [
  {
    title: "予約導線",
    desc: ["予約フォーム、LINE導線、予約確定までの流れを確認します", "現場の運用に合わせて、無理のない導線を整理します"],
  },
  {
    title: "LINE運用",
    desc: ["リッチメニュー、配信内容、問い合わせ対応の流れを確認します", "患者様との接点を分かりやすく整理します"],
  },
  {
    title: "掘り起こし",
    desc: ["休眠顧客への再案内や、再来院につながる流れを確認します", "無理な案内ではなく、状況に合わせた方法を考えます"],
  },
  {
    title: "採用",
    desc: ["求人文面、応募導線、媒体ごとの見え方を確認します", "採用活動の入り口を整理します"],
  },
  {
    title: "集計・数値管理",
    desc: ["問い合わせ数、予約数、媒体別の反応などを確認します", "日々の状況を見える形に整理します"],
  },
  {
    title: "業務改善",
    desc: ["手作業、確認漏れ、重複対応などを確認します", "現場で無理なく続けられる形を考えます"],
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const scrollToDetail = (index: number) => {
    const el = document.getElementById(`service-detail-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="services" className="section-py bg-gray-50">
      <div className="container-lg max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="section-heading">
            主に扱う<span className="text-teal-600">領域</span>
          </h2>
          <p className="section-subheading">
            ツールありきではなく、現場の状況に合わせて実務の流れを整理します
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVar}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-24"
        >
          {SERVICES.map((s, i) => (
            <motion.button
              key={i}
              variants={itemVar}
              onClick={() => scrollToDetail(i)}
              className="w-full bg-white rounded-3xl p-6 border border-gray-100 text-center hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <div className="text-4xl mb-4 bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center">{s.icon}</div>
              <h3 className="font-bold text-gray-900">{s.title}</h3>
            </motion.button>
          ))}
        </motion.div>

        {/* 詳細セクション */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              各領域で<span className="text-teal-600">確認すること</span>
            </h3>
          </div>

          <div className="space-y-4 md:space-y-6">
            {DETAILS.map((d, i) => (
              <motion.div
                key={i}
                id={`service-detail-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              >
                <h4 className="text-base md:text-lg font-bold text-teal-700 mb-4 border-b border-teal-50 pb-3">
                  {d.title}
                </h4>
                <div className="space-y-2">
                  {d.desc.map((line, j) => (
                    <p key={j} className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium block">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
