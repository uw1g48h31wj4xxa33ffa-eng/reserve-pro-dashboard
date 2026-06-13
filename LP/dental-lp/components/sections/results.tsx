"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown, Users, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatItemProps {
  label: string;
  before: number;
  after: number;
  unit: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down";
  color: "turquoise" | "sky" | "royal";
}

function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<number | null>(null);

  const animate = useCallback(() => {
    const start = performance.now();
    const update = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(update);
    };
    ref.current = requestAnimationFrame(update);
  }, [target, duration]);

  useEffect(() => {
    animate();
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [animate]);

  return <>{current}</>;
}

function StatCard({ label, before, after, unit, description, icon, trend, color }: StatItemProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const colorMap = {
    turquoise: {
      bg: "bg-turquoise-50",
      icon: "bg-turquoise-500",
      badge: "bg-turquoise-100 text-turquoise-700",
      border: "border-turquoise-100",
      arrowBg: "bg-turquoise-500",
    },
    sky: {
      bg: "bg-sky-50",
      icon: "bg-sky-500",
      badge: "bg-sky-100 text-sky-700",
      border: "border-sky-100",
      arrowBg: "bg-sky-500",
    },
    royal: {
      bg: "bg-royal-50",
      icon: "bg-royal-500",
      badge: "bg-royal-100 text-royal-700",
      border: "border-royal-100",
      arrowBg: "bg-royal-500",
    },
  };

  const c = colorMap[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white rounded-2xl border ${c.border} shadow-sm p-8 text-center card-hover`}
    >
      <div className={`inline-flex p-3 rounded-xl ${c.icon} text-white mb-5`}>
        {icon}
      </div>

      <div className="text-sm font-semibold text-gray-500 mb-5">{label}</div>

      <div className="flex items-center justify-center gap-4">
        {/* Before */}
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1 font-medium">導入前</div>
          <div className="text-3xl font-bold text-gray-400">
            {before}
            <span className="text-lg ml-0.5">{unit}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className={`flex flex-col items-center gap-1 px-2`}>
          <ArrowDown
            size={20}
            className={`${trend === "down" ? "text-turquoise-500" : "text-turquoise-500"} rotate-0`}
          />
        </div>

        {/* After */}
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1 font-medium">導入後</div>
          <div className="text-3xl font-bold gradient-text">
            {inView ? <AnimatedNumber target={after} /> : after}
            <span className="text-lg ml-0.5">{unit}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${c.badge}`}>
          {trend === "up" ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
          {description}
        </span>
      </div>
    </motion.div>
  );
}

export function ResultsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats: StatItemProps[] = [
    {
      label: "予約率",
      before: 30,
      after: 50,
      unit: "%",
      description: "+20pt 改善",
      icon: <TrendingUp size={22} />,
      trend: "up",
      color: "turquoise",
    },
    {
      label: "無断キャンセル（月平均）",
      before: 3,
      after: 1,
      unit: "件",
      description: "最大ゼロに",
      icon: <TrendingDown size={22} />,
      trend: "down",
      color: "sky",
    },
    {
      label: "掘り起こし件数（月平均）",
      before: 0,
      after: 13,
      unit: "件",
      description: "新規掘り起こし",
      icon: <Users size={22} />,
      trend: "up",
      color: "royal",
    },
  ];

  return (
    <section id="results" className="section-pad bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge variant="turquoise" className="mb-4">導入実績</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            数字が証明する、
            <br />
            <span className="gradient-text">確かな成果。</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            導入いただいた歯科医院での平均的な改善実績です。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-gray-400">
            ※ 上記は導入医院の平均値です。効果は医院の状況により異なります。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
