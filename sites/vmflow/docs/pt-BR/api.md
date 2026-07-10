---
title: API HTTP
description: A API de controle local do vmflow — autenticação, TLS/mTLS, health, regras, estatísticas, precheck, reload e métricas do Prometheus.
---

# API HTTP

O daemon expõe uma API de controle local. O endereço de escuta padrão é `127.0.0.1:19090`. A CLI e a TUI são clientes leves sobre esses endpoints.

## Autenticação {#authentication}

A API de controle suporta autenticação por bearer token com dois perfis.

```yaml
auth:
  enabled: true
  tokens:
    - name: admin
      token: change-me
      role: admin
    - name: viewer
      token: view-only
      role: viewer
```

```bash
curl -H "Authorization: Bearer change-me" http://127.0.0.1:19090/v1/stats
```

```bash
vmflow ctl -token change-me stats
VMFLOW_CONTROL_TOKEN=change-me vmflow tui
```

| Perfil | Permitido |
| --- | --- |
| `viewer` | Endpoints de leitura: `health`, `rules`, `stats`, `metrics`. |
| `admin` | Tudo o que o `viewer` pode fazer, mais `reload`. |

Os tokens são comparados em tempo constante. Quando `auth.enabled: false`, as requisições são tratadas como um chamador anônimo de nível admin — seguro apenas em loopback.

Um bind não loopback com auth desabilitado **recusa a inicialização** (fail-closed). Faça bind em `127.0.0.1`, habilite o `auth`, habilite TLS mútuo (`control_tls.client_ca_file`) ou passe `-insecure-allow-remote-control` ao daemon para optar novamente. Falhas de autenticação repetidas de um mesmo IP de par (10 tentativas em 1 minuto) são limitadas com HTTP `429` e bloqueadas por um minuto; isso é best-effort (por IP de par, reinicia ao reiniciar o processo).

## TLS e TLS mútuo {#tls-and-mutual-tls}

A API de controle pode servir sobre TLS e, opcionalmente, exigir certificados de cliente (TLS mútuo). Configure-a em `control_tls`:

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # optional → enables mTLS
  min_version: "1.2"                           # "1.2" (default) or "1.3"
```

- O TLS fica ativo quando **ambos** `cert_file` e `key_file` estão definidos.
- Definir `client_ca_file` ativa o **TLS mútuo**: todo cliente deve apresentar um certificado assinado por essa CA. O mTLS também satisfaz a verificação de segurança de inicialização não loopback descrita acima.
- Os clientes passam seu bundle de CA e o certificado de cliente via `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` (ou as env vars `VMFLOW_TLS_*`). Consulte [Flags comuns de cliente](./commands#common-client-flags).

O mTLS é a maneira recomendada de expor a API de controle fora do loopback (por exemplo, atrás de um Cloudflare Tunnel) sem abrir uma porta de entrada.

## `GET /healthz`

Saúde do daemon.

```json
{
  "ok": true,
  "running_rules": 1,
  "time": 1760000000
}
```

## `GET /v1/rules`

Regras em execução.

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "name": "ssh-forward",
      "protocol": "tcp",
      "listen_addr": "0.0.0.0",
      "listen_port": 2201,
      "target_addr": "127.0.0.1",
      "target_port": 22,
      "enabled": true
    }
  ]
}
```

## `GET /v1/stats`

Contadores em memória por regra.

```json
{
  "items": [
    {
      "rule_id": "ssh-forward",
      "upload_bytes": 1024,
      "download_bytes": 2048,
      "conns": 1,
      "updated_time": 1760000000
    }
  ]
}
```

## `GET|POST /v1/precheck`

Valide a configuração atual **sem aplicá-la**. O `reload` executa as mesmas verificações; qualquer erro rejeita o reload.

Verificações: validação de regras, `rule_id` duplicado, conflitos de listener, capacidade de bind da porta de escuta, resolução de DNS do alvo e avisos de privilégio em portas baixas. (Verificações de domínio HTTPS e ACME estão desabilitadas no build atual.)

```bash
vmflow ctl precheck
```

```json
{
  "config_path": "./examples/config.yaml",
  "rule_count": 1,
  "result": {
    "ok": true,
    "error_count": 0,
    "warning_count": 0,
    "checked_rules": 1,
    "checked_time_ms": 1,
    "items": []
  }
}
```

Consulte [Precheck](./precheck) para a lista completa de verificações.

## `GET /metrics`

Exposição em formato texto do Prometheus. Exemplo:

```text
vmflow_rule_upload_bytes_total{rule_id="ssh-forward",protocol="tcp"} 1024
vmflow_rule_download_bytes_total{rule_id="ssh-forward",protocol="tcp"} 2048
vmflow_rule_connections{rule_id="ssh-forward",protocol="tcp"} 1
vmflow_control_requests_total{method="GET",path="/v1/stats",status="200"} 10
vmflow_reload_total{status="ok"} 1
vmflow_rule_apply_total{action="started",status="ok"} 1
```

Famílias de métricas:

- `vmflow_build_info`
- `vmflow_uptime_seconds`
- `vmflow_rule_running{rule_id,protocol}`
- `vmflow_rule_connections{rule_id,protocol}`
- `vmflow_rule_upload_bytes_total{rule_id,protocol}`
- `vmflow_rule_download_bytes_total{rule_id,protocol}`
- `vmflow_control_requests_total{method,path,status}`
- `vmflow_control_request_duration_seconds_sum{method,path,status}`
- `vmflow_reload_total{status}`
- `vmflow_rule_apply_total{action,status}`

## `POST /v1/reload`

Recarrega o arquivo de configuração e executa `ApplySnapshot(replace_all=true)` após o precheck.

```json
{
  "config_path": "./examples/config.yaml",
  "control_listen_addr": "127.0.0.1:19090",
  "rule_count": 1,
  "result": {
    "applied_rules": 1,
    "stopped_rules": 0,
    "failed_rules": 0,
    "total_rules": 1,
    "items": []
  }
}
```

::: warning Endpoints desabilitados
Os endpoints de certificado `/v1/certs*` existem no código-fonte, mas **não são registrados** no build atual (HTTPS/ACME está desabilitado).
:::
