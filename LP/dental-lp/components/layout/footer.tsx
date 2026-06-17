"use client";

import Link from "next/link";

export function Footer() {
  const handleNav = (href: string) => {
    // Top page logic
    if (window.location.pathname === '/') {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = `/${href}`;
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container-lg py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-gray-800">
          {/* Brand */}
          <div>
            <div className="text-teal-400 font-bold text-[13px] md:text-sm mb-1">歯科医院向け 現場改善窓口</div>
            <div className="text-gray-300 text-[15px] md:text-base font-medium">Dental Route</div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6" aria-label="フッターナビゲーション">
            <button
              onClick={() => handleNav("#contact")}
              className="text-sm hover:text-white transition-colors"
            >
              状況を聞かせてください
            </button>
            <Link href="/privacy" className="text-sm hover:text-white transition-colors">
              プライバシーポリシー
            </Link>
          </nav>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <p>&copy; {new Date().getFullYear()} Dental Route. All rights reserved.</p>
            <p className="text-[10px] text-gray-600">※検証用ページです</p>
          </div>
          <p>現場を知る個人事業主としての運営改善</p>
        </div>
      </div>
    </footer>
  );
}
