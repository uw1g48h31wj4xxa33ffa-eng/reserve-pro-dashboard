import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "プライバシーポリシー | DentalConnect",
  description: "取得する情報の取り扱いについて",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-24 container-lg max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-16 text-center tracking-widest">
          プライバシーポリシー
        </h1>

        <div className="space-y-16 text-gray-700 leading-loose">
          
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-sky-900 border-b border-sky-50 pb-2">1. 取得する情報</h2>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-600 pl-2">
              <li>医院名</li>
              <li>ご担当者様名</li>
              <li>メールアドレス</li>
              <li>電話番号（任意）</li>
              <li>現在のお悩み・課題</li>
              <li>その他フォームに入力された内容</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-sky-900 border-b border-sky-50 pb-2">2. 利用目的</h2>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-600 pl-2">
              <li>お問い合わせへの対応</li>
              <li>内容確認</li>
              <li>ご連絡</li>
              <li>サービスに関するご案内</li>
              <li>必要に応じた提案内容の検討</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-sky-900 border-b border-sky-50 pb-2">3. 第三者提供について</h2>
            <p className="text-sm md:text-base text-gray-600 pl-2">
              取得した情報は、ご本人の同意なく第三者へ提供しません<br />
              ただし、法令に基づく場合を除きます
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-sky-900 border-b border-sky-50 pb-2">4. 個人情報の管理</h2>
            <p className="text-sm md:text-base text-gray-600 pl-2">
              取得した情報は適切に管理します
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-sky-900 border-b border-sky-50 pb-2">5. 開示・訂正・削除について</h2>
            <p className="text-sm md:text-base text-gray-600 pl-2">
              ご本人から開示、訂正、削除等の希望があった場合は適切に対応します
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-sky-900 border-b border-sky-50 pb-2">6. アクセス解析について</h2>
            <p className="text-sm md:text-base text-gray-600 pl-2">
              Google Analytics等のアクセス解析ツールを使用する場合があります<br />
              その際、Cookie等を利用してサイトの利用状況を取得する場合があります
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-sky-900 border-b border-sky-50 pb-2">7. お問い合わせ</h2>
            <p className="text-sm md:text-base text-gray-600 pl-2">
              個人情報の取り扱いに関するお問い合わせは、現状共有フォームまたは指定の連絡方法より受け付けます
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
