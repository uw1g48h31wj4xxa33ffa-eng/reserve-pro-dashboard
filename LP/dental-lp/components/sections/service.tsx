"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, CalendarCheck, Users, Repeat2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    icon: <MessageCircle size={24} />,
    title: "LINE予約導線の最適化",
    description:
      "問い合わせからLINEでのやり取りを自動化。患者の温度感に合わせた返信テンプレートで、迷わず予約に進める導線を設計します。",
    tags: ["自動返信", "シナリオ設計", "CTA最適化"],
    color: "turquoise",
  },
  {
    icon: <CalendarCheck size={24} />,
    title: "予約確定率の引き上げ",
    description:
      "「とりあえず聞いてみた」段階の患者を逃さない。AI分析で患者タイプを特定し、最適なタイミングでの声がけを自動化します。",
    tags: ["患者分類AI", "タイミング最適化", "自動フォロー"],
    color: "sky",
  },
  {
    icon: <Users size={24} />,
    title: "掘り起こし自動化",
    description:
      "過去に問い合わせたけど予約しなかった患者へのアプローチを自動化。月平均13件の掘り起こしを実現します。",
    tags: ["休眠患者管理", "リマインド自動化", "優先順位付け"],
    color: "royal",
  },
  {
    icon: <Repeat2 size={24} />,
    title: "無断キャンセル対策",
    description:
      "予約前後の自動リマインドと、キャンセル後の再予約フローで無断キャンセルを大幅削減。月平均3件→0〜1件を実現します。",
    tags: ["事前リマインド", "再予約促進", "キャンセル分析"],
    color: "turquoise",
  },
];

const colorMap = {
  turquoise: {
    icon: "bg-turquoise-50 text-turquoise-600",
    tag: "bg-turquoise-50 text-turquoise-700",
    border: "hover:border-turquoise-200",
  },
  sky: {
    icon: "bg-sky-50 text-sky-600",
    tag: "bg-sky-50 text-sky-700",
    border: "hover:border-sky-200",
  },
  royal: {
    icon: "bg-royal-50 text-royal-600",
    tag: "bg-royal-50 text-royal-700",
    border: "hover:border-royal-200",
  },
};

export function ServiceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="service" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge variant="sky" className="mb-4">サービス紹介</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            「予約できなかった患者」を
            <br />
            <span className="gradient-text">ゼロに近づける4つの仕組み。</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            システムを導入するのが目的ではありません。
            予約率を上げることが目的です。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const c = colorMap[service.color as keyof typeof colorMap];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`bg-white rounded-2xl border border-gray-100 p-7 card-hover group transition-all duration-300 ${c.border}`}
              >
                <div className={`inline-flex p-3 rounded-xl ${c.icon} mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.tag}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 text-turquoise-600 font-semibold hover:text-turquoise-700 transition-colors"
          >
            サービスについて詳しく聞く
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
