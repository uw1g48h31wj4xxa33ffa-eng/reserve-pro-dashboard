"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  name: string;
  clinic: string;
  email: string;
  phone: string;
  type: string;
  message: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    clinic: "",
    email: "",
    phone: "",
    type: "無料相談",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!form.name.trim()) newErrors.name = "お名前を入力してください";
    if (!form.clinic.trim()) newErrors.clinic = "医院名を入力してください";
    if (!form.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }
    if (!form.phone.trim()) newErrors.phone = "電話番号を入力してください";
    if (!form.message.trim()) newErrors.message = "相談内容を入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const update = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <section id="contact" className="section-pad bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge variant="turquoise" className="mb-4">お問い合わせ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            まずは、話だけでも。
            <br />
            <span className="gradient-text">無料相談受付中。</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            30分のオンライン相談で、貴院の課題と改善可能性をお伝えします。
            契約の強制は一切ありません。
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left side info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-2 space-y-6"
          >
            {[
              { title: "無料相談", desc: "30分オンライン。貴院の現状分析と改善提案をその場で実施します。" },
              { title: "デモ依頼", desc: "実際のシステムをお見せします。操作感や機能を確認いただけます。" },
              { title: "資料請求", desc: "サービス概要・料金・導入事例をまとめた資料をお送りします。" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full gradient-brand flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400 leading-relaxed">
                お問い合わせいただいた内容は、サービス改善および
                お客様対応のためにのみ使用します。第三者への提供は行いません。
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="md:col-span-3"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex p-4 rounded-full bg-turquoise-50 mb-5">
                    <CheckCircle size={32} className="text-turquoise-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    送信が完了しました
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    お問い合わせありがとうございます。
                  </p>
                  <p className="text-gray-500 text-sm">
                    担当者より1〜2営業日以内にご連絡いたします。
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", clinic: "", email: "", phone: "", type: "無料相談", message: "" }); }}
                    className="mt-6 text-sm text-turquoise-600 hover:underline inline-flex items-center gap-1"
                  >
                    別のお問い合わせをする <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="name"
                      label="お名前 *"
                      placeholder="山田 太郎"
                      value={form.name}
                      onChange={update("name")}
                      error={errors.name}
                    />
                    <Input
                      id="clinic"
                      label="医院名 *"
                      placeholder="〇〇歯科クリニック"
                      value={form.clinic}
                      onChange={update("clinic")}
                      error={errors.clinic}
                    />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    label="メールアドレス *"
                    placeholder="example@clinic.jp"
                    value={form.email}
                    onChange={update("email")}
                    error={errors.email}
                  />
                  <Input
                    id="phone"
                    type="tel"
                    label="電話番号 *"
                    placeholder="06-1234-5678"
                    value={form.phone}
                    onChange={update("phone")}
                    error={errors.phone}
                  />

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                      ご相談内容
                    </label>
                    <select
                      id="type"
                      value={form.type}
                      onChange={update("type")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-turquoise-400 focus:border-transparent transition-all"
                    >
                      {["無料相談", "デモ依頼", "資料請求", "その他"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <Textarea
                    id="message"
                    label="相談内容・ご質問 *"
                    placeholder="現在の課題や気になっていることをお気軽にご記入ください"
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    error={errors.message}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        送信する
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
