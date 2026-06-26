"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleContactNav = () => {
    if (pathname === "/") {
      const el = document.querySelector("#contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#contact");
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container-lg py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8 border-b border-gray-800">
          {/* Brand */}
          <div className="shrink-0">
            <div className="text-teal-400 font-bold text-[13px] md:text-sm mb-1">歯科医院向け 現場改善窓口</div>
            <div className="text-gray-300 text-[15px] md:text-base font-medium">Dental Route</div>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* サービスナビ */}
            <nav className="flex flex-col gap-2.5" aria-label="サービスナビゲーション">
              <Link href="/areas" className="text-sm hover:text-white transition-colors">
                対応領域
              </Link>
              <Link href="/results" className="text-sm hover:text-white transition-colors">
                実績・運用例
              </Link>
              <Link href="/philosophy" className="text-sm hover:text-white transition-colors">
                大切にしていること
              </Link>
            </nav>

            {/* その他 */}
            <nav className="flex flex-col gap-2.5" aria-label="その他ナビゲーション">
              <button
                onClick={handleContactNav}
                className="text-sm hover:text-white transition-colors text-left"
              >
                状況を聞かせてください
              </button>
              <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                プライバシーポリシー
              </Link>
            </nav>
          </div>
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
