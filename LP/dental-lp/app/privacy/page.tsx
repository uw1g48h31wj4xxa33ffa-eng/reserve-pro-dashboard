import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "プライバシーポリシー | Dental Route",
  description: "取得する情報の取り扱いについて",
};

const SECTIONS = [
  {
    title: "1. 取得する情報",
    type: "list" as const,
    items: [
      "医院名",
      "ご担当者様名",
      "メールアドレス",
      "電話番号（任意）",
      "気になる項目",
      "その他フォームに入力された内容",
    ],
  },
  {
    title: "2. 利用目的",
    type: "list" as const,
    items: [
      "いただいた内容への対応",
      "内容確認",
      "ご連絡",
      "状況確認に関するご連絡",
      "必要に応じた対応内容の検討",
    ],
  },
  {
    title: "3. 第三者提供について",
    type: "text" as const,
    text: "取得した情報は、ご本人の同意なく第三者へ提供しません\nただし、法令に基づく場合を除きます",
  },
  {
    title: "4. 個人情報の管理",
    type: "text" as const,
    text: "取得した情報は適切に管理します",
  },
  {
    title: "5. 開示・訂正・削除について",
    type: "text" as const,
    text: "ご本人から開示、訂正、削除等の希望があった場合は適切に対応します",
  },
  {
    title: "6. アクセス解析について",
    type: "text" as const,
    text: "Google Analytics等のアクセス解析ツールを使用する場合があります\nその際、Cookie等を利用してサイトの利用状況を取得する場合があります",
  },
  {
    title: "7. 個人情報に関するご連絡",
    type: "text" as const,
    text: "個人情報の取り扱いに関するお問い合わせは、\n現状共有フォームまたは指定の連絡方法より受け付けます",
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
          プライバシーポリシー
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
      <div className="h-24 md:h-32"></div>

      <Footer />
    </main>
  );
}
