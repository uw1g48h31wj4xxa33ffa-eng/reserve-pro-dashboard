import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "事業者情報 | DentalConnect",
  description: "DentalConnectの事業者情報について",
};

export default function CompanyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 bg-gray-50">
        <div className="container-lg max-w-4xl bg-white p-12 md:p-16 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-12">事業者情報</h1>
          
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-6 px-8 font-bold text-gray-900 w-1/3 bg-gray-50/50">屋号</th>
                  <td className="py-6 px-8 text-gray-600">DentalConnect（デンタルコネクト）</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-6 px-8 font-bold text-gray-900 bg-gray-50/50">代表者</th>
                  <td className="py-6 px-8 text-gray-600">〇〇 〇〇（※後ほどご自身のお名前に変更してください）</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-6 px-8 font-bold text-gray-900 bg-gray-50/50">所在地</th>
                  <td className="py-6 px-8 text-gray-600">
                    〒000-0000<br />
                    東京都〇〇区〇〇 1-2-3<br />
                    （※後ほど実際の住所に変更してください）
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-6 px-8 font-bold text-gray-900 bg-gray-50/50">連絡先</th>
                  <td className="py-6 px-8 text-gray-600">
                    電話：000-000-0000<br />
                    メール：info@example.com<br />
                    ※サービスに関するお問い合わせはお問い合わせフォームよりお願いいたします。
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-6 px-8 font-bold text-gray-900 bg-gray-50/50">事業内容</th>
                  <td className="py-6 px-8 text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>歯科医院向け運営改善コンサルティング</li>
                      <li>予約導線・LINE運用の最適化支援</li>
                      <li>採用・業務改善サポート</li>
                      <li>予約管理ツール等の導入支援</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
