const xlsx = require('xlsx');

// 1. エクセルファイルの読み込み
const wb = xlsx.readFile('20260605_スキルシート.xlsx');
const sheetName = wb.SheetNames[0];
const ws = wb.Sheets[sheetName];

// 2. 2次元配列としてデータを取り出す
let data = xlsx.utils.sheet_to_json(ws, { header: 1 });

// 新しいプロジェクト（No. 5）
const newProject = [
  [
    "5",
    "2026年6月\n〜\n2026年6月",
    "ローカル予約システムのSaaS化・セキュアなクラウドDBへの移行\n\n≪開発業務≫\n・ローカルファイル（Excel）管理からクラウドDB（Firebase Firestore）への移行・API連携の実装\n・Basic認証とセキュリティヘッダー（Helmet）を用いたゼロトラストに基づくセキュリティ強化\n・フロントエンド・バックエンド間のAPI連携およびブラウザキャッシュに起因するエラーのデバッグ\n・システム移行に伴う環境構築、稼働検証、運用マニュアルの作成",
    null,
    null,
    "Windows\nGCP(Firebase)",
    null,
    "Node.js\nExpress\nFirebase\nHTML/CSS\nJavaScript",
    null,
    "作業工程"
  ],
  [
    null, null, null, null, null, null, null, null, null, "■要件定義", "■基本設計"
  ],
  [
    null, null, null, null, null, null, null, null, null, "■詳細設計", "■製造/単体テスト"
  ],
  [
    null, null, null, null, null, null, null, null, null, "■結合テスト", "■総合テスト"
  ],
  [],
  [],
  [],
  [],
  [],
  [
    null,
    "計：約1ヶ月"
  ],
  [
    "役割/人数",
    "役割：フルスタックエンジニア",
    null,
    null,
    "1 人"
  ],
  [
    "作業工程",
    "■要件定義",
    "■基本設計",
    "■詳細設計",
    "■製造/単体テスト",
    "■結合テスト",
    "■総合テスト"
  ],
  []
];

// 「■ 技術スタック」の行を探す
const techStackIndex = data.findIndex(row => row[0] === "■ 技術スタック");
if (techStackIndex !== -1) {
    // その直前に新しいプロジェクトを挿入
    data.splice(techStackIndex, 0, ...newProject);
}

// データ挿入後の「フロントエンド」などの行を探して追加
const frontEndIndex = data.findIndex(row => row[0] === "フロントエンド");
if (frontEndIndex !== -1 && data[frontEndIndex][2]) {
    data[frontEndIndex][2] += " / Firebase";
}

const backEndIndex = data.findIndex(row => row[0] === "バックエンド");
if (backEndIndex !== -1 && data[backEndIndex][2]) {
    data[backEndIndex][2] += " / Express / Helmet (セキュリティ) / Basic認証";
}

const dbIndex = data.findIndex(row => row[0] === "データベース");
if (dbIndex === -1) {
    // データベース行がなければバックエンドの下に追加
    const newDbIndex = data.findIndex(row => row[0] === "バックエンド") + 1;
    data.splice(newDbIndex, 0, ["データベース", null, "Firebase Firestore (NoSQL)"]);
} else {
    data[dbIndex][2] += " / Firebase Firestore";
}

// 「■ 強み・アピールポイント」の行を探して追加
const appealIndex = data.findIndex(row => row[0] === "■ 募集要項への適合性");
const newAppeal = [
  [
    "モダンなSaaSアーキテクチャへの移行・実装経験",
    null,
    "ローカル環境のシステムを自律的アプローチでクラウドネイティブ（Firebase）へ移行。強固な認証基盤とセキュリティ対策を構築し、セキュアなSaaSアプリとしての再設計を完遂。"
  ],
  [
    "トラブルシューティングと原因究明力",
    null,
    "システム連携時に発生した「ブラウザキャッシュによる認証バイパス・同期エラー」など、Web特有の潜在的不具合に対し、通信フロー全体を俯瞰して原因を特定・解決するデバッグ能力。"
  ]
];

if (appealIndex !== -1) {
    data.splice(appealIndex - 1, 0, ...newAppeal);
}

// 3. シートを新しく作り直して保存
const newWs = xlsx.utils.aoa_to_sheet(data);

// カラム幅の簡易設定（A列を少し広くなど）
const wscols = [
    {wch: 25}, {wch: 25}, {wch: 40}, {wch: 10}, {wch: 10}, {wch: 15}, {wch: 10}, {wch: 25}, {wch: 10}, {wch: 15}, {wch: 15}
];
newWs['!cols'] = wscols;

wb.Sheets[sheetName] = newWs;
xlsx.writeFile(wb, '20260605_スキルシート.xlsx');

console.log("エクセルファイルの更新が完了しました。");
