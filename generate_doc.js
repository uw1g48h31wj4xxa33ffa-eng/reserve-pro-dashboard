const fs = require('fs');

const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Reserve Pro システム概要・仕様説明書</title>
<style>
    body { font-family: "Meiryo", "Yu Gothic", sans-serif; line-height: 1.6; color: #333; }
    h1 { color: #2b579a; border-bottom: 2px solid #2b579a; padding-bottom: 5px; font-size: 24pt; text-align: center; margin-bottom: 30px; }
    h2 { color: #ffffff; background-color: #2b579a; padding: 10px; font-size: 16pt; margin-top: 40px; }
    h3 { color: #2b579a; border-left: 5px solid #2b579a; padding-left: 10px; font-size: 14pt; margin-top: 20px; }
    p { font-size: 11pt; margin-bottom: 10px; }
    ul { margin-bottom: 15px; }
    li { font-size: 11pt; margin-bottom: 5px; }
    .highlight { background-color: #f0f8ff; padding: 15px; border-radius: 5px; border: 1px solid #b0d4ff; margin: 10px 0; }
</style>
</head>
<body>

<h1>Reserve Pro システム概要・仕様説明書</h1>

<p>本書は、予約管理システム「Reserve Pro」について、第三者やクリニックスタッフ向けの「一般的な概要」と、エンジニア・技術担当者向けの「技術的な裏側の仕様」の2つの視点から詳細に解説した資料です。</p>

<h2>第1部：【第三者・スタッフ向け】システムの概要とメリット</h2>

<p>本システムは、患者様にスマートフォンアプリのような快適な予約体験を提供しつつ、クリニックの受付スタッフがカレンダー感覚で簡単に予約枠をコントロールできるように設計された「次世代型の予約管理システム」です。</p>

<h3>1. 4つの専用予約フォーム（患者様向け）</h3>
<p>患者様の目的に合わせて最適化された4種類の専用フォームを用意しています。これにより、患者様が迷うことなくスムーズに予約を完了できます。</p>
<ul>
    <li><strong>新規予約・再予約フォーム：</strong> 初めての方や定期健診など、一般的な予約を受け付けるメインフォームです。</li>
    <li><strong>予約変更フォーム：</strong> 既存の予約を変更・キャンセルしたい方向けのフォームです。希望日時が空いていない場合の対応（キャンセルするか、変更しないか）を事前にヒアリングします。</li>
    <li><strong>カウンセリング予約：</strong> 歯列矯正やインプラントなど、長時間の相談が必要な方向けのフォームです。</li>
    <li><strong>ご紹介専用フォーム：</strong> 他の患者様からの紹介で来院される方向けの特別フォームです。</li>
</ul>

<h3>2. 管理者ダッシュボード（クリニック向け）</h3>
<p>クリニックの受付スタッフや院長が、システム会社に依頼することなく、即座に予約の空き状況を変更できる管理画面です。</p>
<ul>
    <li><strong>不定休のワンタッチ設定：</strong> カレンダーの日付をクリックして「学会出席」などのメモを入れるだけで、即座に患者様側のフォームでその日が予約不可（×）に切り替わります。</li>
    <li><strong>時間帯ブロック設定：</strong> 「毎週のこの時間帯は予約を受け付けない」「お昼休みの時間をブロックする」といった特定の時間枠の制限も、ダッシュボードから簡単に設定可能です。</li>
</ul>

<div class="highlight">
    <p><strong>【導入の最大のメリット】</strong><br>
    患者様にとっては「いつでもスマホから見やすく予約しやすい」環境が整い、クリニック側にとっては「急な休診やスケジュール変更にも、スタッフ自身ですぐに対応できる」という業務効率の劇的な向上が見込めます。</p>
</div>

<h2>第2部：【エンジニア・技術担当者向け】システム構成と技術仕様</h2>

<p>本システムは、モダンなWeb標準技術（Vanilla JS等）を最大限に活用し、クラウドインフラを適材適所で組み合わせたスケーラブルなBaaS/PaaS型アーキテクチャを採用しています。</p>

<h3>1. アーキテクチャと採用技術・インフラ構成</h3>
<p>フロントエンド（画面表示）とバックエンド（データ処理）を切り離したモダンな設計です。</p>
<ul>
    <li><strong>フロントエンド（HTML5 / CSS3 / Vanilla JS）：</strong> ReactやVue.jsといった重いライブラリを排除し、ピュアなJavaScript（ES6+）のみで構築しています。これにより、初回読み込み速度が極めて速く、古いスマートフォンでも遅延なく動作します。</li>
    <li><strong>ソースコード管理・ホスティング（GitHub）：</strong> ソースコードのバージョン管理には「GitHub」を使用し、迅速かつ安全な開発フロー（バージョン管理・チーム開発・デプロイへの連携）を実現しています。</li>
    <li><strong>バックエンド・APIサーバー（Render）：</strong> APIの実行環境やサーバーサイドのホスティングには、クラウドプラットフォームである「Render」を採用しています。これにより、トラフィックの増減に対して柔軟なスケーリングが可能です。</li>
    <li><strong>データベース連携（Firebase）：</strong> 予約データや休診日データはすべてJSON形式のRESTful API経由でやり取りされ、データベースとして「Firebase」を活用しています。セキュアかつリアルタイム性の高いデータ同期が可能な構造になっています。</li>
</ul>

<h3>2. システムの構造とディレクトリ設計</h3>
<p>システム全体は大きく「患者向け」と「管理者向け」にディレクトリレベルで分離（疎結合）されています。</p>
<ul>
    <li><strong>患者向けフォーム（マルチページ構成）：</strong> 4つのフォームはそれぞれ独立したディレクトリに配置されています。1つのフォームで障害が発生しても、他のフォームには影響を与えない堅牢な作りです。</li>
    <li><strong>管理者ダッシュボード（SPA風挙動）：</strong> ダッシュボード側は、画面遷移を伴わずに非同期通信（<code>fetch</code> API）でデータを取得し、JavaScriptのDOM操作でカレンダーを再描画するSPA（シングルページアプリケーション）に近い滑らかなUIを実現しています。</li>
</ul>

<h3>3. コード設計の強み</h3>
<ul>
    <li><strong>データ駆動型の状態管理：</strong> JavaScript内に <code>state</code> オブジェクト（<code>holidays</code> や <code>blockedSlots</code> などを管理）を持たせ、データが更新されると <code>renderAll()</code> 関数が実行されて自動的に画面が再構築される、リアクティブな設計思想を取り入れています。</li>
    <li><strong>柔軟な環境切り替え（デモ/本番）：</strong> コード内の設定（API連携用のURL等）を書き換えるだけで本番稼働し、URLを空にすれば即座に「ローカル完結のデモモード（通信を行わずモックデータで動作）」に切り替わる仕組みを実装しており、プレゼンや開発テストが極めて容易です。</li>
</ul>

</body>
</html>
`;

fs.writeFileSync('システム説明資料.doc', htmlContent, 'utf8');
console.log('Word file regenerated successfully with GitHub and Render.');
