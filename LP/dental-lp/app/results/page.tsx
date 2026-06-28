import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "螳溽ｸｾ繝ｻ驕狗畑萓・| Dental Route",
  description: "豁ｯ遘大現髯｢縺ｧ縺ｮ螳滄圀縺ｮ驕狗畑萓九・荳驛ｨ繧偵＃邏ｹ莉九＠縺ｾ縺吶ょ・螳ｹ縺ｯ蛹ｻ髯｢縺斐→縺ｮ迥ｶ豕√↓繧医ｊ逡ｰ縺ｪ繧翫∪縺吶・,
  robots: { index: false, follow: false },
};

const STATS = [
  {
    label: "莠育ｴ・｢ｺ螳夂紫",
    before: "30%",
    after: "50%",
    note: "莠育ｴ・ヵ繧ｩ繝ｼ繝縺ｨLINE蟆守ｷ壹・謨ｴ逅・ｾ・,
  },
  {
    label: "辟｡譁ｭ繧ｭ繝｣繝ｳ繧ｻ繝ｫ・域怦髢難ｼ・,
    before: "譛・莉ｶ",
    after: "0縲・莉ｶ",
    note: "繝ｪ繝槭う繝ｳ繝蛾・菫｡縺ｮ豬√ｌ繧呈紛逅・ｾ・,
  },
  {
    label: "謗倥ｊ襍ｷ縺薙＠・域怦髢難ｼ・,
    before: "0莉ｶ",
    after: "蟷ｳ蝮・3莉ｶ",
    note: "莨醍悛謔｣閠・∈縺ｮ蜀肴｡亥・繝輔Ο繝ｼ繧呈紛逅・ｾ・,
  },
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="h-24 md:h-32" />

      <div className="container-lg max-w-4xl pb-36 md:pb-56">
        {/* 繝壹・繧ｸ繝倥ャ繝繝ｼ */}
        <div className="text-center mb-4">
          <h1
            className="fade-up text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            style={{ animationDelay: "0.05s" }}
          >
            螳溽ｸｾ繝ｻ<span className="text-teal-600">驕狗畑萓・/span>
          </h1>
          <p
            className="fade-up text-sm md:text-base text-gray-500 leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            螳滄圀縺ｫ髢｢繧上▲縺溷現髯｢縺ｧ縺ｮ驕狗畑萓九・荳驛ｨ縺ｧ縺・          </p>
        </div>

        {/* 驥崎ｦ√↑豕ｨ諢乗嶌縺・*/}
        <div
          className="fade-up bg-gray-50 rounded-2xl p-5 md:p-6 mb-12 border border-gray-100"
          style={{ animationDelay: "0.35s" }}
        >
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500">窶ｻ 蛟倶ｺｺ諠・ｱ繝ｻ蛹ｻ髯｢諠・ｱ繧剃ｼ上○縺溷ｮ溽ｸｾ陦ｨ遉ｺ縺ｧ縺・/p>
            <p className="text-xs text-gray-500">窶ｻ 螳滄圀縺ｮ驕狗畑萓九・荳驛ｨ縺ｧ縺・/p>
            <p className="text-xs text-gray-500">窶ｻ 蜀・ｮｹ縺ｯ蛹ｻ髯｢縺斐→縺ｮ迥ｶ豕√↓繧医ｊ逡ｰ縺ｪ繧翫∪縺・/p>
          </div>
        </div>

        {/* 謨ｰ蛟､螳溽ｸｾ */}
        <div className="mb-16">
          <h2
            className="fade-up text-lg font-bold text-gray-800 mb-6 text-center"
            style={{ animationDelay: "0.45s" }}
          >
            遒ｺ隱阪・謨ｴ逅・＠縺溽ｵ先棡縺ｮ螟牙喧
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="fade-up bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center"
                style={{ animationDelay: `${0.55 + i * 0.1}s` }}
              >
                <p className="text-sm font-bold text-gray-500 mb-6">{stat.label}</p>

                <div className="text-xl text-gray-300 font-bold mb-2">
                  {stat.before}
                </div>
                <div className="text-xl text-gray-200 mb-2">竊・/div>
                <div className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mb-4">
                  {stat.after}
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 驕狗畑萓九・陬懆ｶｳ隱ｬ譏・*/}
        <div
          className="fade-up bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100"
          style={{ animationDelay: "0.85s" }}
        >
          <h2 className="text-base font-bold text-gray-800 mb-4">驕狗畑萓九↓縺､縺・※</h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              謨ｰ蛟､縺ｮ螟牙喧縺ｯ縲∫憾豕∫｢ｺ隱阪・謨ｴ逅・・隧ｦ陦碁険隱､縺ｮ遨阪∩驥阪・縺ｮ邨先棡縺ｧ縺・            </p>
            <p>
              蜷後§譁ｹ豕輔′蠢・★縺励ｂ莉悶・蛹ｻ髯｢縺ｫ蜷医≧縺ｨ縺ｯ髯舌ｊ縺ｾ縺帙ｓ
            </p>
            <p>
              縺ｾ縺夂樟蝨ｨ縺ｮ迥ｶ豕√ｒ閨槭°縺帙※縺・◆縺縺阪√◎縺ｮ荳翫〒菴輔′縺ｧ縺阪ｋ縺九ｒ荳邱偵↓閠・∴縺ｾ縺・            </p>
          </div>
        </div>

        {/* 陬懆ｶｳ */}
        <div
          className="fade-up mt-12 text-center"
          style={{ animationDelay: "0.95s" }}
        >
          <p className="text-xs text-gray-400">
            謌先棡繧剃ｿ晁ｨｼ縺吶ｋ繧ゅ・縺ｧ縺ｯ縺ゅｊ縺ｾ縺帙ｓ
          </p>
        </div>

        {/* 繝輔ャ繧ｿ繝ｼ縺ｨ縺ｮ菴咏區 */}
        <div className="h-16 md:h-20" />
      </div>

      <Footer />
    </main>
  );
}
