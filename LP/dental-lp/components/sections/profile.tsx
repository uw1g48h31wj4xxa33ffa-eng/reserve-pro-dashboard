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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 tracking-wider">
            現場には現場の<span className="text-teal-600">状況</span>があります
          </h2>
          
          <div className="text-base md:text-lg text-gray-600 leading-loose space-y-6">
            <p>前職は医療従事者として勤務</p>
            <p>
              現在は歯科医院の<br />
              予約導線、LINE運用、掘り起こし、<br className="md:hidden" />
              数値管理、採用などの実務に携わっています
            </p>
            <p className="pt-4">
              だからこそ、<br />
              まず状況を知ることを大切にしています
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
