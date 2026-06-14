"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function EmpathySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="empathy" className="py-32 bg-gray-50" ref={ref}>
      <div className="container-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-10"
        >
          <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed tracking-wide">
            改善したいことはある
          </p>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed tracking-wide">
            でも日々の業務もある
          </p>
          <p className="text-2xl md:text-3xl font-bold text-teal-600 leading-relaxed tracking-wide">
            だからまず状況を整理する
          </p>
        </motion.div>
      </div>
    </section>
  );
}
