"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const EXAMPLES = [
  {
    label: "実績データの可視化",
    images: ["/uploads/result-a-after.jpg"],
    className: "w-full max-w-[600px] aspect-video object-cover",
  },
  {
    label: "LINE配信・改善フロー",
    images: ["/uploads/line-flow.jpg", "/uploads/line-campaign.jpg"],
    className: "w-full max-w-[300px] aspect-[9/16] object-cover",
  },
  {
    label: "予約管理アプリ",
    images: ["/uploads/app-1.jpg"],
    className: "w-full max-w-[600px] aspect-[4/3] object-cover object-top",
  },
];

export function SystemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="system" className="py-32 bg-white" ref={ref}>
      <div className="container-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-xl md:text-2xl font-bold tracking-widest text-gray-800">
            実際に運用している一例
          </h2>
        </motion.div>

        <div className="space-y-32">
          {EXAMPLES.map((example, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="text-sm font-bold tracking-wider text-teal-600 mb-8 border border-teal-200 bg-teal-50 px-6 py-2 rounded-full">
                {example.label}
              </div>
              <div className={`flex flex-wrap justify-center gap-8 ${example.images.length > 1 ? 'max-w-4xl' : 'max-w-3xl'} w-full`}>
                {example.images.map((imgSrc, j) => (
                  <div key={j} className="relative group w-full flex justify-center">
                    <div className="relative overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 bg-gray-50 flex justify-center">
                      <Image
                        src={imgSrc}
                        alt={example.label}
                        width={800}
                        height={800}
                        className={`${example.className} transition-transform duration-700 group-hover:scale-105`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
