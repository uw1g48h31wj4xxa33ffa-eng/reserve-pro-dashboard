"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroSection() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/fv_bg.png"
          alt="清潔感ある歯科医院の内観"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/97 via-white/88 to-white/40" />
      </div>

      {/* Blobs */}
      <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-teal-100/30 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full bg-sky-100/30 blur-3xl -z-10 pointer-events-none" />

      <div className="container-lg py-20">
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13 } } }}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-teal-50 text-teal-700 border border-teal-100 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              歯科医院向け 運営改善パートナー
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-900 mb-6"
          >
            歯科医院の運営課題を
            <br />
            <span className="gradient-brand-text">現場目線で改善する</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10"
          >
            予約導線・LINE運用・掘り起こしから採用・業務改善まで。
            <br className="hidden md:block" />
            個人事業主だからこそできる、現場に寄り添った伴走支援です。
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <button
              onClick={() => handleNav("#contact")}
              className="px-8 py-4 text-base font-bold text-white rounded-full gradient-brand shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              今の状況を共有する
            </button>
            <button
              onClick={() => handleNav("#results")}
              className="px-8 py-4 text-base font-bold text-teal-700 rounded-full bg-white border-2 border-teal-200 hover:border-teal-400 hover:bg-teal-50 hover:-translate-y-1 transition-all duration-200"
            >
              実績を見る →
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-6 mt-12 text-sm text-gray-500"
          >
            {[
              "✅ 予約確定率 30% → 50%達成",
              "✅ 無断キャンセル 0〜1件",
              "✅ 掘り起こし 平均13件/月",
            ].map((badge) => (
              <span key={badge} className="font-medium">
                {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-2.5 rounded-full bg-teal-400" />
        </motion.div>
      </div>
    </section>
  );
}
