"use client";

import Link from "next/link";

export function Footer() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container-lg py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-gray-800">
          {/* Brand */}
          <div>
            <div className="text-white font-bold text-lg mb-1">DentalConnect</div>
            <div className="text-teal-400 text-sm">歯科医院向け 運営改善パートナー</div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6" aria-label="フッターナビゲーション">
            <button
              onClick={() => handleNav("#contact")}
              className="text-sm hover:text-white transition-colors"
            >
              現状共有
            </button>
            <Link href="/privacy" className="text-sm hover:text-white transition-colors">
              プライバシーポリシー
            </Link>
          </nav>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <p>&copy; {new Date().getFullYear()} DentalConnect. All rights reserved.</p>
          <p>個人事業主による歯科医院運営改善サポート</p>
        </div>
      </div>
    </footer>
  );
}
