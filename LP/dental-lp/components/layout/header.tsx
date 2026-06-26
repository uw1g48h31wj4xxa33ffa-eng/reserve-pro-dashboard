"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/areas", label: "対応領域" },
  { href: "/results", label: "実績・運用例" },
  { href: "/philosophy", label: "大切にしていること" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // メニューが開いているときはbodyのスクロールを止める
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // 左上ロゴのクリック挙動
  const handleLogoClick = () => {
    setMenuOpen(false);
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  // 右上CTA「状況を聞かせてください」の挙動
  const handleCtaClick = () => {
    setMenuOpen(false);
    if (pathname === "/") {
      const el = document.querySelector("#contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#contact");
    }
  };

  // ナビリンクのクリック
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-transparent"
        )}
      >
        <div className="container-lg">
          <div className="flex items-center justify-between h-14 md:h-20 gap-4">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 md:gap-3 group shrink-0"
              aria-label="トップへ戻る"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 2.74 1.54 5.12 3.82 6.38L8 20h8l-.82-4.62C17.46 14.12 19 11.74 19 9c0-3.87-3.13-7-7-7z"
                    fill="white"
                    opacity="0.9"
                  />
                  <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.6" />
                </svg>
              </div>
              <div className="text-left flex flex-col justify-center">
                <div className="text-[10px] md:text-[11px] text-gray-500 font-bold mb-0.5">現場改善の窓口</div>
                <div
                  className={cn(
                    "font-bold leading-none transition-colors text-[clamp(12px,3vw,14px)]",
                    scrolled ? "text-gray-700" : "text-gray-700"
                  )}
                >
                  Dental Route
                </div>
              </div>
            </button>

            {/* PC ナビゲーション */}
            <nav className="hidden md:flex items-center gap-6 flex-1 justify-center" aria-label="メインナビゲーション">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-teal-600",
                    pathname === link.href ? "text-teal-600" : "text-gray-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 右側：CTA（常時表示） + スマホ用ハンバーガー */}
            <div className="flex items-center gap-2 shrink-0">
              {/* CTA：スマホでも常時表示 */}
              <button
                onClick={handleCtaClick}
                className="whitespace-nowrap py-2 font-bold text-white gradient-brand rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[clamp(10px,3vw,14px)] px-[clamp(10px,3.5vw,18px)]"
              >
                状況を聞かせてください
              </button>

              {/* スマホ用ハンバーガー */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
                aria-expanded={menuOpen}
              >
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 transition-all duration-300",
                    menuOpen && "rotate-45 translate-y-2"
                  )}
                />
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 transition-all duration-300",
                    menuOpen && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "w-5 h-0.5 bg-gray-700 transition-all duration-300",
                    menuOpen && "-rotate-45 -translate-y-2"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* スマホ用ドロワーメニュー */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        >
          {/* 半透明オーバーレイ */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      <nav
        className={cn(
          "fixed top-14 left-0 right-0 z-40 md:hidden bg-white shadow-lg border-b border-gray-100 transition-all duration-300 overflow-hidden",
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
        aria-label="スマホナビゲーション"
      >
        <div className="container-lg py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className={cn(
                "py-3 px-2 text-sm font-medium border-b border-gray-100 last:border-b-0 transition-colors",
                pathname === link.href ? "text-teal-600" : "text-gray-700 hover:text-teal-600"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/privacy"
            onClick={handleNavClick}
            className="py-3 px-2 text-sm text-gray-500 hover:text-teal-600 transition-colors"
          >
            プライバシーポリシー
          </Link>
        </div>
      </nav>
    </>
  );
}
