/**
 * 初回ヒアリング用メモ生成モジュール
 *
 * 【重要】
 * - 外部AI API、OpenAI API、Gemini API、Amazon Bedrock 等は一切使用しない
 * - DB保存なし、外部通知なし
 * - このメモは管理者向けの確認補助です。最終判断は人間が行います。
 * - 医療判断・診断・自動返信・自動対応は行いません。
 */

// ─────────────────────────────────────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────────────────────────────────────

type Priority = '高' | '中' | '低';

// ─────────────────────────────────────────────────────────────────────────────
// 分類ルール
// ─────────────────────────────────────────────────────────────────────────────

const KEYWORD_CATEGORY_MAP: { keywords: string[]; category: string }[] = [
  { keywords: ['予約導線', '予約', '確定', 'キャンセル', '無断キャンセル'], category: '予約導線' },
  { keywords: ['LINE運用', 'LINE', '返信', '未読'], category: 'LINE運用' },
  { keywords: ['掘り起こし', '再案内'], category: '掘り起こし' },
  { keywords: ['採用', '求人'], category: '採用' },
  { keywords: ['集計・数値管理', '集計', '数値'], category: '数値管理' },
  { keywords: ['業務改善'], category: '業務改善' },
  { keywords: ['ホームページ・LP', 'LP', 'ホームページ'], category: 'ホームページ・LP' },
  { keywords: ['SNS運用', 'SNS'], category: 'SNS運用' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 改善案のたたき台
// ─────────────────────────────────────────────────────────────────────────────

const IMPROVEMENTS: Record<string, string[]> = {
  '予約導線': [
    '予約希望日の取り方を見直す',
    'フォーム入力項目と分岐を整理する',
    '予約確定までの確認回数を減らす',
  ],
  'LINE運用': [
    'LINE返信テンプレートを整備する',
    '未読時・返信待ち時の対応ルールを整理する',
    '前日/当日リマインド導線を確認する',
  ],
  '掘り起こし': [
    '休眠患者への再案内導線を整理する',
    '対象者の分類方法を確認する',
    '再案内メッセージの文面を整える',
  ],
  '無断キャンセル': [
    '前日/当日リマインド導線を確認する',
    '予約前の注意事項の見せ方を見直す',
    'キャンセル時の再案内フローを整理する',
  ],
  '採用': [
    '求人文面と応募導線を確認する',
    '媒体別の反応を整理する',
    '応募後の対応フローを見直す',
  ],
  '数値管理': [
    '問い合わせ数・予約数・媒体別反応を整理する',
    '日次・週次で見る指標を決める',
    '集計表の項目を見直す',
  ],
  '業務改善': [
    '日々の業務フローを書き出して整理する',
    '繰り返し発生している作業を洗い出す',
    '優先度が高い改善ポイントから整理する',
  ],
  'ホームページ・LP': [
    '問い合わせ導線を確認する',
    'フォームまでの流れを整理する',
    '信頼形成に必要な情報を見直す',
  ],
  'SNS運用': [
    '投稿内容と更新頻度を整理する',
    '反応の傾向を確認する',
    '続けやすい運用ルールを決める',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 初回ヒアリングで確認すべき項目
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_QUESTIONS: Record<string, string[]> = {
  '予約導線': [
    '現在の予約受付方法',
    '予約確定までの平均対応回数',
    '予約枠の余裕',
    'キャンセルや変更時の対応方法',
  ],
  'LINE運用': [
    'LINEの対応担当者',
    '返信テンプレートの有無',
    '未読時の対応ルール',
    '配信内容と頻度',
  ],
  '掘り起こし': [
    '休眠患者の管理方法',
    '再案内の実施有無',
    '再案内メッセージの内容',
    '再来院につながった件数',
  ],
  '無断キャンセル': [
    '無断キャンセルが多い時間帯や曜日の傾向',
    '現在のリマインド有無',
    'キャンセル発生後の対応方法',
  ],
  '採用': [
    '現在使用している求人媒体',
    '応募数と面接数',
    '応募後の対応方法',
    '求人文面や応募導線の課題',
  ],
  '数値管理': [
    '現在見ている指標',
    '日次・週次・月次で集計している項目',
    '媒体別の反応',
    '予約確定率',
  ],
  '業務改善': [
    '現在の業務フローで詰まっている箇所',
    '繰り返し発生しているトラブル',
    '改善したい優先順位',
  ],
  'ホームページ・LP': [
    '現在の問い合わせ導線',
    'フォーム入力項目',
    'スマホ表示の状態',
    'プライバシーポリシーの有無',
  ],
  'SNS運用': [
    '現在の投稿頻度',
    '投稿内容の方向性',
    '反応がある投稿の傾向',
    '運用担当者と継続体制',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 高確認優先度トリガーワード
// ─────────────────────────────────────────────────────────────────────────────

const HIGH_PRIORITY_KEYWORDS = [
  '無断キャンセル', '返信漏れ', '予約が確定しない', '困っている', '困ってい', '急ぎ', '至急',
];

// ─────────────────────────────────────────────────────────────────────────────
// 公開関数
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 問い合わせ内容をカテゴリに分類する
 */
export function classifyInquiry(interests: string[], otherInterest: string): string[] {
  const categorySet = new Set<string>();

  for (const { keywords, category } of KEYWORD_CATEGORY_MAP) {
    for (const keyword of keywords) {
      const inInterests = interests.some((i) => i.includes(keyword));
      const inOther = otherInterest.includes(keyword);
      if (inInterests || inOther) {
        categorySet.add(category);
        break;
      }
    }
  }

  // 「無断キャンセル」はカテゴリとして単独追加（改善案・ヒアリング用）
  if (otherInterest.includes('無断キャンセル')) {
    categorySet.add('無断キャンセル');
  }

  return Array.from(categorySet);
}

/**
 * 確認優先度を判定する
 * ※医療的な緊急性を判断するものではありません
 */
export function getConfirmationPriority(interests: string[], otherInterest: string): Priority {
  const hasHighKeyword = HIGH_PRIORITY_KEYWORDS.some((kw) => otherInterest.includes(kw));
  const isMultiCategory = interests.length >= 3;

  if (hasHighKeyword || isMultiCategory) return '高';

  const midCategories = ['予約導線', 'LINE運用', '掘り起こし', '業務改善'];
  const hasMidCategory = interests.some((i) => midCategories.includes(i));

  if (hasMidCategory) return '中';

  return '低';
}

/**
 * 分類に対応する改善案のたたき台を返す
 */
export function getSuggestedImprovements(categories: string[]): string[] {
  const results: string[] = [];
  for (const cat of categories) {
    const items = IMPROVEMENTS[cat];
    if (items) {
      results.push(...items);
    }
  }
  return results.length > 0 ? results : ['現在の状況を確認したうえで整理します'];
}

/**
 * 分類に対応する初回ヒアリング確認項目を返す
 */
export function getInitialQuestions(categories: string[]): string[] {
  const results: string[] = [];
  for (const cat of categories) {
    const items = INITIAL_QUESTIONS[cat];
    if (items) {
      results.push(...items);
    }
  }
  return results.length > 0 ? results : ['現在の状況について詳しくお聞きする'];
}

/**
 * 初回ヒアリング用メモのテキスト全体を生成して返す
 * （管理者宛メール本文への追加用。外部AI・DB・外部通信は不使用。）
 */
export function generateInquiryMemo(interests: string[], otherInterest: string): string {
  const categories = classifyInquiry(interests, otherInterest);
  const priority = getConfirmationPriority(interests, otherInterest);
  const improvements = getSuggestedImprovements(categories);
  const questions = getInitialQuestions(categories);

  const categoryText =
    categories.length > 0 ? categories.join(' / ') : '分類なし（その他・不明）';

  const improvementsText = improvements.map((item) => `・${item}`).join('\n');
  const questionsText = questions.map((item) => `・${item}`).join('\n');

  return `
---
【初回ヒアリング用メモ】

【課題分類】
${categoryText}

【確認優先度】
${priority}

【想定される改善案のたたき台】
${improvementsText}

【初回ヒアリングで確認すべきこと】
${questionsText}

※このメモは問い合わせ内容を整理するための補助です。最終判断は人間が行います。
---
`.trimStart();
}
