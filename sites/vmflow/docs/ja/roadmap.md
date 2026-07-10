---
title: ロードマップ
description: vmflow のリリースロードマップ — v0.1 ベースラインはリリース済み、v0.2 は進行中、v0.3 は計画中。
---

# ロードマップ

vmflow は実用的な v0.1 相当の MVP の段階にあります。転送パス、ルールライフサイクル、ローカルコントロールプレーン、可観測性の基礎、組み込み API が揃っています。

## v0.1 — ベースライン

- [x] TCP 転送
- [x] UDP 転送
- [x] `ApplySnapshot`
- [x] デーモン + CLI
- [x] ローカルコントロール API
- [x] YAML 設定

## v0.2 — 進行中

- [x] Prometheus メトリクス
- [x] より良い構造化ログ
- [x] コントロール API 認証
- [x] ルールのプレチェック
- [ ] グレースフルドレイン
- [ ] Windows / macOS の手動検証

## v0.3 — 計画中

- [ ] ルールごとの共有帯域バケット
- [ ] イベントサブスクリプション API
- [ ] 設定のホットリロード拡張
- [x] ネイティブの起動時サービス（`vmflow service install` による systemd / launchd / Windows サービス）
- [ ] Docker 公式イメージ / 例

## 後のために予約

HTTP/HTTPS 転送と ACME/証明書管理はソース（`engine/https.go`、`engine/proxy.go`、`acme/`、`certstore/`、`certreview/`）に実装されていますが、現在のビルドでは無効です。NAT トラバーサル（`tunnel/`）も同様に保持されていますが結線されていません。どちらも L4 の表面が安定化したのちの将来のリリースの候補です。
