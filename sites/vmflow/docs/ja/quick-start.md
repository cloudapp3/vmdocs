---
title: クイックスタート
description: vmflow をインストールし、2 分で最初の TCP 転送ルールを実行します。
---

# クイックスタート

このガイドでは、`vmflow` バイナリをインストールし、サンプル設定でデーモンを起動し、CLI からクエリを実行します。

## 1. インストール

最新のビルド済みバイナリをインストールします（Linux/macOS）。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | bash
```

グローバルインストールする場合は以下を実行します。

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh | sudo bash -s -- --dir /usr/local/bin
```

確認します。

```bash
vmflow version
```

リリースタグの指定（`--version`）、チェックサム検証、ソースからのビルドについては[インストール](./installation)を参照してください。

## 2. デーモンを起動する

サンプル設定を用意してデーモンを起動します。

```bash
vmflow -config ./examples/config.yaml
```

組み込み SSH 例は無効で `127.0.0.1:2201` を使用します。有効化前に確認してください。

## 3. クエリする

別のターミナルから組み込み CLI でローカルデーモンを照会します。

```bash
vmflow ctl rules
vmflow ctl stats
vmflow ctl metrics
vmflow ctl precheck
```

## 4. ターミナル UI を開く

```bash
vmflow tui
```

<kbd>Tab</kbd> キーで Dashboard / Rules / Detail の各ビューを切り替えられます。詳しくは [TUI ダッシュボード](./tui-guide)を参照してください。

## 5. 設定編集後にリロードする

`examples/config.yaml` を編集し、新しい desired-state を適用します。

```bash
vmflow ctl reload
```

リロードはまず[プレチェック](./precheck)を実行します。エラーがある場合は変更が却下され、実行中のルールはそのまま維持されます。

## 次のステップ

- [設定](./configuration) — すべての YAML フィールドを解説
- [転送エンジン](./forwarding) — プロトコル、速度制限、接続数キャップ
- [ルールとライフサイクル](./rules) — スナップショット適用と差分
- [`vmflow service install`](./service) — vmflow を起動時のネイティブサービス（systemd / launchd / Windows サービス）として実行
- [`vmflow uninstall`](./uninstall) — ワンコマンドでの完全削除（サービス、バイナリ、設定、ログ、証明書）
