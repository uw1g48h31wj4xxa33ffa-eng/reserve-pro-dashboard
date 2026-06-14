"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// Dashboard Mockup
function DashboardMockup() {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col h-full w-full max-w-[500px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xl">A</div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg">A歯科医院 様</h4>
          <p className="text-sm text-gray-500">月間予約推移</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-gray-500 mb-2">改善前</div>
          <div className="text-3xl font-medium text-gray-400 line-through">28.5%</div>
        </div>
        <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100 relative flex flex-col items-center justify-center">
          <div className="absolute -top-3 -right-3 text-3xl drop-shadow-md">✨</div>
          <div className="text-sm font-bold text-teal-600 mb-2">改善後</div>
          <div className="text-4xl font-black text-teal-700">52.0%</div>
        </div>
      </div>
    </div>
  );
}

// LINE Mockup
function LineMockup() {
  return (
    <div className="w-[280px] bg-[#86afcb] rounded-[3rem] p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-[8px] border-gray-900 relative overflow-hidden h-[480px] flex flex-col shrink-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-2xl z-20" />
      <div className="bg-[#273246] text-white text-center py-3 rounded-t-2xl font-bold text-sm shadow-sm relative z-10 pt-8">
        DentalConnect
      </div>
      <div className="flex-1 overflow-hidden flex flex-col gap-4 p-3 mt-4 relative z-10">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-xl">🦷</div>
          <div className="bg-white p-4 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm leading-relaxed">
            春の検診キャンペーン🌸<br/>
            ご予約はこちら👇
          </div>
        </div>
        <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-teal-500 text-white text-xs font-bold p-2 text-center">メニューを選択</div>
          <div className="p-2 flex flex-col gap-2">
            <button className="bg-gray-50 text-xs py-2.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-100">予約する</button>
            <button className="bg-gray-50 text-xs py-2.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-100">詳細を見る</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SystemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="system" className="py-32 bg-white" ref={ref}>
      <div className="container-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-xl md:text-2xl font-bold tracking-widest text-gray-800">
            実際に運用している一例
          </h2>
        </motion.div>

        {/* Balanced Grid Layout */}
        <div className="flex flex-wrap justify-center items-start gap-12 md:gap-16 max-w-6xl mx-auto">
          
          {/* 実績データ (Wide, Top) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full lg:w-auto"
          >
            <div className="text-sm font-bold tracking-wider text-teal-600 mb-6 border border-teal-200 bg-teal-50 px-6 py-2 rounded-full">
              実績データの可視化
            </div>
            <div className="group transition-transform duration-700 hover:scale-105">
              <DashboardMockup />
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-16 w-full lg:w-auto">
            {/* LINE配信 (Tall) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="text-sm font-bold tracking-wider text-teal-600 mb-6 border border-teal-200 bg-teal-50 px-6 py-2 rounded-full">
                LINE配信・改善フロー
              </div>
              <div className="group transition-transform duration-700 hover:scale-105">
                <LineMockup />
              </div>
            </motion.div>

            {/* 予約アプリ (Tall/Small) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="text-sm font-bold tracking-wider text-teal-600 mb-6 border border-teal-200 bg-teal-50 px-6 py-2 rounded-full">
                予約管理アプリ
              </div>
              <div className="group transition-transform duration-700 hover:scale-105">
                <div className="relative overflow-hidden w-[280px] h-[480px] rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-[8px] border-gray-900 bg-gray-50 flex justify-center shrink-0">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-2xl z-20" />
                  <Image
                    src="/uploads/app-1.jpg"
                    alt="予約管理アプリ"
                    width={400}
                    height={800}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
