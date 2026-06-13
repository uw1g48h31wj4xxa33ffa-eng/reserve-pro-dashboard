"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// CountUp Component
function CountUp({ end, suffix = "", duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, isInView]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// Recreated Dashboard UI Component for A/B Clinics
function DashboardMockup({ clinicName, beforeLabel, afterLabel, beforeData, afterData, title }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 to-sky-400 opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
            {clinicName.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{clinicName}</h4>
            <p className="text-xs text-gray-500">{title}</p>
          </div>
        </div>
        <div className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
          実績レポート
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {/* Before */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-between">
          <div className="text-xs font-bold text-gray-500 mb-2">{beforeLabel}</div>
          <div className="flex flex-col gap-1">
            {beforeData.map((d: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{d.label}</span>
                <span className="font-bold text-gray-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* After */}
        <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100 flex flex-col justify-between relative">
          <div className="absolute -top-3 -right-3 text-2xl drop-shadow-md">✨</div>
          <div className="text-xs font-bold text-teal-600 mb-2">{afterLabel}</div>
          <div className="flex flex-col gap-1">
            {afterData.map((d: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{d.label}</span>
                <span className="font-black text-teal-700">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const RESULTS = [
    {
      label: "予約確定率",
      before: "30%",
      after: <CountUp end={50} suffix="%" />,
      desc: "問い合わせからの確実な予約化",
    },
    {
      label: "無断キャンセル",
      before: "月3件",
      after: "0〜1件",
      desc: "リマインド徹底による防止",
    },
    {
      label: "休眠掘り起こし",
      before: "0件",
      after: (
        <>
          <span className="text-3xl text-gray-500 font-bold mr-1">平均</span>
          <CountUp end={13} suffix="件" />
        </>
      ),
      desc: "適切なLINE配信アプローチ",
    },
  ];

  return (
    <section id="results" className="section-py relative bg-gray-50">
      <div className="container-lg">
        <div className="text-center mb-20">
          <span className="section-eyebrow">Proven Results</span>
          <h2 className="section-heading">
            圧倒的な<span className="text-teal-600">改善実績</span>
          </h2>
          <p className="section-subheading">
            実際の現場の数字を細かく分析・改善し、結果を出しています。
          </p>
        </div>

        {/* Main KPIs */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {RESULTS.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 text-center relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-sky-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="text-gray-500 font-bold text-lg mb-8">{res.label}</div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl text-gray-400 font-medium line-through mb-2">
                  {res.before}
                </div>
                <div className="text-3xl text-teal-300 mb-2">↓</div>
                <div className="text-6xl font-black text-gray-900 tracking-tighter">
                  {res.after}
                </div>
              </div>
              <div className="mt-8 text-sm text-gray-500 bg-gray-50 py-2 px-4 rounded-full inline-block">
                {res.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboards Mockups */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800">実際の集計データに基づく改善例</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <DashboardMockup 
                clinicName="A歯科医院 様"
                title="月間予約・来院状況の推移"
                beforeLabel="改善前（半年前）"
                afterLabel="改善後（現在）"
                beforeData={[
                  { label: "問い合わせ", value: "42件" },
                  { label: "予約確定", value: "12件" },
                  { label: "確定率", value: "28.5%" },
                ]}
                afterData={[
                  { label: "問い合わせ", value: "48件" },
                  { label: "予約確定", value: "25件" },
                  { label: "確定率", value: "52.0%" },
                ]}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <DashboardMockup 
                clinicName="B矯正歯科 様"
                title="LINE運用・掘り起こし実績"
                beforeLabel="改善前"
                afterLabel="改善後"
                beforeData={[
                  { label: "友だち追加", value: "15件/月" },
                  { label: "配信反応", value: "ほぼゼロ" },
                  { label: "再来院誘導", value: "0件" },
                ]}
                afterData={[
                  { label: "友だち追加", value: "45件/月" },
                  { label: "配信反応", value: "大幅増加" },
                  { label: "再来院誘導", value: "月平均11件" },
                ]}
              />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
