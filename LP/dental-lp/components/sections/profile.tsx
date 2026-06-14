"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ProfileSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="profile" className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="container-lg max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-gray-100 text-center"
        >
          <span className="section-eyebrow">Background</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">
            机上の理論ではなく、<br className="md:hidden" />
            <span className="text-teal-600">実際の運用</span>を踏まえて
          </h2>
          
          <p className="text-base md:text-lg text-gray-600 leading-loose mb-10">
            実際に歯科医院の<br className="md:hidden" />
            <span className="font-bold text-gray-800">予約導線</span> / 
            <span className="font-bold text-gray-800"> LINE運用</span> / 
            <span className="font-bold text-gray-800"> 掘り起こし</span> / 
            <span className="font-bold text-gray-800"> 数値管理</span> / 
            <span className="font-bold text-gray-800"> 歯科医師採用</span> / 
            <span className="font-bold text-gray-800"> 歯科衛生士採用</span><br className="hidden md:block" />
            などの実務に携わっています
          </p>

          <div className="inline-block px-6 py-3 bg-teal-50 rounded-full border border-teal-100">
            <p className="text-sm md:text-base font-bold text-teal-800">
              状況が分からないまま何かを決めることはありません
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
