"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    if (window.location.pathname === '/') {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = `/${href}`;
    }
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
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 md:gap-3 group"
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

          {/* CTA */}
          <div>
            <button
              onClick={() => handleNav("#contact")}
              className="whitespace-nowrap py-2 font-bold text-white gradient-brand rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[clamp(10px,3vw,14px)] px-[clamp(12px,4vw,20px)]"
            >
              状況を聞かせてください
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
