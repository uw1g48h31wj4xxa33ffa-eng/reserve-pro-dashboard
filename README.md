# Portfolio

AIを活用し、現場業務の整理、Webフォーム、管理画面、業務改善ツールなどを設計・構築した制作物をまとめています。

各制作物では、機能を作ることだけでなく、実際の業務で使いやすい導線、確認負担の軽減、安全性、保守性を意識しています。

## Projects

### Dental Route LP

歯科医院の運営課題を共有してもらうための、限定公開の業務改善相談LPです。

主な内容：

- Next.js / TypeScript
- 問い合わせフォーム
- Gmail通知
- 問い合わせ内容の自動整理
- 初回ヒアリング用メモ
- 返信メッセージ案
- Basic認証
- noindex設定
- DB保存なし
- 最終判断と送信は人間が実施

詳細：
[Dental Route LP README](LP/dental-lp/README.md)

---

### ReservePRO

歯科医院の予約導線と管理側の予約枠調整を想定した、予約管理デモです。

主な内容：

- 目的別予約フォーム
- 予約申請一覧
- カレンダー管理
- 時間帯ブロック
- 入力バリデーション
- Firebase連携
- 管理画面
- Next.js / TypeScript版への再構成構想

詳細：
[ReservePRO README](README_ReservePRO.md)

---

### Practice Assistant V2

士業業務の整理、確認、進捗管理、文書作成補助などを想定した業務支援ツールです。

現在、構成・機能・READMEを整理しています。

詳細：
[Practice Assistant V2 README](Practice-Assistant-V2/README.md)

## Development approach

- 人間が要件、仕様、最終判断を担当
- ChatGPT、Gemini、Claudeなどを用途に応じて活用
- AIの出力をそのまま採用せず、実際の画面と挙動を人間が確認
- README、構成資料、テスト項目を整理
- 個人情報、認証情報、実データを公開リポジトリへ含めない

## Notes

各制作物は、デモ、検証、実務経験をもとにしたポートフォリオとして整理しています。

本番利用や外部提供を行う場合は、クライアント所有の環境、権限管理、セキュリティ、契約、保守範囲などを別途設計します。
