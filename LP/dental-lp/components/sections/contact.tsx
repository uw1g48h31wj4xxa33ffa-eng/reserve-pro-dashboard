"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface FormData {
  clinicName: string;
  personName: string;
  email: string;
  phone: string;
  message: string;
}

const initialForm: FormData = {
  clinicName: "",
  personName: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.clinicName.trim()) newErrors.clinicName = "医院名を入力してください";
    if (!form.personName.trim()) newErrors.personName = "担当者名を入力してください";
    if (!form.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }
    if (!form.message.trim()) newErrors.message = "相談内容を入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // TODO: Replace with Firebase / Resend / Formspree integration
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
      errors[field]
        ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    }`;

  return (
    <section id="contact" className="section-py" ref={ref}>
      <div className="container-md">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-eyebrow">Free Consultation</span>
          <h2 className="section-heading mb-6">
            無料<span className="text-teal-600">Zoom相談</span><br className="md:hidden" />受付中
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            現在の運用状況をヒアリングし、具体的な改善ポイントをご提案いたします。
          </p>
          <p className="text-gray-500 font-bold">
            ※無理な営業は一切行いませんので、まずはお気軽にご相談ください。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── 送信完了 ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-20 px-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="text-teal-500" size={40} />
                </motion.div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  お問い合わせありがとうございます！
                </h3>
                <p className="text-gray-500 leading-relaxed mb-8">
                  内容を確認のうえ、2営業日以内にメールまたはお電話にてご連絡いたします。
                  <br />
                  しばらくお待ちください。
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialForm); }}
                  className="text-sm text-teal-600 underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  別の内容で問い合わせる
                </button>
              </motion.div>
            ) : (
              /* ── フォーム ── */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                className="p-8 md:p-12 space-y-6"
              >
                {/* Row 1 */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      医院名 <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="clinicName"
                      type="text"
                      placeholder="例）サクラ歯科医院"
                      value={form.clinicName}
                      onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                      className={inputClass("clinicName")}
                    />
                    {errors.clinicName && (
                      <p className="text-xs text-red-500 mt-1">{errors.clinicName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      担当者名 <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="personName"
                      type="text"
                      placeholder="例）田中 院長"
                      value={form.personName}
                      onChange={(e) => setForm({ ...form, personName: e.target.value })}
                      className={inputClass("personName")}
                    />
                    {errors.personName && (
                      <p className="text-xs text-red-500 mt-1">{errors.personName}</p>
                    )}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      メールアドレス <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="例）info@clinic.jp"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      電話番号
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="例）03-1234-5678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass("phone")}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    相談内容 <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="現在お困りのことや、改善したいことをご自由にお書きください。"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass("message")} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-8 text-base font-bold text-white rounded-xl gradient-brand shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "送信中..." : "無料相談（Zoom）を申し込む"}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    ご入力いただいた情報は、お問い合わせへの返答のみに使用します。
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
