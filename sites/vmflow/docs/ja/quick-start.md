---
title: クイックスタート
description: vmflow をインストールし、2 分で最初の TCP 転送ルールを実行します。
---

# クイックスタート

このガイドでは安定版 vmflow v0.3.0 をインストールし、`vmflow init` で検証済みの最初のルールを作成して、CLI からデーモンを照会します。

## 1. インストール

現在のシェル向けに `v0.3.0` をインストールします（Linux/macOS）。

```bash
VMFLOW_BIN_DIR="$(
  curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
    | bash -s -- --version v0.3.0 --print-install-dir
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

## 2. vmflow を初期化する

初回ウィザードを実行します。

```bash
vmflow init
```

最初に言語を選びます。`1` は English、`2` は簡体字中国語です。次に推奨のネイティブシステムサービス、現在のターミナルでの foreground、または保存のみを選択します。ウィザードは検証済みルールと認証済みローカル管理を作成し、選択したモードに合う system/user 設定パスへ保存します。

システムサービスはインストール・有効化・起動まで行います。foreground は現在のターミナルを使用します。保存のみを選んだ場合は後で `vmflow run` を実行してください。

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

`vmflow status` で有効な設定パスを確認して編集し、新しい desired-state を適用します。

```bash
vmflow status
vmflow ctl reload
```

リロードはまず[プレチェック](./precheck)を実行します。エラーがある場合は変更が却下され、実行中のルールはそのまま維持されます。

## 次のステップ

- [設定](./configuration) — すべての YAML フィールドを解説
- [転送エンジン](./forwarding) — プロトコル、共有帯域制限、日次・月次クォータ、接続数キャップ
- [ルールとライフサイクル](./rules) — スナップショット適用と差分
- [`vmflow service install`](./service) — vmflow を起動時のネイティブサービス（systemd / launchd / Windows サービス）として実行
- [`vmflow uninstall`](./uninstall) — ワンコマンドでの完全削除（サービス、バイナリ、設定、ログ、証明書）
