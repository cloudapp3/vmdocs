---
title: Implantação
description: Execute o vmflow como um daemon em produção — exposição da API de controle, autenticação, TLS/mTLS, logging, métricas e configuração de serviço nativo.
---

# Implantação

O vmflow roda como um daemon de longa duração expondo uma API de controle local. Esta página aborda as preocupações práticas para executá-lo em um host.

## Mantenha a API de controle no loopback

O valor padrão de `control_listen_addr` é `127.0.0.1:19090`. Com `auth.enabled: false`, a API de controle trata toda requisição como um chamador anônimo de nível admin — isso só é seguro no loopback.

O daemon **recusa a inicialização** se a API de controle estiver vinculada a um endereço não loopback (`0.0.0.0`, `::`, um IP não loopback, ou `:port`) sem proteção. Esse comportamento é fail-closed: evita expor acidentalmente um endpoint de controle remoto não autenticado. Para vincular fora do loopback, atenda a uma destas condições:

1. `auth.enabled: true` com pelo menos um token, **ou**
2. TLS mútuo via `control_tls.client_ca_file` (os clientes devem apresentar um certificado), **ou**
3. passe `-insecure-allow-remote-control` ao daemon para reconhecer explicitamente o risco.

## Expondo fora do localhost

Quando você precisa acessar a API de controle a partir de outro host, escolha uma das opções seguras.

### Opção A — autenticação por bearer token

```yaml
control_listen_addr: 0.0.0.0:19090
auth:
  enabled: true
  tokens:
    - name: admin
      token: <long-random-secret>
      role: admin
    - name: viewer
      token: <another-random-secret>
      role: viewer
```

Use o token `admin` para qualquer chamada que faça mutações (`reload`). Chamadas somente de leitura funcionam com um token `viewer`.

### Opção B — TLS / TLS mútuo (recomendado)

Termine o TLS na própria API de controle e, para a postura mais forte, exija certificados de cliente:

```yaml
control_listen_addr: 0.0.0.0:19090
control_tls:
  cert_file: /etc/vmflow/server.pem
  key_file:  /etc/vmflow/server.key
  client_ca_file: /etc/vmflow/client-ca.pem   # mTLS — satisfies the startup check
  min_version: "1.2"
```

Os clientes então se conectam com `-tls-ca-file`, `-tls-client-cert`, `-tls-client-key` (consulte [Flags comuns do cliente](./commands#common-client-flags)). Esta é a maneira recomendada de expor a API de controle por trás de um Cloudflare Tunnel sem portas de entrada. Consulte [HTTP API → TLS e TLS mútuo](./api#tls-and-mutual-tls).

Consulte também [HTTP API → Autenticação](./api#authentication).

## Logging

Defina o formato que se adapta à sua stack:

```yaml
log:
  level: info
  format: json # text or json
```

`json` é o mais fácil para aggregators de log; `text` é mais amigável em um terminal. Sob um service manager, você também pode passar `-log-file` ao daemon (obrigatório no Windows).

## Métricas

Aponte o Prometheus para a API de controle:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

Consulte [HTTP API → Métricas](./api#get-metrics) para as famílias de métricas expostas.

## Recarregar com segurança

Alterações de configuração passam por `POST /v1/reload` (ou `vmflow ctl reload`). O recarregamento executa o [precheck](./precheck) primeiro e rejeita a alteração em caso de qualquer erro, deixando as regras em execução intactas. Ainda não há janela de drenagem graceful — conexões existentes com uma regra removida/alterada não são migradas.

## Executando como um serviço nativo

Registre o vmflow no service manager do seu SO para que ele inicie no boot e reinicie em caso de falha:

```bash
# installs + enables + starts a systemd unit / launchd plist / Windows Service
sudo vmflow service install
```

Este é o caminho recomendado — consulte [`vmflow service`](./service) para as flags (caminho de configuração, usuário de execução, arquivo de log, argumentos extras). `vmflow service status` / `vmflow service uninstall` consultam e o removem.

Se preferir gerenciar a unidade você mesmo, aqui está um exemplo funcional de systemd que você pode adaptar:

```ini
[Unit]
Description=vmflow L4 forwarding daemon
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/vmflow daemon -config /etc/vmflow/config.yaml
ExecReload=/usr/local/bin/vmflow ctl reload
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Recarregue a configuração após edições:

```bash
sudo vmflow ctl reload
# or, with a hand-written unit that wires ExecReload:
sudo systemctl reload vmflow
```

Para uma remoção completa (serviço + binário + configuração + logs + certificados + cache de atualização), use [`vmflow uninstall`](./uninstall).

## Limitações atuais

- As estatísticas são **somente em memória**; não há agregação histórica embutida.
- Nenhum web dashboard ou coordenador multi-node embutido.
- Ainda não há imagem Docker oficial no archive de release (instalação como serviço nativo, além de pacotes `.deb`/`.rpm`, estão disponíveis).
