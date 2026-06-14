"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

// Privacy mask
const PrivacyMask = ({ className }: { className?: string }) => (
  <div className={`absolute backdrop-blur-md bg-white/60 border border-white/40 shadow-sm rounded-md z-10 ${className}`} />
);

// LINE Mockup
function LineMockup() {
  return (
    <div className="w-[200px] bg-[#86afcb] rounded-[2rem] p-3 shadow-xl border-[6px] border-gray-900 relative overflow-hidden h-[340px] flex flex-col shrink-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-gray-900 rounded-b-xl z-20" />
      <div className="bg-[#273246] text-white text-center py-2 rounded-t-xl font-bold text-[10px] shadow-sm relative z-10 pt-5">
        DentalConnect
      </div>
      <div className="flex-1 overflow-hidden flex flex-col gap-2 p-2 mt-2 relative z-10">
        <div className="flex gap-1.5">
          <div className="w-6 h-6 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-[10px]">🦷</div>
          <div className="bg-white p-2 rounded-xl rounded-tl-none text-[9px] text-gray-800 shadow-sm leading-relaxed">
            春の検診キャンペーン🌸<br/>
            ご予約はこちら👇
          </div>
        </div>
        <div className="mt-1 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-teal-500 text-white text-[9px] font-bold p-1.5 text-center">メニューを選択</div>
          <div className="p-1.5 flex flex-col gap-1.5">
            <button className="bg-gray-50 text-[8px] py-1.5 px-2 rounded border border-gray-200">予約する</button>
            <button className="bg-gray-50 text-[8px] py-1.5 px-2 rounded border border-gray-200">詳細を見る</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Mockup
function DashboardMockup() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex flex-col h-full w-[280px] shrink-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-sm">A</div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">A歯科医院 様</h4>
          <p className="text-[10px] text-gray-500">月間予約推移</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="text-[10px] font-bold text-gray-500 mb-1">改善前</div>
          <div className="text-xl font-medium text-gray-400 line-through">28.5%</div>
        </div>
        <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-100 relative">
          <div className="absolute -top-2 -right-2 text-lg drop-shadow-md">✨</div>
          <div className="text-[10px] font-bold text-teal-600 mb-1">改善後</div>
          <div className="text-2xl font-black text-teal-700">52.0%</div>
        </div>
      </div>
    </div>
  );
}

export function SystemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="system" className="py-24 bg-white">
      <div className="container-lg">
        <div className="text-center mb-24">
          <h2 className="text-2xl font-bold tracking-widest text-gray-800">
            実際に運用している一例
          </h2>
        </div>

        <div className="flex justify-center items-center">
          {/* Images / UI Mockups */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-3xl h-[500px] flex items-center justify-center"
          >
            {/* Base Background Blob */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 to-teal-50 rounded-full blur-3xl opacity-50" />
            
            {/* Raw App Image */}
            <motion.div 
              initial={{ x: -40, y: -20, opacity: 0, rotate: -5 }}
              animate={isInView ? { x: -60, y: -40, opacity: 1, rotate: -5 } : {}}
              transition={{ delay: 0.2 }}
              className="absolute w-[300px] h-[220px] rounded-2xl shadow-xl border-4 border-white overflow-hidden bg-gray-50 z-10 hover:z-50 hover:scale-105 transition-all"
            >
              <Image src="/uploads/app-1.jpg" alt="運用画面" fill className="object-cover object-top" />
              <PrivacyMask className="top-2 left-2 w-[90%] h-[30%]" />
            </motion.div>

            {/* Dashboard Mockup */}
            <motion.div
              initial={{ x: 40, y: 0, opacity: 0, rotate: 3 }}
              animate={isInView ? { x: 80, y: 0, opacity: 1, rotate: 3 } : {}}
              transition={{ delay: 0.4 }}
              className="absolute z-20 hover:z-50 hover:scale-105 transition-all"
            >
              <DashboardMockup />
            </motion.div>

            {/* LINE Mockup */}
            <motion.div
              initial={{ y: 20, opacity: 0, rotate: -2 }}
              animate={isInView ? { y: 60, opacity: 1, rotate: -2 } : {}}
              transition={{ delay: 0.6 }}
              className="absolute bottom-0 z-30 hover:z-50 hover:scale-105 transition-all"
            >
              <LineMockup />
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
