# Yosuke Sakamoto AI-Assisted Portfolio

宝飾営業、約12年間のFX専業、古民家改修・自然農で培った顧客理解、分析、現場観察を、AIエージェントを活用して第三者が操作できるWebアプリへ変換したポートフォリオです。

## Live Demo

- [Portfolio](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/portfolio/)
- [FX Trade Analytics](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/demo/)
- [京丹波・自然農 野菜年間カレンダー](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/agri/)
- [フルリモート求人 日次トリアージ](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/jobs-demo/)

## Projects

### 1. FX Trade Analytics

取引履歴CSVから、総損益、勝率、最大ドローダウン、PF、月次・通貨ペア別成績を算出します。累計・年別・月別の期間分析に加え、取引ごとのエントリー、TP、LC、実決済位置、決済理由をワンクリックで振り返れます。

主な観点: データ分析、リスク管理、CSV設計、Canvas可視化、自動テスト

### 2. 京丹波・自然農 野菜年間カレンダー

京丹波の地域条件と自然農の実践知を、月、野菜、作業内容から確認できる形に整理しました。月齢と伝統的な月相農事暦も表示しますが、効果未確立であることを明記し、作物別適期、地温、水分、霜、天候を優先します。

主な観点: 現場情報の構造化、地域条件、月齢表示、不確実性の明示

### 3. フルリモート求人 日次トリアージ

実運用版は、求人収集、適合判定、新規・再掲・別求人の履歴管理、応募済み管理、日次レポート、応募フォーム入力補助を一つの流れに統合しています。公開版は実在求人、個人情報、ログイン情報を含まない匿名デモです。

応募フォーム入力補助は、未知の必須質問、外部サイト、CAPTCHAで停止し、最終送信は必ず本人が確認します。

主な観点: 業務自動化、ルール判定、状態管理、安全なHuman-in-the-loop設計

## AI-Assisted Development

Claude Code・CodexなどのAIコーディングエージェントを、要件整理、設計相談、実装、デバッグ、テスト、文書化に活用しています。課題設定、表示指標、完成条件、出力検証、最終判断は制作者が担当しています。

## Repository Policy

このリポジトリは採用・ポートフォリオ確認用です。次の情報は含めていません。

- 実在求人の転載データ
- 氏名、連絡先などの応募プロフィール
- ログイン状態、Cookie、認証情報
- 実取引データや口座情報
- ローカル実運用のキャッシュ・履歴ファイル

## Run Locally

各プロジェクトの `index.html` をブラウザで開くと確認できます。FX集計ロジックのテストは次のコマンドで実行します。

```bash
cd projects/fx-trade-analytics
node --test tests/analytics-core.test.js
```

## Author

坂本 陽介

