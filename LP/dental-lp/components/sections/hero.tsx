"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center pt-12 md:pt-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-teal-50 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="container-lg relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.4] mb-12">
              歯科医院の運営課題を<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600">
                現場目線で整理する
              </span>
            </h1>

            <p className="text-sm md:text-base font-bold text-gray-500 mb-10 leading-relaxed md:tracking-wide">
              予約・LINE運用・掘り起こし・採用など、<br />
              現場に合わせて整理します。
            </p>

            <div className="flex flex-col items-center justify-center">
              <button
                onClick={() => handleNav("#contact")}
                className="px-10 py-5 text-base font-bold text-white rounded-full gradient-brand shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                状況を聞かせてください
              </button>
              
              <button
                onClick={() => handleNav("#services")}
                className="mt-5 text-[11px] md:text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4 decoration-gray-300 transition-colors"
              >
                主に扱う領域を見る
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
