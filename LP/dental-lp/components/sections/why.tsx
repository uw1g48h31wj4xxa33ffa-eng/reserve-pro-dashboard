"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function WhySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why" className="section-py bg-teal-600 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400 opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="container-lg relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tight">
            なぜ改善できるのか
          </h2>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <p className="text-xl md:text-2xl font-bold leading-loose mb-8">
              実際に以下の実務に<br className="md:hidden" />深く携わってきたからです
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {["LINE運用", "予約導線改善", "掘り起こし", "数値管理", "歯科医師採用", "歯科衛生士採用"].map((item, i) => (
                <span key={i} className="bg-white text-teal-700 px-4 py-2 rounded-full text-sm md:text-base font-bold shadow-sm">
                  {item}
                </span>
              ))}
            </div>

            <div className="w-16 h-1 bg-teal-400 mx-auto mb-8 rounded-full" />

            <p className="text-lg md:text-xl leading-loose font-medium opacity-90">
              机上の空論や、単なるツールの導入提案ではありません<br />
              現場のリアルな課題と向き合ってきた<br className="md:hidden" />
              <span className="text-teal-200 font-bold border-b-2 border-teal-300 pb-0.5">現場理解をベースに改善</span>
              しているため、<br className="md:hidden" />確実な成果に繋がります
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
