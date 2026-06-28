import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "繝励Λ繧､繝舌す繝ｼ繝昴Μ繧ｷ繝ｼ | Dental Route",
  description: "蜿門ｾ励☆繧区ュ蝣ｱ縺ｮ蜿悶ｊ謇ｱ縺・↓縺､縺・※",
};

const SECTIONS = [
  {
    title: "1. 蜿門ｾ励☆繧区ュ蝣ｱ",
    type: "list" as const,
    items: [
      "蛹ｻ髯｢蜷・,
      "縺疲球蠖楢・ｧ伜錐",
      "繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ",
      "髮ｻ隧ｱ逡ｪ蜿ｷ・井ｻｻ諢擾ｼ・,
      "豌励↓縺ｪ繧矩・岼",
      "縺昴・莉悶ヵ繧ｩ繝ｼ繝縺ｫ蜈･蜉帙＆繧後◆蜀・ｮｹ",
    ],
  },
  {
    title: "2. 蛻ｩ逕ｨ逶ｮ逧・,
    type: "list" as const,
    items: [
      "縺・◆縺縺・◆蜀・ｮｹ縺ｸ縺ｮ蟇ｾ蠢・,
      "蜀・ｮｹ遒ｺ隱・,
      "縺秘｣邨｡",
      "迥ｶ豕∫｢ｺ隱阪↓髢｢縺吶ｋ縺秘｣邨｡",
      "蠢・ｦ√↓蠢懊§縺溷ｯｾ蠢懷・螳ｹ縺ｮ讀懆ｨ・,
    ],
  },
  {
    title: "3. 隨ｬ荳芽・署萓帙↓縺､縺・※",
    type: "text" as const,
    text: "蜿門ｾ励＠縺滓ュ蝣ｱ縺ｯ縲√＃譛ｬ莠ｺ縺ｮ蜷梧э縺ｪ縺冗ｬｬ荳芽・∈謠蝉ｾ帙＠縺ｾ縺帙ｓ\n縺溘□縺励∵ｳ穂ｻ､縺ｫ蝓ｺ縺･縺丞ｴ蜷医ｒ髯､縺阪∪縺・,
  },
  {
    title: "4. 蛟倶ｺｺ諠・ｱ縺ｮ邂｡逅・,
    type: "text" as const,
    text: "蜿門ｾ励＠縺滓ュ蝣ｱ縺ｯ驕ｩ蛻・↓邂｡逅・＠縺ｾ縺・,
  },
  {
    title: "5. 髢狗､ｺ繝ｻ險よｭ｣繝ｻ蜑企勁縺ｫ縺､縺・※",
    type: "text" as const,
    text: "縺疲悽莠ｺ縺九ｉ髢狗､ｺ縲∬ｨよｭ｣縲∝炎髯､遲峨・蟶梧悍縺後≠縺｣縺溷ｴ蜷医・驕ｩ蛻・↓蟇ｾ蠢懊＠縺ｾ縺・,
  },
  {
    title: "6. 繧｢繧ｯ繧ｻ繧ｹ隗｣譫舌↓縺､縺・※",
    type: "text" as const,
    text: "Google Analytics遲峨・繧｢繧ｯ繧ｻ繧ｹ隗｣譫舌ヤ繝ｼ繝ｫ繧剃ｽｿ逕ｨ縺吶ｋ蝣ｴ蜷医′縺ゅｊ縺ｾ縺兔n縺昴・髫帙，ookie遲峨ｒ蛻ｩ逕ｨ縺励※繧ｵ繧､繝医・蛻ｩ逕ｨ迥ｶ豕√ｒ蜿門ｾ励☆繧句ｴ蜷医′縺ゅｊ縺ｾ縺・,
  },
  {
    title: "7. 蛟倶ｺｺ諠・ｱ縺ｫ髢｢縺吶ｋ縺秘｣邨｡",
    type: "text" as const,
    text: "蛟倶ｺｺ諠・ｱ縺ｮ蜿悶ｊ謇ｱ縺・↓髢｢縺吶ｋ縺雁撫縺・粋繧上○縺ｯ縲―n迴ｾ迥ｶ蜈ｱ譛峨ヵ繧ｩ繝ｼ繝縺ｾ縺溘・謖・ｮ壹・騾｣邨｡譁ｹ豕輔ｈ繧雁女縺台ｻ倥￠縺ｾ縺・,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="h-24 md:h-32"></div>
      <div className="pb-36 md:pb-56 container-lg max-w-3xl">
        <h1
          className="fade-up text-2xl md:text-3xl font-bold text-gray-900 mb-16 text-center"
          style={{ animationDelay: "0.05s" }}
        >
          繝励Λ繧､繝舌す繝ｼ繝昴Μ繧ｷ繝ｼ
        </h1>

        <div className="space-y-16 text-gray-700 leading-loose">
          {SECTIONS.map((section, i) => (
            <section
              key={i}
              className="fade-up space-y-4"
              style={{ animationDelay: `${0.2 + i * 0.06}s` }}
            >
              <h2 className="text-lg font-bold text-sky-900 border-b border-sky-50 pb-2">
                {section.title}
              </h2>
              {section.type === "list" ? (
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-600 pl-2">
                  {section.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm md:text-base text-gray-600 pl-2">
                  {section.text.split("\n").map((line, j, arr) => (
                    <span key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
      <div className="h-16 md:h-20"></div>

      <Footer />
    </main>
  );
}
