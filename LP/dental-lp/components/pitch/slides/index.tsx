"use client";

import { motion } from "framer-motion";

const textAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const containerAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ==========================================
// Slide 1: Hero
// ==========================================
export function Slide1() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-12 bg-white">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-teal-50 to-sky-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-sky-50 to-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4" />

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
          最適な仕組みづくりをサポートします
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
    "休眠患者の掘り起こしできていない",
    "数字の管理が属人化している",
    "スタッフ採用に時間を取られている",
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
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-3xl" />

      <motion.div variants={containerAnim} initial="hidden" animate="show" className="z-10 text-center w-full max-w-5xl mx-auto">
        <motion.h2 variants={textAnim} className="text-4xl md:text-5xl font-black mb-16 leading-tight">
          実は <span className="text-gray-400 line-through decoration-red-500 decoration-4">問い合わせ不足</span> ではなく<br/>
          <span className="text-teal-400 text-6xl">「予約化率」</span> が課題かもしれません
        </motion.h2>

        <div className="flex justify-between items-center max-w-4xl mx-auto relative mt-24">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2 -z-10" />
          
          {[
            { step: "問い合わせ", loss: "30%離脱" },
            { step: "予約", loss: "20%キャンセル" },
            { step: "来院", loss: "未継続" },
            { step: "契約", loss: "" }
          ].map((item, i, arr) => (
            <motion.div key={i} variants={textAnim} className="relative flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-xl font-bold border-4 shadow-2xl ${i === 1 ? 'bg-teal-500 border-teal-400 text-white scale-110' : 'bg-gray-800 border-gray-600 text-gray-300'}`}>
                {item.step}
              </div>
              {item.loss && (
                <div className="absolute -bottom-16 whitespace-nowrap text-red-400 font-bold bg-red-900/30 px-4 py-2 rounded-full border border-red-800/50">
                  ↓ {item.loss}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.p variants={textAnim} className="mt-32 text-xl text-gray-300 font-medium">
          せっかくの問い合わせを、途中で取りこぼしていませんか？
        </motion.p>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 4: Results
// ==========================================
export function Slide4() {
  const results = [
    { label: "予約確定率", before: "30%", after: "50%", prefix: "" },
    { label: "無断キャンセル", before: "月3件", after: "0〜1件", prefix: "" },
    { label: "休眠掘り起こし", before: "0件", after: "13件", prefix: "平均" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-white relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-6xl mx-auto w-full">
        <motion.div variants={textAnim} className="mb-20 text-center">
          <span className="text-teal-600 font-bold tracking-widest uppercase mb-4 block">Proven Results</span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900">
            圧倒的な<span className="text-teal-600">改善実績</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {results.map((res, i) => (
            <motion.div 
              key={i} 
              variants={textAnim}
              className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-sky-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <h3 className="text-2xl font-bold text-gray-800 mb-8">{res.label}</h3>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl text-gray-400 font-medium line-through mb-4">
                  {res.before}
                </div>
                <div className="text-4xl text-teal-300 mb-4">↓</div>
                <div className="text-7xl font-black text-gray-900 tracking-tighter">
                  <span className="text-3xl text-gray-500 font-bold mr-2">{res.prefix}</span>
                  {res.after}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 5: Why us (Experience)
// ==========================================
export function Slide5() {
  const experiences = [
    "LINE運用", "予約導線改善", "患者対応", "休眠掘り起こし", "数値集計", "歯科医師採用", "歯科衛生士採用"
  ];

  return (
    <div className="w-full h-full flex items-center p-16 md:p-24 bg-gray-50">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-20 items-center">
        <div>
          <motion.h2 variants={textAnim} className="text-5xl font-black text-gray-900 leading-tight mb-8">
            なぜこれほどの<br/>
            改善が可能なのか？
          </motion.h2>
          <motion.p variants={textAnim} className="text-2xl text-gray-600 leading-relaxed mb-12">
            システムを提供するだけではなく、<br/>
            <strong className="text-teal-600 font-black">現場のリアルな課題</strong>に直接触れてきた<br/>
            経験があるからです。
          </motion.p>
          <motion.div variants={textAnim} className="inline-block px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-teal-600/30">
            圧倒的な現場理解
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl transform rotate-3" />
          <motion.div variants={textAnim} className="relative bg-white rounded-3xl shadow-sm border border-gray-100 p-12">
            <h3 className="text-xl font-bold text-gray-400 mb-8 uppercase tracking-widest">実務経験領域</h3>
            <div className="flex flex-wrap gap-4">
              {experiences.map((exp, i) => (
                <span key={i} className="px-6 py-3 bg-sky-50 text-sky-800 font-bold rounded-full text-lg border border-sky-100">
                  {exp}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 6: Services
// ==========================================
export function Slide6() {
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
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-white relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-6xl mx-auto w-full">
        <motion.div variants={textAnim} className="mb-20 text-center">
          <span className="text-teal-600 font-bold tracking-widest uppercase mb-4 block">Our Services</span>
          <h2 className="text-5xl font-black text-gray-900">
            医院ごとに合わせた<span className="text-teal-600">支援内容</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              variants={textAnim}
              className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-5xl mb-6">{s.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{s.title}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 7: Flow
// ==========================================
export function Slide7() {
  const steps = ["問い合わせ", "予約フォーム", "LINE", "予約確定", "来院", "掘り起こし", "再来院"];
  
  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/40 via-gray-900 to-gray-900" />
      
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="z-10 max-w-6xl mx-auto w-full text-center">
        <motion.h2 variants={textAnim} className="text-5xl font-black mb-24">
          理想的な<span className="text-teal-400">改善イメージ</span>
        </motion.h2>

        <div className="flex flex-wrap justify-center items-center gap-4 relative">
          {steps.map((step, i) => (
            <motion.div key={i} variants={textAnim} className="flex items-center">
              <div className="bg-gray-800 border border-gray-700 px-8 py-5 rounded-2xl font-bold text-xl shadow-xl">
                {step}
              </div>
              {i < steps.length - 1 && (
                <div className="mx-4 text-teal-400 font-black text-2xl">→</div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={textAnim} className="mt-24 inline-block p-1 rounded-full bg-gradient-to-r from-teal-500 to-sky-500">
          <div className="bg-gray-900 px-10 py-4 rounded-full">
            <span className="text-2xl font-bold text-white">点と点を繋ぎ、強固な仕組みを作る</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ==========================================
// Slide 8: Future
// ==========================================
export function Slide8() {
  const items = ["患者分析", "予約率分析", "LINE分析", "掘り起こし分析", "改善提案", "医院独自データ蓄積"];
  
  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-white relative overflow-hidden">
      {/* High-tech background subtle elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00b4d8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div variants={containerAnim} initial="hidden" animate="show" className="z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2">
            <motion.span variants={textAnim} className="text-sky-500 font-bold tracking-widest uppercase mb-4 block">Next Vision</motion.span>
            <motion.h2 variants={textAnim} className="text-5xl font-black text-gray-900 leading-tight mb-8">
              今後の構想<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                AI活用によるデータドリブンな運営へ
              </span>
            </motion.h2>
            <motion.p variants={textAnim} className="text-xl text-gray-500 leading-relaxed mb-8">
              日々の運用で蓄積されるデータをAIで分析し、より精度が高く、属人化しない改善提案を自動化していく仕組みを構想しています。
            </motion.p>
          </div>

          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {items.map((item, i) => (
                <motion.div key={i} variants={textAnim} className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-6 rounded-3xl shadow-sm flex items-center justify-center text-center backdrop-blur-sm">
                  <span className="font-bold text-sky-900 text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
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
    { name: "導入支援", init: "198,000", monthly: "29,800" },
    { name: "運営改善", init: "298,000", monthly: "49,800" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center p-16 md:p-24 bg-gray-50 relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-5xl mx-auto w-full">
        <motion.div variants={textAnim} className="mb-20 text-center">
          <h2 className="text-5xl font-black text-gray-900">
            料金体系
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {plans.map((plan, i) => (
            <motion.div key={i} variants={textAnim} className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-xl relative overflow-hidden">
              {i === 1 && <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 to-sky-400" />}
              <h3 className="text-3xl font-black text-gray-900 mb-10 text-center">{plan.name}</h3>
              
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-gray-500 font-bold mb-1">初期費用</p>
                  <p className="text-4xl font-black text-gray-900">{plan.init}<span className="text-xl text-gray-500 font-bold ml-1">円〜</span></p>
                </div>
                <div className="h-px w-full bg-gray-100" />
                <div>
                  <p className="text-sm text-gray-500 font-bold mb-1">月額費用</p>
                  <p className="text-4xl font-black text-teal-600">{plan.monthly}<span className="text-xl text-gray-500 font-bold ml-1">円〜</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={textAnim} className="bg-white rounded-2xl p-6 border border-gray-200 text-center shadow-sm">
          <span className="text-xl font-bold text-gray-700">
            伴走支援：<span className="text-teal-600 ml-2">個別お見積り</span>
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
    <div className="w-full h-full flex flex-col justify-center items-center p-16 md:p-24 bg-white relative">
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="max-w-4xl mx-auto w-full text-center">
        
        <motion.div variants={textAnim} className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-400 to-sky-500 rounded-3xl flex items-center justify-center shadow-xl shadow-teal-500/20 mb-12">
          <span className="text-white text-4xl">🤝</span>
        </motion.div>

        <motion.h2 variants={textAnim} className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-10">
          無料相談受付中
        </motion.h2>
        
        <motion.p variants={textAnim} className="text-2xl text-gray-600 leading-relaxed font-medium mb-16">
          現在の運用状況をヒアリングし<br/>
          貴院に最適な改善ポイントをご提案いたします。
        </motion.p>
        
        <motion.div variants={textAnim}>
          <button className="px-12 py-6 text-2xl font-bold text-white rounded-full bg-gradient-to-r from-teal-500 to-sky-500 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            まずはお気軽にご相談ください
          </button>
        </motion.div>

        <motion.div variants={textAnim} className="mt-20 text-gray-400 font-bold tracking-widest text-sm uppercase">
          DentalConnect - 運営改善パートナー
        </motion.div>
      </motion.div>
    </div>
  );
}
