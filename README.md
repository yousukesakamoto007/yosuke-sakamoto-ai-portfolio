# Yosuke Sakamoto AI-Assisted Portfolio

本人が選んだ課題と要望をもとに、操作確認と改善判断を重ね、AIエージェントの設計・実装・検証支援を活用して形にしたWebアプリのポートフォリオです。業務依頼管理、カフェ予約、FX分析、求人整理の4作品を紹介します。

## Live Demo

- [Portfolio](https://yousukesakamoto007.github.io/yosuke-sakamoto-ai-portfolio/)
- [Relay | 業務依頼管理](https://sakamoto-relay-ops.sukekyu82.chatgpt.site/)
- [余白カフェ予約デモ](https://yohaku-cafe-reservation.sukekyu82.chatgpt.site)
- [FX Trade Analytics](https://yousukesakamoto007.github.io/yosuke-sakamoto-ai-portfolio/projects/fx-trade-analytics/)
- [フルリモート求人 日次トリアージ](https://yousukesakamoto007.github.io/yosuke-sakamoto-ai-portfolio/projects/remote-job-triage-demo/)

Portfolio、FX分析、求人整理は、許可した静的ファイルだけをGitHub Pages向けに配信する構成です。FXのCSVはブラウザ内で処理し、求人デモは架空の内容を使います。ログイン後の保存機能を含む余白カフェとRelayはSitesホストを利用します。非公開コード原本は公開しません。

### 公開の仕組み

`scripts/build-pages.mjs` に明記したファイルだけを `_site/` に生成します。リポジトリ全体、テスト、文書、非公開の原本や応募データはPagesの配信物に含めません。GitHub Actionsの設定では、集計・デモ操作・相対リンク・公開範囲を確認し、条件を満たした場合に`main`からGitHub Pagesへ配信します。

ローカル確認（Node.js 24、追加パッケージ不要）:

```sh
node --test projects/fx-trade-analytics/tests/analytics-core.test.js projects/remote-job-triage-demo/tests/demo.test.cjs scripts/pages.test.mjs
```

## Projects

### 1. Relay | 業務依頼管理

Webサイト、データ、業務運用に関する依頼を作成し、状態と変更履歴を追うデモです。固定の架空サンプルは閲覧専用で、ChatGPTにログインすると本人の依頼を保存・更新できます。

本人別のデータ境界、再送時の重複作成防止、バージョン照合による同時更新制御、D1トリガーによる変更履歴を扱います。複数人の共有チームやロール管理機能、侵入テスト・第三者診断を提供するものではありません。原本コードは非公開です。

[Relayを開く](https://sakamoto-relay-ops.sukekyu82.chatgpt.site/)

[Relayの設計・検証ページ](https://sakamoto-relay-ops.sukekyu82.chatgpt.site/engineering) · [公開ケーススタディ](https://yousukesakamoto007.github.io/yosuke-sakamoto-ai-portfolio/engineering/relay/)

主な観点: backend、QA設計、本人別データ境界、状態遷移

### 2. 余白カフェ予約デモ

架空のカフェを題材に、空席の閲覧から予約・予約内容の確認・取消までの画面とデータの流れを示すデモです。空席などの公開画面はログインなしで閲覧でき、予約の保存、本人の予約一覧、取消にはChatGPTへのログインが必要です。重複予約を防ぐデータベース制約を設けています。

React 19、TypeScript、Vinext（Next.js App Router互換）、Cloudflare D1、Drizzle ORMを使用しています。実店舗の運営実績や実在店舗の予約サービスではありません。詳しい設計概要は[余白カフェ予約デモの説明](docs/yohaku-cafe-showcase.md)を参照してください。

主な観点: 予約画面、フロントエンド、データベース設計、予約データ整合性

### 3. FX Trade Analytics

取引履歴CSVから、総損益、勝率、最大ドローダウン、PF、月次・通貨ペア別成績を算出します。累計・年別・月別の期間分析に加え、取引ごとのエントリー、TP、LC、実決済位置、決済理由をワンクリックで振り返れます。

主な観点: データ分析、リスク管理、CSV設計、可視化

### 4. フルリモート求人 日次トリアージ

公開デモでは、求人情報を確認し、条件に沿って整理する画面を紹介しています。外部サービスからの自動収集や応募の実送信が実装済みであることを示すデモではありません。公開版に実在求人、個人情報、ログイン情報は含めていません。

主な観点: 業務整理、条件判定、状態管理

### 参考作品: 京丹波・自然農 野菜年間カレンダー

京丹波の地域条件と自然農の実践知を、月、野菜、作業内容から確認できる形に整理しました。月齢と伝統的な月相農事暦も表示しますが、効果未確立であることを明記し、作物別適期、地温、水分、霜、天候を優先します。

[自然農カレンダーを見る](https://y-sakamoto-fx-analytics.sukekyu82.chatgpt.site/agri/)

## AI-Assisted Development

本人が課題を選び、要望を伝え、操作確認と改善判断を行っています。AIコーディングエージェントは設計、実装、検証を支援しています。作品は導入実績や顧客向け運用実績を示すものではありません。

## Repository Policy

このリポジトリは採用・ポートフォリオ確認用です。FX分析・求人整理・自然農の公開用静的デモのコードを収録しています。Relayと余白カフェはデモと設計説明を掲載し、原本コードは非公開です。公開ケーススタディには設計説明と匿名化した検証結果のみを掲載します。次の情報は含めていません。

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

