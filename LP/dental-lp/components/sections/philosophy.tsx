"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function PhilosophySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="philosophy" className="py-32 bg-gray-50" ref={ref}>
      <div className="container-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center space-y-12"
        >
          <div className="space-y-6">
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
              現場には現場の状況があります
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
              人には人の考えがあります
            </p>
          </div>

          <div className="w-8 h-px bg-gray-300 mx-auto" />

          <div className="space-y-6">
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
              まず状況を整理する
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
              必要に応じて<br className="md:hidden" />仕組みやAIも活用する
            </p>
          </div>

          <div className="w-8 h-px bg-gray-300 mx-auto" />

          <div className="space-y-6">
            <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
              ただし、<br className="md:hidden" />仕組みやAIが目的ではありません
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
