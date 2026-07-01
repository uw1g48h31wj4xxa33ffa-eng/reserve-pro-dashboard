/**
 * 初回ヒアリング用メモ生成モジュール（改訂版）
 *
 * 【重要】
 * - 外部AI API、OpenAI API、Gemini API、Amazon Bedrock 等は一切使用しない
 * - DB保存なし、外部通知なし、自動返信なし、自動送信なし
 * - このメモは管理者向けの確認補助です。最終判断は人間が行います。
 * - 医療判断・診断・自動対応は行いません。
 */

// ─────────────────────────────────────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────────────────────────────────────

type Priority = '高' | '中' | '低';

interface PriorityResult {
  level: Priority;
  reason: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// カテゴリ優先順位（上位から表示に使う）
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_PRIORITY_ORDER: string[] = [
  '予約導線',
  'LINE運用',
  '無断キャンセル',
  '掘り起こし',
  '数値管理',
  '業務改善',
  '採用',
  'ホームページ・LP',
  'SNS運用',
];

// ─────────────────────────────────────────────────────────────────────────────
// 分類ルール
// ─────────────────────────────────────────────────────────────────────────────

const KEYWORD_CATEGORY_MAP: { keywords: string[]; category: string }[] = [
  { keywords: ['予約導線', '予約', 'キャンセル'], category: '予約導線' },
  { keywords: ['LINE運用', 'LINE', '返信', '未読'], category: 'LINE運用' },
  { keywords: ['掘り起こし', '再案内'], category: '掘り起こし' },
  { keywords: ['採用', '求人'], category: '採用' },
  { keywords: ['集計・数値管理', '集計', '数値'], category: '数値管理' },
  { keywords: ['業務改善'], category: '業務改善' },
  { keywords: ['ホームページ・LP', 'LP', 'ホームページ'], category: 'ホームページ・LP' },
  { keywords: ['SNS運用', 'SNS'], category: 'SNS運用' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 高確認優先度トリガーワード
// ─────────────────────────────────────────────────────────────────────────────

const HIGH_PRIORITY_KEYWORDS = [
  '無断キャンセル', '返信漏れ', '予約が確定しない', '困っている', '困ってい', '急ぎ', '至急',
];

// ─────────────────────────────────────────────────────────────────────────────
// 優先して見るべき課題（カテゴリ別・各最大1つで抽出）
// ─────────────────────────────────────────────────────────────────────────────

const TOP_PRIORITIES: Record<string, string> = {
  '予約導線':    '予約確定までの流れが複雑になっていないか',
  'LINE運用':   '返信テンプレートや対応ルールが整理されているか',
  '無断キャンセル': '前日/当日リマインドの導線が整っているか',
  '掘り起こし':   '休眠患者への再案内対象が整理されているか',
  '数値管理':    '問い合わせ数・予約数・媒体別反応を把握できているか',
  '業務改善':    '日々の業務フローで詰まっている箇所があるか',
  '採用':       '求人文面と応募導線が整理されているか',
  'ホームページ・LP': '問い合わせ導線が分かりやすいか',
  'SNS運用':    '投稿内容と目的が整理されているか',
};

// ─────────────────────────────────────────────────────────────────────────────
// 初回ヒアリングで最初に確認すること（カテゴリ別・各最大1つで抽出、合計4つまで）
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_QUESTIONS_COMPACT: Record<string, string> = {
  '予約導線':    '現在の予約受付方法と、確定までの平均対応回数',
  'LINE運用':   'LINEの対応担当者と、返信ルールの有無',
  '無断キャンセル': '現在のリマインド有無と、キャンセル後の対応方法',
  '掘り起こし':   '休眠患者の管理方法と、再案内の実施有無',
  '数値管理':    '日次・週次・月次で見ている数値と集計方法',
  '業務改善':    '現在もっとも負担になっている作業',
  '採用':       '使用中の求人媒体と、応募後の対応フロー',
  'ホームページ・LP': '現在の問い合わせ導線とフォームの入力項目',
  'SNS運用':    '現在の投稿頻度と担当者・継続体制',
};

// ─────────────────────────────────────────────────────────────────────────────
// 提案の方向性（カテゴリ別・各最大1つで抽出、合計3つまで）
// ─────────────────────────────────────────────────────────────────────────────

const PROPOSAL_DIRECTIONS: Record<string, string> = {
  '予約導線':    '予約の流れを可視化し、確認負担が少ない形に整理する',
  'LINE運用':   '返信テンプレートと対応ルールを整備し、属人化を減らす',
  '無断キャンセル': 'リマインド導線と予約前の注意事項の見せ方を見直す',
  '掘り起こし':   '再案内の対象者と文面を整理し、続けやすい仕組みを検討する',
  '数値管理':    '日々見る指標を決め、改善前後を比較できる状態にする',
  '業務改善':    '繰り返し発生している作業を整理し、優先度の高いものから改善する',
  '採用':       '求人文面と応募後の対応フローを整理する',
  'ホームページ・LP': '問い合わせからフォームまでの流れと、信頼形成に必要な情報を確認する',
  'SNS運用':    '続けやすい投稿ルールを決め、反応がある傾向を把握する',
};

// ─────────────────────────────────────────────────────────────────────────────
// 公開関数
// ─────────────────────────────────────────────────────────────────────────────

/**
 * カテゴリを優先順位順にソートする
 */
export function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_PRIORITY_ORDER.indexOf(a);
    const bi = CATEGORY_PRIORITY_ORDER.indexOf(b);
    const aIdx = ai === -1 ? 999 : ai;
    const bIdx = bi === -1 ? 999 : bi;
    return aIdx - bIdx;
  });
}

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

  // 「無断キャンセル」はその他欄に含まれる場合のみカテゴリとして追加
  if (otherInterest.includes('無断キャンセル')) {
    categorySet.add('無断キャンセル');
  }

  return Array.from(categorySet);
}

/**
 * 問い合わせ内容の要約文を生成する（1〜3文）
 */
export function getSummary(interests: string[], otherInterest: string): string {
  const categories = sortCategories(classifyInquiry(interests, otherInterest));

  if (categories.length === 0) {
    return 'ご相談の内容についてお問い合わせをいただきました。\nまずは詳細をお聞きしながら、必要な整理を進めます。';
  }

  const mainCategories = categories.slice(0, 3);
  const mainText = mainCategories.join('、');

  let summary = `${mainText}に関するご相談です。`;

  // カテゴリ数に応じて補足文を追加
  if (categories.length >= 3) {
    summary += `\n複数の運用課題が含まれており、${mainCategories[0]}を中心に整理することで、改善の糸口が見つかる可能性があります。`;
    summary += '\nまずは現在の運用体制と、もっとも負担になっている部分から確認していきます。';
  } else if (categories.length === 2) {
    summary += `\n${mainCategories.join('と')}について、現状の運用フローを確認しながら整理します。`;
  } else {
    summary += `\n${mainCategories[0]}の現状を確認し、必要な部分から整理していきます。`;
  }

  // その他欄に特定ワードがある場合は補足
  if (HIGH_PRIORITY_KEYWORDS.some((kw) => otherInterest.includes(kw))) {
    summary += '\nお困りの点があるようですので、早めに状況を確認いたします。';
  }

  return summary;
}

/**
 * 確認優先度を判定する（理由つき）
 * ※医療的な緊急性を判断するものではありません
 */
export function getConfirmationPriority(interests: string[], otherInterest: string): PriorityResult {
  const hasHighKeyword = HIGH_PRIORITY_KEYWORDS.some((kw) => otherInterest.includes(kw));
  const isMultiCategory = interests.length >= 3;

  if (hasHighKeyword || isMultiCategory) {
    return {
      level: '高',
      reason: '複数の運用課題が含まれており、予約導線やLINE対応など初回確認が必要な項目が多いため。',
    };
  }

  const midCategories = ['予約導線', 'LINE運用', '掘り起こし', '業務改善'];
  const hasMidCategory = interests.some((i) => midCategories.includes(i));

  if (hasMidCategory) {
    return {
      level: '中',
      reason: '特定の運用課題に関するご相談であり、現状確認を行うことで整理しやすいため。',
    };
  }

  return {
    level: '低',
    reason: '相談範囲が限定的であり、まずは詳細確認から進められるため。',
  };
}

/**
 * 優先して見るべき課題を返す（最大3つ）
 */
export function getTopPriorities(categories: string[]): string[] {
  const sorted = sortCategories(categories);
  const results: string[] = [];
  for (const cat of sorted) {
    if (results.length >= 3) break;
    const item = TOP_PRIORITIES[cat];
    if (item) results.push(item);
  }
  return results.length > 0 ? results : ['まず現在の運用状況を確認する'];
}

/**
 * 初回ヒアリングで最初に確認すること（最大4つ）
 */
export function getInitialQuestions(categories: string[]): string[] {
  const sorted = sortCategories(categories);
  const results: string[] = [];
  for (const cat of sorted) {
    if (results.length >= 4) break;
    const item = INITIAL_QUESTIONS_COMPACT[cat];
    if (item) results.push(item);
  }
  return results.length > 0 ? results : ['現在の状況について詳しくお聞きする'];
}

/**
 * 提案の方向性を返す（最大3つ）
 */
export function getProposalDirections(categories: string[]): string[] {
  const sorted = sortCategories(categories);
  const results: string[] = [];
  for (const cat of sorted) {
    if (results.length >= 3) break;
    const item = PROPOSAL_DIRECTIONS[cat];
    if (item) results.push(item);
  }
  return results.length > 0 ? results : ['まずは現状の整理から始める'];
}

/**
 * 返信メッセージ案を生成する（管理者が手動で送る下書き用。自動返信・自動送信ではない）
 */
export function generateReplyMessage(categories: string[]): string {
  const sorted = sortCategories(categories);
  const top = sorted.slice(0, 2);

  // カテゴリに応じた本文の核心部分を生成
  let bodyCore: string;
  if (top.length === 0) {
    bodyCore = '現在の状況について、詳しくお聞きしながら必要な部分から整理できればと思います。';
  } else if (top.length === 1) {
    bodyCore = `${top[0]}について、現在の運用状況を確認しながら整理できればと思います。`;
  } else {
    bodyCore = `${top[0]}や${top[1]}について、現在の運用状況を確認しながら、必要な部分から順に整理できればと思います。`;
  }

  // 確認依頼文をカテゴリに応じて生成
  const confirmItems: string[] = [];
  if (sorted.includes('予約導線')) confirmItems.push('現在の予約受付方法');
  if (sorted.includes('LINE運用')) confirmItems.push('LINE対応の流れ');
  if (sorted.includes('数値管理')) confirmItems.push('日々確認している数値');
  if (sorted.includes('業務改善')) confirmItems.push('もっとも負担になっている作業');
  if (sorted.includes('無断キャンセル')) confirmItems.push('現在のリマインド対応の状況');
  if (sorted.includes('掘り起こし')) confirmItems.push('休眠患者への再案内の実施状況');
  if (sorted.includes('採用')) confirmItems.push('求人の現状と応募状況');

  const confirmText = confirmItems.length > 0
    ? `差し支えなければ、${confirmItems.slice(0, 3).join('、')}について、簡単にお聞かせください。`
    : 'まずは現在の状況について、簡単にお聞かせください。';

  return `---
【返信メッセージ案】
※このメッセージ案はそのまま使わず、内容を確認・修正したうえで送信してください。

〇〇様

お問い合わせありがとうございます。
内容を確認いたしました。

${bodyCore}

${confirmText}

なお、患者様の個人情報や具体的な診療内容については、こちらのメールには記載しないようお願いいたします。

よろしくお願いいたします。
---`;
}

/**
 * 初回ヒアリング用メモのテキスト全体を生成して返す
 * （管理者宛メール本文への追加用。外部AI・DB・外部通信・自動返信は不使用。）
 */
export function generateInquiryMemo(interests: string[], otherInterest: string): string {
  const categories = classifyInquiry(interests, otherInterest);
  const sorted = sortCategories(categories);
  const priority = getConfirmationPriority(interests, otherInterest);
  const summary = getSummary(interests, otherInterest);
  const categoryText = sorted.length > 0 ? sorted.join(' / ') : '分類なし（その他・不明）';
  const topPriorities = getTopPriorities(sorted);
  const initialQuestions = getInitialQuestions(sorted);
  const proposalDirections = getProposalDirections(sorted);
  const replyMessage = generateReplyMessage(sorted);

  const topPrioritiesText = topPriorities
    .map((item, i) => `${i + 1}. ${item}`)
    .join('\n');
  const questionsText = initialQuestions.map((item) => `・${item}`).join('\n');
  const directionsText = proposalDirections.map((item) => `・${item}`).join('\n');

  return `---
【初回ヒアリング用メモ】

【問い合わせ内容の要約】
${summary}

【課題分類】
${categoryText}

【確認優先度】
${priority.level}
理由：${priority.reason}

【優先して見るべき課題】
${topPrioritiesText}

【初回ヒアリングで最初に確認すること】
${questionsText}

【提案の方向性】
${directionsText}

${replyMessage}

【注意】
このメモと返信文案は、問い合わせ内容を整理するための補助です。
最終判断、修正、送信は人間が行います。
---`;
}
