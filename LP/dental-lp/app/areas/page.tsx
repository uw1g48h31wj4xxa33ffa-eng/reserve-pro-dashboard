import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "蟇ｾ蠢憺伜沺 | Dental Route",
  description: "莠育ｴ・ｰ守ｷ壹・LINE驕狗畑繝ｻ謗倥ｊ襍ｷ縺薙＠繝ｻ謗｡逕ｨ繝ｻ謨ｰ蛟､邂｡逅・・讌ｭ蜍呎隼蝟・↑縺ｩ縲∵ｭｯ遘大現髯｢縺ｮ驕句霧縺ｧ豌励↓縺ｪ縺｣縺ｦ縺・ｋ鬆伜沺繧堤｢ｺ隱阪・謨ｴ逅・＠縺ｾ縺吶・,
  robots: { index: false, follow: false },
};

const AREAS = [
  {
    icon: "套",
    title: "莠育ｴ・ｰ守ｷ・,
    lines: [
      "莠育ｴ・ヵ繧ｩ繝ｼ繝縲´INE蟆守ｷ壹∽ｺ育ｴ・｢ｺ螳壹∪縺ｧ縺ｮ豬√ｌ繧堤｢ｺ隱阪＠縺ｾ縺・,
      "迴ｾ蝣ｴ縺ｮ驕狗畑縺ｫ蜷医ｏ縺帙※縲∫┌逅・・縺ｪ縺・ｰ守ｷ壹ｒ謨ｴ逅・＠縺ｾ縺・,
    ],
  },
  {
    icon: "町",
    title: "LINE驕狗畑",
    lines: [
      "繝ｪ繝・メ繝｡繝九Η繝ｼ縲・・菫｡蜀・ｮｹ縲∝撫縺・粋繧上○蟇ｾ蠢懊・豬√ｌ繧堤｢ｺ隱阪＠縺ｾ縺・,
      "謔｣閠・ｧ倥→縺ｮ謗･轤ｹ繧貞・縺九ｊ繧・☆縺乗紛逅・＠縺ｾ縺・,
    ],
  },
  {
    icon: "売",
    title: "謗倥ｊ襍ｷ縺薙＠",
    lines: [
      "莨醍悛鬘ｧ螳｢縺ｸ縺ｮ蜀肴｡亥・繧・∝・譚･髯｢縺ｫ縺､縺ｪ縺後ｋ豬√ｌ繧堤｢ｺ隱阪＠縺ｾ縺・,
      "辟｡逅・↑譯亥・縺ｧ縺ｯ縺ｪ縺上∫憾豕√↓蜷医ｏ縺帙◆譁ｹ豕輔ｒ閠・∴縺ｾ縺・,
    ],
  },
  {
    icon: "束窶坂囎・・,
    title: "謗｡逕ｨ",
    lines: [
      "豎ゆｺｺ譁・擇縲∝ｿ懷供蟆守ｷ壹∝ｪ剃ｽ薙＃縺ｨ縺ｮ隕九∴譁ｹ繧堤｢ｺ隱阪＠縺ｾ縺・,
      "謗｡逕ｨ豢ｻ蜍輔・蜈･繧雁哨繧呈紛逅・＠縺ｾ縺・,
    ],
  },
  {
    icon: "投",
    title: "髮・ｨ医・謨ｰ蛟､邂｡逅・,
    lines: [
      "蝠上＞蜷医ｏ縺帶焚縲∽ｺ育ｴ・焚縲∝ｪ剃ｽ灘挨縺ｮ蜿榊ｿ懊↑縺ｩ繧堤｢ｺ隱阪＠縺ｾ縺・,
      "譌･縲・・迥ｶ豕√ｒ隕九∴繧句ｽ｢縺ｫ謨ｴ逅・＠縺ｾ縺・,
    ],
  },
  {
    icon: "笞呻ｸ・,
    title: "讌ｭ蜍呎隼蝟・,
    lines: [
      "謇倶ｽ懈･ｭ縲∫｢ｺ隱肴ｼ上ｌ縲・㍾隍・ｯｾ蠢懊↑縺ｩ繧堤｢ｺ隱阪＠縺ｾ縺・,
      "迴ｾ蝣ｴ縺ｧ辟｡逅・↑縺冗ｶ壹￠繧峨ｌ繧句ｽ｢繧定・∴縺ｾ縺・,
    ],
  },
  {
    icon: "倹",
    title: "繝帙・繝繝壹・繧ｸ繝ｻLP",
    lines: [
      "繝帙・繝繝壹・繧ｸ繧・∝撫縺・粋繧上○縺ｫ縺､縺ｪ縺偵ｋ1繝壹・繧ｸ蝙九・譯亥・繝壹・繧ｸ繧堤｢ｺ隱阪＠縺ｾ縺・,
      "隕九∴譁ｹ繧・ｰ守ｷ壹ｒ縲∫憾豕√↓蜷医ｏ縺帙※謨ｴ逅・＠縺ｾ縺・,
    ],
  },
  {
    icon: "導",
    title: "SNS驕狗畑",
    lines: [
      "謚慕ｨｿ蜀・ｮｹ縲∵峩譁ｰ鬆ｻ蠎ｦ縲∝渚蠢懊・蛯ｾ蜷代ｒ遒ｺ隱阪＠縺ｾ縺・,
      "邯壹￠繧・☆縺・°逕ｨ縺ｮ蠖｢繧剃ｸ邱偵↓閠・∴縺ｾ縺・,
    ],
  },
];

export default function AreasPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="h-24 md:h-32" />

      <div className="container-lg max-w-4xl pb-36 md:pb-56">
        {/* 繝壹・繧ｸ繝倥ャ繝繝ｼ */}
        <div className="text-center mb-16">
          <h1
            className="fade-up text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            style={{ animationDelay: "0.05s" }}
          >
            蟇ｾ蠢・span className="text-teal-600">鬆伜沺</span>
          </h1>
          <p
            className="fade-up text-sm md:text-base text-gray-500 leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            繝・・繝ｫ縺ゅｊ縺阪〒縺ｯ縺ｪ縺上∫樟蝣ｴ縺ｮ迥ｶ豕√↓蜷医ｏ縺帙※螳溷漁縺ｮ豬√ｌ繧呈紛逅・＠縺ｾ縺・          </p>
        </div>

        {/* 蜷・伜沺繧ｫ繝ｼ繝・*/}
        <div className="space-y-4 md:space-y-6">
          {AREAS.map((area, i) => (
            <div
              key={i}
              className="fade-up bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
              style={{ animationDelay: `${0.35 + i * 0.07}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-teal-50 flex items-center justify-center text-2xl">
                  {area.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                    {area.title}
                  </h2>
                  <div className="space-y-2">
                    {area.lines.map((line, j) => (
                      <p
                        key={j}
                        className="text-sm text-gray-600 leading-loose"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 陬懆ｶｳ */}
        <div
          className="fade-up mt-16 text-center space-y-2"
          style={{ animationDelay: "0.9s" }}
        >
          <p className="text-xs text-gray-400">
            蜀・ｮｹ縺ｫ繧医▲縺ｦ縺ｯ縲√＃蟶梧悍縺ｫ豺ｻ縺医↑縺・ｴ蜷医′縺斐＊縺・∪縺・          </p>
          <p className="text-xs text-gray-400">
            縺ｾ縺壹・迥ｶ豕√ｒ縺願◇縺九○縺・◆縺縺阪√◎縺ｮ荳翫〒荳邱偵↓閠・∴縺ｾ縺・          </p>
        </div>

        {/* 繝輔ャ繧ｿ繝ｼ縺ｨ縺ｮ菴咏區 */}
        <div className="h-16 md:h-20" />
      </div>

      <Footer />
    </main>
  );
}
