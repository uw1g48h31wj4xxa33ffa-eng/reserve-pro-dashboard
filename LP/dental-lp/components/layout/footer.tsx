export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7V12C3 16.55 6.84 20.74 12 22C17.16 20.74 21 16.55 21 12V7L12 2Z" fill="white" opacity="0.9"/>
                  <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-base font-bold text-white">DentalConnect</div>
                <div className="text-xs text-turquoise-400">予約率改善サービス</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              歯科医院向けLINE予約導線最適化サービス。<br/>
              問い合わせから予約確定、掘り起こしまで。<br/>
              予約率改善のための仕組みをご提供します。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">サービス</h3>
            <ul className="space-y-2.5 text-sm">
              {["LINE予約導線最適化", "AI患者分析", "掘り起こし自動化", "予約管理ダッシュボード"].map(item => (
                <li key={item}>
                  <a href="#service" className="hover:text-turquoise-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">会社情報</h3>
            <ul className="space-y-2.5 text-sm">
              {["会社概要", "プライバシーポリシー", "利用規約", "お問い合わせ"].map(item => (
                <li key={item}>
                  <a href="#contact" className="hover:text-turquoise-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2025 DentalConnect. All rights reserved.</p>
          <p className="text-xs text-gray-500">歯科医院のための予約率改善パートナー</p>
        </div>
      </div>
    </footer>
  );
}
