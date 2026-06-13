"use client";

import { motion } from "framer-motion";

export function Footer() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container-lg py-12">
        <div className="grid md:grid-cols-3 gap-8 pb-8 border-b border-gray-700">
          {/* Brand */}
          <div>
            <div className="text-white font-bold text-lg mb-1">DentalConnect</div>
            <div className="text-teal-400 text-sm mb-3">歯科医院向け 運営改善パートナー</div>
            <p className="text-sm leading-relaxed">
              歯科医院の運営課題を、<br />
              現場に寄り添った個人サポートで解決します。
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="text-white font-semibold text-sm mb-4">メニュー</div>
            <nav className="space-y-2" aria-label="フッターナビゲーション">
              {[
                { label: "サービス内容", href: "#services" },
                { label: "実績", href: "#results" },
                { label: "サポートイメージ", href: "#flow" },
                { label: "お問い合わせ", href: "#contact" },
              ].map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="block text-sm hover:text-teal-400 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div>
            <div className="text-white font-semibold text-sm mb-4">まずはお気軽にご相談を</div>
            <p className="text-sm mb-4 leading-relaxed">
              貴院の課題やお悩みをお聞かせください。<br />
              オンラインで無料ご相談を承っています。
            </p>
            <button
              onClick={() => handleNav("#contact")}
              className="px-5 py-2.5 text-sm font-bold text-white rounded-full gradient-brand shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              無料相談する →
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
          <p>&copy; {new Date().getFullYear()} DentalConnect. All rights reserved.</p>
          <p className="text-xs">個人事業主による歯科医院運営改善サポート</p>
        </div>
      </div>
    </footer>
  );
}
