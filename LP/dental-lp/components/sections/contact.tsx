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
    interests: [] as string[],
    otherInterest: "",
  });

  const interestOptions = [
    "予約導線",
    "LINE運用",
    "掘り起こし",
    "採用",
    "数値管理",
    "業務改善",
    "ホームページ",
    "SNS運用",
    "AI活用",
    "その他",
  ];

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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (option: string) => {
    setFormState((prev) => {
      const isSelected = prev.interests.includes(option);
      return {
        ...prev,
        interests: isSelected
          ? prev.interests.filter((item) => item !== option)
          : [...prev.interests, option],
      };
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
                  まずは内容を拝読しながら、<br />
                  状況を整理した上でご連絡いたします
                </p>
                <p>
                  少々お時間をいただく場合がございますが、<br />
                  順次確認しておりますので<br />
                  お待ちいただけますと幸いです
                </p>
                <div className="pt-8 text-xs text-gray-400 leading-relaxed border-t border-gray-100">
                  <p>
                    内容によっては、<br />
                    ご希望に添えない場合がございます
                  </p>
                  <p className="mt-2">あらかじめご了承ください</p>
                </div>
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

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="block text-sm font-bold text-gray-700">
                      気になる項目 <span className="text-gray-400 text-xs ml-1 font-normal">複数選択可</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestOptions.map((option) => (
                      <label
                        key={option}
                        onClick={() => handleCheckboxChange(option)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          formState.interests.includes(option)
                            ? "border-teal-400 bg-teal-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                            formState.interests.includes(option)
                              ? "bg-teal-500 border-teal-500"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {formState.interests.includes(option) && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            formState.interests.includes(option)
                              ? "text-teal-800 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formState.interests.includes("その他") && (
                    <div className="pt-2">
                      <input
                        type="text"
                        name="otherInterest"
                        placeholder="その他の内容をご記入ください"
                        value={formState.otherInterest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors bg-white text-gray-900 outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 text-center space-y-2">
                  <p className="text-xs text-red-400 font-bold">
                    患者様の個人情報などの記載はお控えください
                  </p>
                  <p className="text-xs text-gray-400">
                    いただいた内容は、内容確認およびご連絡のために利用いたします
                  </p>
                  <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-100 inline-block px-4">
                    内容によっては、ご希望に添えない場合がございます。<br />あらかじめご了承ください。
                  </p>
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
