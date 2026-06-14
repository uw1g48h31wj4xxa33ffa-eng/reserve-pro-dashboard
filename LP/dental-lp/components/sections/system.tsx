"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Dashboard Mockup
function DashboardMockup() {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col gap-6 w-full max-w-[500px]">
      
      {/* A歯科医院 */}
      <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-lg">A</div>
          <div>
            <h4 className="font-bold text-gray-900 text-base">A歯科医院 様</h4>
            <p className="text-[10px] text-gray-500">予約確定率推移</p>
          </div>
        </div>
        <div className="space-y-4">
          {/* 改善前 */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-bold">
              <span className="text-gray-500">改善前</span>
              <span className="text-gray-400">28.5%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-400 h-2 rounded-full" style={{ width: '28.5%' }}></div>
            </div>
          </div>
          {/* 改善後 */}
          <div className="relative">
            <div className="absolute -top-4 -right-1 text-xl drop-shadow-sm z-10">✨</div>
            <div className="flex justify-between text-xs mb-1 font-bold">
              <span className="text-teal-600">改善後</span>
              <span className="text-teal-700 text-lg">52.0%</span>
            </div>
            <div className="w-full bg-teal-100 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: '52%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* B歯科医院 */}
      <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-lg">B</div>
          <div>
            <h4 className="font-bold text-gray-900 text-base">B歯科医院 様</h4>
            <p className="text-[10px] text-gray-500">休眠患者掘り起こし（月間）</p>
          </div>
        </div>
        <div className="space-y-4">
          {/* 改善前 */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-bold">
              <span className="text-gray-500">改善前</span>
              <span className="text-gray-400">0件</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-400 h-2 rounded-full" style={{ width: '2%' }}></div>
            </div>
          </div>
          {/* 改善後 */}
          <div className="relative">
            <div className="absolute -top-4 -right-1 text-xl drop-shadow-sm z-10">✨</div>
            <div className="flex justify-between text-xs mb-1 font-bold">
              <span className="text-sky-600">改善後</span>
              <span className="text-sky-700 text-lg">13件</span>
            </div>
            <div className="w-full bg-sky-100 rounded-full h-2">
              <div className="bg-sky-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// LINE & Flow Mockup (① LINE配信, ② 改善フロー)
function LineFlowMockup() {
  return (
    <div className="relative w-[340px] h-[480px] flex items-center justify-center shrink-0">
      
      {/* ② 改善フロー (Back Right) */}
      <div className="absolute right-0 top-6 w-[220px] bg-white rounded-3xl p-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 z-10 rotate-3">
        <div className="text-xs font-bold text-gray-800 mb-4 text-center border-b border-gray-100 pb-3">配信自動化フロー</div>
        <div className="flex flex-col gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center shadow-sm">
            <span className="font-bold text-teal-600 text-[10px]">Step 1</span><br/>
            <span className="text-xs font-medium text-gray-700">最終来院から半年後</span>
          </div>
          <div className="w-0.5 h-4 bg-teal-200 mx-auto" />
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center shadow-sm">
            <span className="font-bold text-teal-600 text-[10px]">Step 2</span><br/>
            <span className="text-xs font-medium text-teal-800">検診案内を自動送信</span>
          </div>
          <div className="w-0.5 h-4 bg-teal-200 mx-auto" />
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-center shadow-sm">
            <span className="font-bold text-teal-600 text-[10px]">Step 3</span><br/>
            <span className="text-xs font-medium text-gray-700">予約システムと連携</span>
          </div>
        </div>
      </div>

      {/* ① LINE Phone (Front Left) */}
      <div className="absolute left-0 bottom-6 w-[240px] bg-[#86afcb] rounded-[2.5rem] p-3 shadow-2xl border-[6px] border-gray-900 overflow-hidden h-[400px] z-20 -rotate-2">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-gray-900 rounded-b-xl z-30" />
        <div className="bg-[#273246] text-white text-center py-2 rounded-t-xl font-bold text-xs shadow-sm relative z-20 pt-6">
          DentalConnect
        </div>
        <div className="flex-1 overflow-hidden flex flex-col gap-3 p-2 mt-3 relative z-20">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-sm shadow-sm">🦷</div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none text-[10px] text-gray-800 shadow-sm leading-relaxed">
              定期検診のお知らせ🌸<br/>
              ご予約はこちら👇
            </div>
          </div>
          <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="bg-teal-500 text-white text-[10px] font-bold p-1.5 text-center">メニューを選択</div>
            <div className="p-1.5 flex flex-col gap-1.5">
              <button className="bg-gray-50 text-[10px] py-2 px-2 rounded-lg border border-gray-200 font-bold text-gray-700">予約する</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Booking App Mockup
function AppMockup() {
  return (
    <div className="w-[280px] bg-gray-50 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-[8px] border-gray-900 relative overflow-hidden h-[480px] flex flex-col shrink-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-2xl z-20" />
      
      {/* App Header */}
      <div className="bg-white px-4 pt-10 pb-4 border-b border-gray-100 shadow-sm relative z-10 flex justify-between items-center">
        <div className="font-bold text-gray-800 text-sm">予約管理</div>
        <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-[10px]">⚙️</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 relative z-10">
        {/* Calendar Mini */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-xs font-bold text-gray-600 mb-3 flex justify-between">
            <span>2024年 5月</span>
            <span className="text-teal-600">今日</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-gray-400 mb-2">
            <div>日</div><div>月</div><div>火</div><div>水</div><div>木</div><div>金</div><div>土</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-gray-700">
            {[...Array(14)].map((_, i) => (
              <div key={i} className={`aspect-square flex items-center justify-center rounded-full ${i === 4 ? 'bg-teal-500 text-white font-bold shadow-sm' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 申請一覧 */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
            <span>申請一覧</span>
            <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">2</span>
          </div>
          
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="w-16 h-3 bg-gray-200 rounded-full blur-[2px]" />
              <div className="text-[9px] text-gray-400">10:30</div>
            </div>
            <div className="w-24 h-3 bg-gray-100 rounded-full blur-[1px]" />
            <div className="flex gap-2 mt-1">
              <div className="px-2 py-1 bg-teal-50 text-teal-600 text-[8px] rounded font-bold">確定済</div>
              <div className="px-2 py-1 bg-gray-50 text-gray-500 text-[8px] rounded">詳細</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="w-12 h-3 bg-gray-200 rounded-full blur-[2px]" />
              <div className="text-[9px] text-gray-400">14:00</div>
            </div>
            <div className="w-20 h-3 bg-gray-100 rounded-full blur-[1px]" />
            <div className="flex gap-2 mt-1">
              <div className="px-2 py-1 bg-teal-50 text-teal-600 text-[8px] rounded font-bold">確定済</div>
              <div className="px-2 py-1 bg-gray-50 text-gray-500 text-[8px] rounded">詳細</div>
            </div>
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

        <div className="flex flex-col items-center gap-16 max-w-3xl mx-auto relative">
          
          {/* ② 実際の集計画像 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-sm font-bold tracking-wider text-teal-600 mb-6 border border-teal-200 bg-teal-50 px-6 py-2 rounded-full shadow-sm">
              実際の集計画像
            </div>
            <div className="group transition-transform duration-700 hover:scale-105 w-full flex justify-center">
              <DashboardMockup />
            </div>
          </motion.div>

          <div className="text-gray-300 text-3xl">↓</div>

          {/* ③ 実際の運用画面 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-sm font-bold tracking-wider text-teal-600 mb-6 border border-teal-200 bg-teal-50 px-6 py-2 rounded-full shadow-sm">
              実際の運用画面
            </div>
            <div className="group transition-transform duration-700 hover:scale-105">
              <AppMockup />
            </div>
          </motion.div>

          <div className="text-gray-300 text-3xl">↓</div>

          {/* ④ 実際の運用例 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-sm font-bold tracking-wider text-teal-600 mb-6 border border-teal-200 bg-teal-50 px-6 py-2 rounded-full shadow-sm">
              実際の運用例
            </div>
            <div className="group transition-transform duration-700 hover:scale-105">
              <LineFlowMockup />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
