"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    q: "導入にどのくらい時間がかかりますか？",
    a: "ご契約から最短2週間での稼働が可能です既存のLINE公式アカウントへの接続と初期設定をサポートスタッフが全面的にサポートします",
  },
  {
    q: "ITに詳しくないスタッフでも使えますか？",
    a: "はい直感的なUIで設計されており、初回の操作研修（オンライン30分）を受ければすぐに使い始めていただけます操作でわからないことはチャットサポートでいつでも対応します",
  },
  {
    q: "既存の予約システムと連携できますか？",
    a: "主要な歯科予約システムとのAPI連携に対応しています対応状況についてはお問い合わせの際にご確認ください",
  },
  {
    q: "患者の個人情報はどのように管理されますか？",
    a: "データはすべて国内サーバーで管理され、SSL通信・暗号化保存を徹底しています個人情報保護法に準拠した運用を行っています",
  },
  {
    q: "料金体系はどうなっていますか？",
    a: "月額固定制のサブスクリプション型ですクリニックの規模や必要機能に応じたプランをご用意しています詳細はお問い合わせください",
  },
  {
    q: "効果が出なかった場合はどうなりますか？",
    a: "導入後3ヶ月間は専任のカスタマーサクセスが月次で改善提案を行いますそれでも効果が出ない場合は、個別に状況を確認し対応策をご提案します",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="text-sm md:text-base font-medium text-gray-800 group-hover:text-turquoise-600 transition-colors">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180 text-turquoise-500" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-gray-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="section-pad bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="sky" className="mb-4">よくある質問</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            ご不明な点は<br />
            <span className="gradient-text">こちらで解決を</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6"
        >
          {faqs.map((faq) => (
            <FaqItem key={faq.q} {...faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
