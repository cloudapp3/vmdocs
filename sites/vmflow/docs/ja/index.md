---
layout: home
description: vmflow は、デーモンやコントロールプレーン向けの小さな pure-Go 製 L4 転送ランタイムです。TCP/UDP/tcp+udp のポート転送、ルールライフサイクル、プレチェック、Prometheus メトリクス、ターミナル UI、さらにデーモンやコントロールプレーンに組み込める Go ライブラリを提供します。
hero:
  name: vmflow
  text: デーモンとコントロールプレーンのための L4 転送ランタイム
  tagline: 小さな pure-Go 製 TCP/UDP 転送ランタイム。スタンドアロンのデーモンとして実行することも、ランタイムを独自のコントロールプレーンに組み込むこともできます。ルールライフサイクル、プレチェック、メトリクス、ターミナル UI を搭載。
  image:
    src: /logo.svg
    alt: vmflow
  actions:
    - theme: brand
      text: はじめる
      link: ./quick-start
    - theme: alt
      text: CLI リファレンス
      link: ./commands
    - theme: alt
      text: GitHub
      link: https://github.com/cloudapp3/vmflow

features:
  - icon: 🔀
    title: L4 転送
    details: TCP、UDP、そして tcp+udp のポート転送。ルールごとの速度制限と最大接続数キャップに対応。
    link: ./forwarding
  - icon: 🔄
    title: ルールライフサイクル
    details: ルールの開始・停止・再起動・削除に加え、差分適用とホットリロードによる全体の desired-state スナップショット適用が可能。
    link: ./rules
  - icon: 🛡️
    title: 適用前のプレチェック
    details: ルールがひとつ変更される前に、重複ルール ID・リスナの衝突・利用不可ポート・DNS の失敗を検出。
    link: ./precheck
  - icon: 🧩
    title: 組み込み可能なランタイム
    details: 最上位の Go API を import して、独自のコントロールプレーンにインプロセスの転送を追加。エンジンが担うのは転送とカウンタだけです。
    link: ./library
  - icon: 📊
    title: Prometheus メトリクスとログ
    details: /metrics エンドポイントと構造化 text/JSON ロギングにより、追加の配線なしで転送の可観測性を確保。
    link: ./ctl
  - icon: 🖥️
    title: TUI と Telegram ボット
    details: ターミナルダッシュボードとオプションの Telegram ボットで、どこからでもルールの確認と操作が可能。
    link: ./tui-guide
  - icon: ⬆️
    title: 自己更新
    details: "`vmflow update` で新しいリリースの確認とインストールをその場で実行。初回インストール後はインストーラスクリプト不要。"
    link: ./update
---

## ワンコマンドでインストール

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

デーモンを起動します。

```bash
vmflow -config ./examples/config.yaml
```

別のターミナルからクエリします。

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl precheck
```

## vmflow を選ぶ理由

vmflow は、軽量なインプロセス L4 転送を必要とする開発者や運用者のために作られました。スタンドアロンのデーモンとして、あるいはより大きなコントロールプレーン内のライブラリとして利用できます。

次のような用途に最適です。

- ポート間で TCP/UDP トラフィックを、ルールごとの制限付きで転送したい
- 独自の desired-state やデータベースから転送ルールを駆動したい
- 転送設定を適用する前に検証したい
- 組み込みの CLI/TUI でルール統計を確認し、リロードしたい
- データベースや Web UI を持ち込まずに、転送機能を別の Go サービスに組み込みたい

## クイックリンク

- [クイックスタート](./quick-start)
- [インストール](./installation)
- [設定](./configuration)
- [コマンドリファレンス](./commands)
- [Go ライブラリ](./library)
- [中文文档](/zh/)
