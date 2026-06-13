"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "運営課題", href: "#problems" },
  { label: "実績", href: "#results" },
  { label: "支援内容", href: "#services" },
  { label: "改善フロー", href: "#flow" },
  { label: "お問い合わせ", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="container-lg">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 group"
            aria-label="トップへ戻る"
          >
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 2.74 1.54 5.12 3.82 6.38L8 20h8l-.82-4.62C17.46 14.12 19 11.74 19 9c0-3.87-3.13-7-7-7z"
                  fill="white"
                  opacity="0.9"
                />
                <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.6" />
              </svg>
            </div>
            <div className="text-left">
              <div
                className={cn(
                  "text-base font-bold leading-none transition-colors",
                  scrolled ? "text-gray-900" : "text-gray-900"
                )}
              >
                DentalConnect
              </div>
              <div className="text-xs text-teal-600 font-medium mt-0.5">
                歯科医院向け 運営改善パートナー
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="メインナビゲーション">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 rounded-lg hover:bg-teal-50 transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => handleNav("#contact")}
              className="hidden md:block px-5 py-2 text-sm font-bold text-white rounded-full gradient-brand shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              今の状況を共有する
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="container-lg py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3">
                <button
                  onClick={() => handleNav("#contact")}
                  className="w-full py-3 text-sm font-bold text-white rounded-full gradient-brand shadow-md"
                >
                  無料相談する
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
