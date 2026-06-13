"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Tag, BarChart2, Target, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const patientTypes = [
  {
    type: "即予約型",
    description: "費用・日程の質問が少なく、来院意欲が高い。スピーディーな予約確定が重要。",
    action: "即日フォロー",
    color: "turquoise",
  },
  {
    type: "価格不安型",
    description: "費用に関する質問が多く、コスト比較をしている可能性が高い。料金の透明性訴求が有効。",
    action: "費用説明を送付",
    color: "sky",
  },
  {
    type: "検討中型",
    description: "複数のクリニックを比較している段階。差別化ポイントと社会的証明の提示が効果的。",
    action: "事例・実績を紹介",
    color: "royal",
  },
  {
    type: "日程調整型",
    description: "来院意欲はあるが予定が合わない状態。選択肢を広げる柔軟な予約提案が必要。",
    action: "複数日程を提示",
    color: "turquoise",
  },
];

const aiFeatures = [
  {
    icon: <Tag size={20} />,
    title: "患者タイプ自動分類",
    description: "LINEメッセージの内容からAIが患者を4タイプに分類。スタッフの判断をデータでサポート。",
  },
  {
    icon: <BarChart2 size={20} />,
    title: "予約率リアルタイム分析",
    description: "どの導線で予約につながっているかをリアルタイムで可視化。改善ポイントを即座に特定。",
  },
  {
    icon: <Target size={20} />,
    title: "掘り起こし優先順位付け",
    description: "「今アプローチすれば予約につながる確率が高い患者」をAIがランキング表示。",
  },
  {
    icon: <Lightbulb size={20} />,
    title: "改善提案の自動生成",
    description: "データを元にした具体的な改善施策をAIが毎月レポートとして提供。",
  },
];

const colorMap = {
  turquoise: "border-turquoise-200 bg-turquoise-50",
  sky: "border-sky-200 bg-sky-50",
  royal: "border-royal-200 bg-royal-50",
};

const tagColorMap = {
  turquoise: "bg-turquoise-500 text-white",
  sky: "bg-sky-500 text-white",
  royal: "bg-royal-500 text-white",
};

export function AiSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-pad bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge variant="turquoise" className="mb-4">
            <Brain size={13} />
            AI分析機能
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            患者の「温度感」を、
            <br />
            <span className="gradient-text">AIが見える化する。</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            感覚や経験に頼らず、データに基づいたアプローチで
            予約率を継続的に改善し続けます。
          </p>
        </motion.div>

        {/* Patient types */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-lg font-semibold text-gray-700 text-center mb-6">
            患者4タイプ分類と対応アクション
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {patientTypes.map((pt, i) => (
              <motion.div
                key={pt.type}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                className={`rounded-2xl border p-5 card-hover ${colorMap[pt.color as keyof typeof colorMap]}`}
              >
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-3 ${tagColorMap[pt.color as keyof typeof tagColorMap]}`}>
                  {pt.type}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{pt.description}</p>
                <div className="text-xs font-semibold text-gray-500">
                  推奨アクション：
                  <span className="text-gray-800 ml-1">{pt.action}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {aiFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 card-hover"
            >
              <div className="inline-flex p-2.5 rounded-xl bg-turquoise-50 text-turquoise-600 mb-4">
                {feature.icon}
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
