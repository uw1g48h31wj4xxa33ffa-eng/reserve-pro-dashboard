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
            より良い方向を考える。
          </p>
          <p className="text-xl md:text-2xl font-bold text-teal-600 leading-relaxed tracking-wide pt-4">
            まずは状況を聞かせてください。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-8">
                ✓
              </div>
              <div className="space-y-6 text-gray-700 leading-loose">
                <p>ご共有ありがとうございます。</p>
                <p>いただいた内容を確認し、<br />改めてご連絡いたします。</p>
                <p>まずは現状を理解した上で<br />お話をお伺いしたいと考えております。</p>
                <p>順次確認しておりますので、<br />少々お待ちいただけますと幸いです。</p>
              </div>
            </div>
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

                <div className="pt-6">
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
