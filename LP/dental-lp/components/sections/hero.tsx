"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">
      {/* Background Video/Image Concept (Using a subtle gradient/blur for now to keep it clean) */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-teal-50 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="container-lg relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-bold text-gray-600 mb-8 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              歯科医院向け 運営改善パートナー
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.3] mb-8">
              歯科医院の運営課題を<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-600">
                現場目線で改善する
              </span>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base font-bold text-gray-500 mb-8">
              <span>予約</span>
              <span className="text-gray-300">/</span>
              <span>LINE運用</span>
              <span className="text-gray-300">/</span>
              <span>掘り起こし</span>
              <span className="text-gray-300">/</span>
              <span>採用</span>
              <span className="text-gray-300">/</span>
              <span>業務改善</span>
            </div>

            <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              医院ごとに合わせた<br className="md:hidden" />仕組みづくりをサポートします
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleNav("#contact")}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white rounded-full gradient-brand shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                まずは状況を共有する
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
