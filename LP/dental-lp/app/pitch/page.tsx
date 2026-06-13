"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { 
  Slide1, Slide2, Slide3, Slide4, Slide5, 
  Slide6, Slide7, Slide8, Slide9, Slide10 
} from "@/components/pitch/slides";

const SLIDES = [
  Slide1, Slide2, Slide3, Slide4, Slide5, 
  Slide6, Slide7, Slide8, Slide9, Slide10
];

export default function PitchPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? prev : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? 0 : prev - 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const CurrentSlideComponent = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden text-gray-900 font-sans">
      {/* Top Bar for UX */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
          <X size={18} />
          <span className="text-sm font-bold">閉じる</span>
        </Link>
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-500 tracking-widest">
          {currentSlide + 1} / {SLIDES.length}
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[1280px] aspect-video bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <CurrentSlideComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-50">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 hover:text-teal-500 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-x-1 transition-all"
        >
          <ChevronLeft size={28} />
        </button>
        
        {/* Pagination Dots */}
        <div className="flex gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-teal-500" : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`スライド ${i + 1} へ`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === SLIDES.length - 1}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-400 hover:text-teal-500 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-1 transition-all"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
