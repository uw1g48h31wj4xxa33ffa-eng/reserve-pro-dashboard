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
            </div>
          </button>

          {/* CTA */}
          <div>
            <button
              onClick={() => handleNav("#contact")}
              className="px-5 py-2 text-sm font-bold text-white gradient-brand rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              状況を聞かせてください
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
