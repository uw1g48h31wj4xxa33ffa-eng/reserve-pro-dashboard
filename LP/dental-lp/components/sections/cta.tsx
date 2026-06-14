"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 gradient-brand opacity-95" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
            予約を逃している原因が、<br />
            今日、わかります
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            無料相談では、貴院のLINE対応状況を確認し、
            どこで予約が止まっているかをその場でお伝えします
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-turquoise-600"
            >
              <CalendarCheck size={18} />
              無料相談を予約する
              <ArrowRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto border-white/50 text-white/90 hover:bg-white/10"
            >
              まずは資料を見る
            </Button>
          </div>
          <p className="mt-5 text-white/60 text-sm">
            相談・資料請求は無料ですしつこい営業は行いません
          </p>
        </motion.div>
      </div>
    </section>
  );
}
