"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

export function ContactSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
    <section id="contact" className="section-py bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/50 to-transparent pointer-events-none" />
      
      <div className="container-lg max-w-5xl relative z-10">
        
        {/* Soft Messaging Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">Share Your Situation</span>
          <h2 className="section-heading mb-8">
            医院ごとに<span className="text-teal-600">課題は異なります</span>
          </h2>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-wrap justify-center gap-3 text-sm font-bold text-gray-500 mb-8">
              <span>予約導線</span>
              <span className="text-gray-300">/</span>
              <span>LINE運用</span>
              <span className="text-gray-300">/</span>
              <span>掘り起こし</span>
              <span className="text-gray-300">/</span>
              <span>採用</span>
              <span className="text-gray-300">/</span>
              <span>業務改善</span>
            </div>
            
            <p className="text-lg text-gray-600 leading-loose">
              現場によって状況はさまざまです。<br />
              今の状況を共有いただければ、<br className="md:hidden" />改善のヒントをお伝えします。
            </p>
            <p className="text-lg text-gray-600 leading-loose">
              お忙しい先生やご担当者様に合わせて、<br className="md:hidden" />ご都合の良い方法でお話をお伺いいたします。
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-teal-100">
              <div className="w-20 h-20 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ご共有ありがとうございます
              </h3>
              <p className="text-gray-600 leading-relaxed">
                内容を確認次第、担当者よりご連絡させていただきます。<br />
                今しばらくお待ちくださいませ。
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
              <div className="mb-8 text-center border-b border-gray-100 pb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">現在の状況をお聞かせください</h3>
                <p className="text-sm text-gray-500">※営業的な売り込みは行いませんのでご安心ください。</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Clinic Name */}
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="例）デンタルクリニック東京"
                    />
                  </div>

                  {/* Name */}
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="例）山田 太郎"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="例）info@example.com"
                    />
                  </div>

                  {/* Phone */}
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                      placeholder="例）03-0000-0000"
                    />
                  </div>
                </div>

                {/* Message */}
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-gray-50 focus:bg-white text-gray-900 resize-none"
                    placeholder="例）LINEを導入したものの、活用できていません。現在の予約フローに無駄が多いと感じているため、改善のヒントを頂きたいです。"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-8 text-base font-bold text-teal-700 bg-teal-50 border border-teal-100 rounded-xl shadow-sm hover:bg-teal-100 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "送信中..." : "今の状況を共有する"}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    ※ご共有いただいた内容は厳重に管理いたします。
                  </p>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
