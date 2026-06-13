"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const textAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const containerAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// Mask component for privacy
const PrivacyMask = ({ className }: { className?: string }) => (
  <div className={`absolute backdrop-blur-md bg-white/60 border border-white/40 shadow-sm rounded-md ${className}`} />
);

// ==========================================
// Slide 1: Hero
// ==========================================
export function Slide1() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-12 bg-white">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-teal-50 to-sky-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-sky-50 to-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <motion.div variants={containerAnim} initial="hidden" animate="show" className="z-10 text-center max-w-4xl">
        <motion.div variants={textAnim} className="mb-8">
          <span className="inline-block px-5 py-2 text-sm font-bold tracking-widest text-teal-600 bg-teal-50 border border-teal-100 rounded-full uppercase">
            運営改善パートナー
          </span>
        </motion.div>
        
        <motion.h1 variants={textAnim} className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.3] mb-10 tracking-tight">
          歯科医院の運営課題を<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-sky-600">現場目線で改善する</span>
        </motion.h1>
        
        <motion.div variants={textAnim} className="flex flex-wrap justify-center gap-4 text-lg font-bold text-gray-500 mb-12">
          {["予約", "LINE運用", "掘り起こし", "採用", "業務改善"].map((tag, i) => (
            <div key={i} className="flex items-center gap-4">
              {i > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
              <span>{tag}</span>
            </div>
          ))}
        </motion.div>
        
        <motion.p variants={textAnim} className="text-2xl text-gray-600 leading-relaxed font-medium">
          医院ごとに合わせた<br />
          仕組みづくりをサポートします
        </motion.p>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 2: Problems
// ==========================================
export function Slide2() {
  const problems = [
    "問い合わせは来るが予約にならない",
    "無断キャンセルが多い",
    "LINEを活用できていない",
    "掘り起こしできていない",
    "数字管理が属人化している",
    "採用に時間を取られている",
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-white relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-5xl mx-auto w-full">
        <motion.div variants={textAnim} className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            こんな<span className="text-teal-600">お悩み</span>はありませんか？
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {problems.map((prob, i) => (
            <motion.div 
              key={i} 
              variants={textAnim}
              className="flex items-center gap-6 bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 text-2xl">
                ✓
              </div>
              <p className="text-xl font-bold text-gray-800">{prob}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 3: Insight (Funnel)
// ==========================================
export function Slide3() {
  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-white relative overflow-hidden">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="z-10 text-center w-full max-w-5xl mx-auto">
        <motion.h2 variants={textAnim} className="text-4xl md:text-5xl font-black mb-16 leading-tight text-gray-900">
          実は <span className="text-gray-400 line-through decoration-red-500 decoration-4">問い合わせ不足</span> ではなく<br/>
          <span className="text-teal-600 text-6xl">「予約化率」</span> が課題かもしれません
        </motion.h2>

        <div className="flex justify-between items-center max-w-4xl mx-auto relative mt-24">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10" />
          
          {[
            { step: "問い合わせ", loss: "30%離脱" },
            { step: "予約", loss: "20%キャンセル" },
            { step: "来院", loss: "未継続" },
            { step: "契約", loss: "" }
          ].map((item, i, arr) => (
            <motion.div key={i} variants={textAnim} className="relative flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-xl font-bold border-4 shadow-xl bg-white ${i === 1 ? 'border-teal-500 text-teal-600 scale-110 shadow-teal-500/20' : 'border-gray-200 text-gray-600'}`}>
                {item.step}
              </div>
              {item.loss && (
                <div className="absolute -bottom-16 whitespace-nowrap text-red-500 font-bold bg-red-50 px-4 py-2 rounded-full border border-red-100">
                  ↓ {item.loss}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.p variants={textAnim} className="mt-32 text-xl text-gray-500 font-bold">
          この途中で取りこぼしている可能性があります
        </motion.p>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 4: Results (Evidence Images)
// ==========================================
export function Slide4() {
  const results = [
    { label: "予約確定率", before: "30%", after: "50%" },
    { label: "無断キャンセル", before: "月平均3件", after: "0〜1件" },
    { label: "掘り起こし", before: "月0件", after: "平均10件" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center p-12 md:p-16 bg-gray-50 relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-6xl mx-auto w-full">
        
        <div className="flex gap-12 items-center">
          {/* Numbers Side */}
          <div className="w-1/3">
            <motion.div variants={textAnim} className="mb-12">
              <h2 className="text-4xl font-black text-gray-900">実績</h2>
              <p className="text-gray-500 mt-2 text-sm font-bold">実際の集計画面をもとに、継続管理しています</p>
            </motion.div>

            <div className="space-y-8">
              {results.map((res, i) => (
                <motion.div key={i} variants={textAnim} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                  <h3 className="text-lg font-bold text-gray-600 mb-2">{res.label}</h3>
                  <div className="flex items-end gap-3">
                    <div className="text-xl text-gray-400 font-medium line-through mb-1">{res.before}</div>
                    <div className="text-xl text-teal-400 font-bold mb-1">→</div>
                    <div className="text-4xl font-black text-gray-900 tracking-tighter">{res.after}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Evidence Images Side */}
          <div className="w-2/3 grid grid-cols-2 gap-6">
            <motion.div variants={textAnim} className="space-y-2">
              <div className="text-sm font-bold text-gray-500 bg-white inline-block px-3 py-1 rounded-full border">A医院の改善実績</div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                <Image src="/uploads/result-a-before.jpg" alt="A医院改善前" fill className="object-cover" />
                <PrivacyMask className="top-2 left-2 w-32 h-6" /> {/* Name Mask */}
                <PrivacyMask className="top-12 left-2 w-24 h-48" /> {/* Patient List Mask */}
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">改善前</div>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-teal-200 bg-white">
                <Image src="/uploads/result-a-after.jpg" alt="A医院改善後" fill className="object-cover" />
                <PrivacyMask className="top-2 left-2 w-32 h-6" />
                <PrivacyMask className="top-12 left-2 w-24 h-48" />
                <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded font-bold">改善後</div>
              </div>
            </motion.div>

            <motion.div variants={textAnim} className="space-y-2">
              <div className="text-sm font-bold text-gray-500 bg-white inline-block px-3 py-1 rounded-full border">B医院の改善実績</div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                <Image src="/uploads/result-b-before.jpg" alt="B医院改善前" fill className="object-cover" />
                <PrivacyMask className="top-2 left-2 w-32 h-6" />
                <PrivacyMask className="top-12 left-2 w-24 h-48" />
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">改善前</div>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-teal-200 bg-white">
                <Image src="/uploads/result-b-after.jpg" alt="B医院改善後" fill className="object-cover" />
                <PrivacyMask className="top-2 left-2 w-32 h-6" />
                <PrivacyMask className="top-12 left-2 w-24 h-48" />
                <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded font-bold">改善後</div>
              </div>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 5: LINE Flow (Evidence)
// ==========================================
export function Slide5() {
  return (
    <div className="w-full h-full flex items-center p-16 md:p-24 bg-white relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        <div>
          <motion.h2 variants={textAnim} className="text-5xl font-black text-gray-900 leading-tight mb-8">
            患者が迷わず進める<br/>
            LINE導線を設計
          </motion.h2>
          <motion.p variants={textAnim} className="text-xl text-gray-600 leading-relaxed mb-12">
            Q&A形式で患者の希望や不安を整理し、<br/>
            最適な矯正メニューや予約導線へつなげます。
          </motion.p>
        </div>

        <div className="relative h-[60vh] flex justify-center">
          <motion.div variants={textAnim} className="relative w-full max-w-sm h-full rounded-[2.5rem] shadow-2xl border-4 border-gray-100 overflow-hidden bg-white">
            <Image src="/uploads/line-flow.jpg" alt="LINE診断フロー" fill className="object-cover object-top" />
            {/* Mask personal icon or top header if needed */}
            <PrivacyMask className="top-2 left-16 w-32 h-6" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 6: LINE Campaigns (Evidence)
// ==========================================
export function Slide6() {
  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-gray-50 relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-6xl mx-auto w-full">
        <motion.div variants={textAnim} className="mb-16 text-center">
          <h2 className="text-5xl font-black text-gray-900 mb-6">
            配信して終わりではなく<br/>
            反応率を見ながら改善
          </h2>
          <p className="text-xl text-gray-600">
            患者心理に合わせた画像・文面を作成し、休眠顧客の掘り起こしや予約化を支援します。
          </p>
        </motion.div>

        <div className="flex justify-center gap-8 h-[50vh]">
          {["/uploads/line-campaign.jpg", "/uploads/line-followup.jpg"].map((src, i) => (
            <motion.div key={i} variants={textAnim} className="relative w-full max-w-sm h-full rounded-3xl shadow-xl border border-gray-200 overflow-hidden bg-white">
               <Image src={src} alt="LINE配信画像" fill className="object-cover object-top" />
               <PrivacyMask className="top-2 left-16 w-32 h-6" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 7: App screens (Evidence)
// ==========================================
export function Slide7() {
  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-white relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-6xl mx-auto w-full text-center">
        <motion.div variants={textAnim} className="mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-6">
            予約申請・顧客情報を<br/>管理しやすい形へ
          </h2>
          <p className="text-xl text-gray-600">
            予約状況、顧客情報、ブロック設定を整理し、現場の対応漏れや確認負担を減らします。
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 h-[40vh]">
          {["/uploads/app-1.jpg", "/uploads/app-2.jpg", "/uploads/app-3.jpg"].map((src, i) => (
            <motion.div key={i} variants={textAnim} className="relative w-1/3 h-full rounded-2xl shadow-lg border border-gray-200 overflow-hidden bg-gray-50">
               <Image src={src} alt="予約管理アプリ画面" fill className="object-contain" />
               {/* Mask specific data areas */}
               <PrivacyMask className="top-[10%] left-[10%] w-[80%] h-[80%] opacity-0 hover:opacity-100 transition-opacity" /> 
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 8: Services List
// ==========================================
export function Slide8() {
  const services = [
    { icon: "📅", title: "予約導線改善" },
    { icon: "💬", title: "LINE運用改善" },
    { icon: "📝", title: "予約フォーム構築" },
    { icon: "🔄", title: "掘り起こし支援" },
    { icon: "📊", title: "数値管理" },
    { icon: "👩‍⚕️", title: "採用支援" },
    { icon: "⚙️", title: "業務改善" },
    { icon: "💡", title: "改善提案" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-gray-50 relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-5xl mx-auto w-full">
        <motion.div variants={textAnim} className="mb-16 text-center">
          <h2 className="text-5xl font-black text-gray-900">支援内容</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              variants={textAnim}
              className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-lg font-bold text-gray-800">{s.title}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 9: Pricing
// ==========================================
export function Slide9() {
  const plans = [
    { name: "導入支援プラン", init: "198,000", monthly: "29,800" },
    { name: "運営改善プラン", init: "298,000", monthly: "49,800" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-white relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-5xl mx-auto w-full">
        <motion.div variants={textAnim} className="mb-16 text-center">
          <h2 className="text-5xl font-black text-gray-900">料金プラン</h2>
          <p className="text-gray-500 mt-4 font-bold">医院ごとの課題・業務範囲に応じてご提案します</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          {plans.map((plan, i) => (
            <motion.div key={i} variants={textAnim} className="bg-gray-50 rounded-[2rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
              <h3 className="text-2xl font-black text-gray-900 mb-8 text-center">{plan.name}</h3>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <p className="text-sm text-gray-500 font-bold">初期</p>
                  <p className="text-3xl font-black text-gray-900">{plan.init}<span className="text-lg text-gray-500 font-bold ml-1">円〜</span></p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-teal-100 flex justify-between items-center shadow-sm">
                  <p className="text-sm text-teal-600 font-bold">月額</p>
                  <p className="text-3xl font-black text-teal-600">{plan.monthly}<span className="text-lg text-teal-600 font-bold ml-1">円〜</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={textAnim} className="bg-sky-50 rounded-2xl p-6 border border-sky-100 text-center">
          <span className="text-xl font-bold text-sky-900">
            伴走支援プラン：<span className="text-sky-700 ml-2">個別見積</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 10: Contact
// ==========================================
export function Slide10() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-16 md:p-24 bg-gray-50 relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-4xl mx-auto w-full text-center">
        
        <motion.h2 variants={textAnim} className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
          無料相談受付中
        </motion.h2>
        
        <motion.p variants={textAnim} className="text-xl text-gray-600 leading-relaxed font-medium mb-16">
          現在の運用状況をヒアリングし、<br/>
          改善ポイントをご提案いたします。<br/>
          まずはお気軽にご相談ください。
        </motion.p>
        
        <motion.div variants={textAnim} className="flex justify-center gap-12 mb-16">
          {[
            { icon: "🔍", label: "現状分析" },
            { icon: "💡", label: "改善提案" },
            { icon: "📄", label: "お見積り" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border border-gray-200">
                {item.icon}
              </div>
              <span className="font-bold text-gray-700">{item.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={textAnim} className="text-gray-400 font-bold tracking-widest text-sm uppercase">
          歯科医院向け運営改善パートナー
        </motion.div>
      </motion.div>
    </div>
  );
}
