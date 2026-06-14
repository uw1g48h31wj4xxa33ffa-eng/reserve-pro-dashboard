"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [formState, setFormState] = useState({
    clinicName: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden" ref={ref}>
      <div className="container-lg max-w-4xl relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 space-y-6"
        >
          <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
            何かを押し付けるのではなく、
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
            状況を整理しながら、
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed tracking-wide">
            より良い方向を考える
          </p>
          <p className="text-xl md:text-2xl font-bold text-teal-600 leading-relaxed tracking-wide pt-4">
            まずは状況を聞かせてください
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white rounded-[3rem] p-16 md:p-24 text-center shadow-[0_20px_60px_-15px_rgba(14,165,233,0.1)] border border-sky-50/50 mx-auto max-w-2xl"
            >
              <h3 className="text-xl md:text-2xl font-bold text-sky-900 mb-12 tracking-[0.2em]">
                ご共有ありがとうございます
              </h3>
              <div className="space-y-10 text-gray-600 leading-loose tracking-wide text-sm md:text-base">
                <p>いただいた内容を確認いたします</p>
                <p>
                  まずは内容を拝見しながら、<br />
                  状況を整理した上でご連絡いたします
                </p>
                <p>
                  少々お時間をいただく場合がございますが、<br />
                  順次確認しておりますので<br />
                  お待ちいただけますと幸いです
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
              <div className="mb-10 text-center">
                <h3 className="text-xl font-bold text-gray-900">現在の状況をお聞かせください</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="clinicName" className="block text-sm font-bold text-gray-700">
                      医院名 <span className="text-teal-600 text-xs ml-1">必須</span>
                    </label>
                    <input
                      type="text"
                      id="clinicName"
                      name="clinicName"
                      required
                      value={formState.clinicName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                      ご担当者様名 <span className="text-teal-600 text-xs ml-1">必須</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                      メールアドレス <span className="text-teal-600 text-xs ml-1">必須</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700">
                      電話番号 <span className="text-gray-400 text-xs ml-1">任意</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700">
                    現在のお悩み・課題 <span className="text-teal-600 text-xs ml-1">必須</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900 resize-none outline-none"
                  />
                </div>

                <div className="pt-2 text-center text-xs text-gray-500 mb-6">
                  いただいた内容は、<br className="md:hidden" />内容確認およびご連絡のために利用いたします
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-8 text-base font-bold text-white gradient-brand rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "送信中..." : "状況を共有する"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
