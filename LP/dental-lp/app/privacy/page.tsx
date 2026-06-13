import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "プライバシーポリシー | DentalConnect",
  description: "DentalConnectのプライバシーポリシーについて",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 bg-gray-50">
        <div className="container-lg max-w-4xl bg-white p-12 md:p-16 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-12">プライバシーポリシー</h1>
          
          <div className="space-y-10 text-gray-600 leading-loose">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">1. 個人情報の収集について</h2>
              <p>
                当事業は、お客様からご提供いただく個人情報（氏名、メールアドレス、電話番号、医院情報など）を、適正かつ公正な手段によって取得いたします。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">2. 個人情報の利用目的</h2>
              <p>取得した個人情報は、以下の目的で利用いたします。</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>お問い合わせ・ご相談に対する回答および資料送付のため</li>
                <li>お申し込みいただいたサービスのご提供および運営サポートのため</li>
                <li>当事業が提供する新サービスや有用な情報をご案内するため</li>
                <li>サービスの品質向上を目的としたアンケートや調査のため</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">3. 個人情報の第三者提供</h2>
              <p>
                当事業は、ご本人の同意を得ている場合や法令に基づく場合を除き、取得した個人情報を第三者に提供・開示することはいたしません。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">4. 個人情報の管理</h2>
              <p>
                当事業は、個人情報の漏洩、滅失、毀損等を防止するため、必要かつ適切な安全管理措置を講じます。また、業務委託先に対しても適切な監督を行います。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">5. お問い合わせ窓口</h2>
              <p>
                本プライバシーポリシーや個人情報の取り扱いに関するお問い合わせは、当サイトのお問い合わせフォームよりご連絡ください。
              </p>
            </section>

            <div className="pt-8 text-sm text-gray-400">
              制定日：2023年10月1日<br />
              最終改定日：2023年10月1日
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
