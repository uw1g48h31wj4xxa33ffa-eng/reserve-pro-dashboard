"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SERVICES = [
  { icon: "📅", title: "予約導線改善" },
  { icon: "💬", title: "LINE運用改善" },
  { icon: "🔄", title: "掘り起こし支援" },
  { icon: "👩‍⚕️", title: "採用支援" },
  { icon: "📊", title: "数値管理" },
  { icon: "⚙️", title: "業務改善" },
  { icon: "💡", title: "改善提案" },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVar = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVar = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="services" className="section-py bg-gray-50">
      <div className="container-lg max-w-5xl">
        <div className="text-center mb-16">
          <span className="section-eyebrow">Services</span>
          <h2 className="section-heading">
            多角的な<span className="text-teal-600">支援内容</span>
          </h2>
          <p className="section-subheading">
            単なるツール導入ではなく、現場の状況に合わせて実務の改善を進めます
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVar}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {SERVICES.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVar}
              className="bg-white rounded-3xl p-6 border border-gray-100 text-center hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-h-[160px]"
            >
              <div className="text-4xl mb-4 bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center">{s.icon}</div>
              <h3 className="font-bold text-gray-900">{s.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
