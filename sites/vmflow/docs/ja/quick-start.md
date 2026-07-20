---
title: クイックスタート
description: vmflow をインストールし、2 分で最初の TCP 転送ルールを実行します。
---

# クイックスタート

このガイドでは、現行 vmflow プレリリースと隣接設定をインストールし、デーモンを起動して CLI から照会します。

## 1. インストール

現在のシェル向けに `v0.2.0-rc.4` をインストールします（Linux/macOS）。

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.2.0-rc.4 --print-install-dir
)" \
  && [ -n "$VMFLOW_BIN_DIR" ] \
  && [ "${VMFLOW_BIN_DIR#/}" != "$VMFLOW_BIN_DIR" ] \
  && [ -x "$VMFLOW_BIN_DIR/vmflow" ] \
  && export PATH="$VMFLOW_BIN_DIR:$PATH"
```

確認します。

```bash
vmflow version -json
```

必要な場合、インストーラは以後の対応シェルセッション用にも PATH を設定します。`--system` によるシステムインストール、ディレクトリ選択、チェックサム検証、ソースビルドは[インストール](./installation)を参照してください。

## 2. デーモンを起動する

インストール済みバイナリの隣に作成された `config.yaml` でデーモンを起動します。

```bash
vmflow
```

隣接設定がランタイムのデフォルトです。組み込み SSH 例は無効で `127.0.0.1:2201` を使用します。ルールを有効にする前に設定を確認してください。

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

解決されたバイナリの隣にある設定を開き、新しい desired-state を適用します。

```bash
VMFLOW_CONFIG="$(dirname "$(command -v vmflow)")/config.yaml"
"${EDITOR:-vi}" "$VMFLOW_CONFIG"
vmflow ctl reload
```

リロードはまず[プレチェック](./precheck)を実行します。エラーがある場合は変更が却下され、実行中のルールはそのまま維持されます。

## 次のステップ

- [設定](./configuration) — すべての YAML フィールドを解説
- [転送エンジン](./forwarding) — プロトコル、速度制限、接続数キャップ
- [ルールとライフサイクル](./rules) — スナップショット適用と差分
- [`vmflow service install`](./service) — vmflow を起動時のネイティブサービス（systemd / launchd / Windows サービス）として実行
- [`vmflow uninstall`](./uninstall) — ワンコマンドでの完全削除（サービス、バイナリ、設定、ログ、証明書）
