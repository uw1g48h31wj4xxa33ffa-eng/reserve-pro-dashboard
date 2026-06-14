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
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 tracking-wider">
            まず状況を知る
          </h2>

          <div className="space-y-8 text-lg md:text-xl text-gray-700 leading-loose">
            <p>
              状況が分からないまま<br className="md:hidden" />
              何かを決めることはありません
            </p>
            <p>
              まず状況を知る<br />
              その上で考える
            </p>
            <div className="w-8 h-px bg-gray-300 mx-auto my-8" />
            <p>
              必要に応じて<br className="md:hidden" />
              仕組みやAIも活用する
            </p>
            <p>
              人が主体<br />
              仕組みやAIは手段
            </p>
            <p className="pt-4 font-bold text-gray-900">
              そう考えています
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
