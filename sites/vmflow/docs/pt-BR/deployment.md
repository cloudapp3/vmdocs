---
title: Implantação
description: Execute o vmflow com gerenciamento loopback, logs, métricas, SSH e serviço nativo.
---

# Implantação

O vmflow funciona como processo de encaminhamento de longa duração. O gerenciamento permanece no loopback e usa a CLI/TUI incluída.

## Gerenciamento local

O canal interno de gerenciamento sempre é vinculado a `127.0.0.1`. A configuração define apenas a porta local:

```yaml
control_port: 19090
```

As interfaces suportadas são `vmflow ctl` e `vmflow tui`. O transporte interno não é uma API pública de integração.

## Gerenciamento remoto

Encaminhe a porta loopback por SSH e use a CLI/TUI localmente:

```bash
ssh -N -L 19090:127.0.0.1:19090 user@server
vmflow ctl rules
```

## Logging

Defina o formato que se adapta à sua stack:

```yaml
log:
  level: info
  format: json # text or json
```

`json` é o mais fácil para aggregators de log; `text` é mais amigável em um terminal. Sob um service manager, você também pode passar `-log-file` ao daemon (obrigatório no Windows).

## Métricas

Configure o Prometheus no mesmo host para ler o listener de métricas loopback:

```yaml
scrape_configs:
  - job_name: vmflow
    static_configs:
      - targets: ['127.0.0.1:19090']
    metrics_path: /metrics
```

## Recarregar com segurança

Use `vmflow ctl reload` para aplicar alterações. O [precheck](./precheck) roda primeiro e uma configuração inválida não é aplicada parcialmente.

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
ExecStart=/usr/local/bin/vmflow -config /etc/vmflow/config.yaml
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

- Contadores acumulados podem ser persistidos; conexões ativas e taxas continuam locais ao processo.
- Nenhum web dashboard ou coordenador multi-node embutido.
- Ainda não há imagem Docker oficial; use o instalador de serviço nativo integrado para iniciar no boot.
