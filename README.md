# Yosuke Sakamoto AI-Assisted Portfolio

課題設定や要件整理、動作確認を本人が行い、AIエージェントの設計・実装支援を活用して形にしたWebアプリのポートフォリオです。FX分析、カフェ予約、求人情報の整理という異なる課題を、操作できるデモとともに紹介します。

## Live Demo

- [Portfolio](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/portfolio/)
- [FX Trade Analytics](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/demo/)
- [余白カフェ予約デモ](https://yohaku-cafe-reservation.sukekyu82.chatgpt.site)
- [フルリモート求人 日次トリアージ](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/jobs-demo/)

## Projects

### 1. FX Trade Analytics

取引履歴CSVから、総損益、勝率、最大ドローダウン、PF、月次・通貨ペア別成績を算出します。累計・年別・月別の期間分析に加え、取引ごとのエントリー、TP、LC、実決済位置、決済理由をワンクリックで振り返れます。

主な観点: データ分析、リスク管理、CSV設計、可視化

### 2. 余白カフェ予約デモ

架空のカフェを題材に、空席の閲覧から予約・予約内容の確認・取消までの画面とデータの流れを示すデモです。空席などの公開画面はログインなしで閲覧でき、予約の保存、本人の予約一覧、取消にはChatGPTへのログインが必要です。重複予約を防ぐデータベース制約を設けています。

React 19、TypeScript、Vinext（Next.js App Router互換）、Cloudflare D1、Drizzle ORMを使用しています。実店舗の運営実績や実在店舗の予約サービスではありません。詳しい設計概要は[余白カフェ予約デモの説明](docs/yohaku-cafe-showcase.md)を参照してください。

主な観点: 予約フロー、認証境界、データ整合性、デモと実サービスの区別

### 3. フルリモート求人 日次トリアージ

公開デモでは、求人情報を確認し、条件に沿って整理する画面を紹介しています。外部サービスからの自動収集や応募の実送信が実装済みであることを示すデモではありません。公開版に実在求人、個人情報、ログイン情報は含めていません。

主な観点: 情報整理、条件判定、状態管理

### 参考作品: 京丹波・自然農 野菜年間カレンダー

京丹波の地域条件と自然農の実践知を、月、野菜、作業内容から確認できる形に整理しました。月齢と伝統的な月相農事暦も表示しますが、効果未確立であることを明記し、作物別適期、地温、水分、霜、天候を優先します。

[自然農カレンダーを見る](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/agri/)

## Supplementary Showcase: Relay | 業務依頼管理

主力3作品を補足する業務依頼管理デモです。架空のサンプルは閲覧専用で、ChatGPTにログインすると自分の依頼を保存・更新できます。本人別のデータ境界、再送時の重複作成防止、楽観的ロック、D1トリガーによる状態変更履歴を設計しています。

[Relayを開く](https://sakamoto-relay-ops.sukekyu82.chatgpt.site/)

設計の概要と制約は[Relayショーケース](docs/relay-ops-showcase.md)を参照してください。ソース原本は非公開です。このデモは侵入テストや第三者診断を受けた認証済み製品ではなく、複数人の共有チームやロール管理機能も提供しません。

## AI-Assisted Development

本人が課題を設定し、要件と完成条件を整理して、デモの動作を確認しています。AIコーディングエージェントは設計相談や実装の支援に使っています。ここで紹介するものはポートフォリオ作品であり、導入実績や顧客向け運用実績を示すものではありません。

## Repository Policy

このリポジトリは採用・ポートフォリオ確認用です。FX分析・求人整理・自然農の公開用静的デモのコードを収録しています。余白カフェの原本コードと各システムの非公開部分は公開せず、カフェはデモへのリンクと設計概要だけを掲載しています。次の情報は含めていません。

- 実在求人の転載データ
- 氏名、連絡先などの応募プロフィール
- ログイン状態、Cookie、認証情報
- 実取引データや口座情報
- ローカル実運用のキャッシュ・履歴ファイル
- 非公開コードや認証用の秘密情報

## Run Locally

リポジトリに公開している静的デモは、各プロジェクトの `index.html` をブラウザで開くと確認できます。FX集計ロジックのテストは次のコマンドで実行します。

```bash
cd projects/fx-trade-analytics
node --test tests/analytics-core.test.js
```

## Author

坂本 陽介

