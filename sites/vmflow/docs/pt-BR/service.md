---
title: vmflow service
description: Registra o vmflow como um serviço nativo do SO que inicia no boot e reinicia em caso de falha — systemd, launchd ou Windows Service.
---

# vmflow service

```bash
vmflow service (install|uninstall|status) [flags]
```

Alias: `vmflow svc`.

Registra o `vmflow` como um serviço nativo do SO que **inicia no boot** e **reinicia em caso de falha**:

| Plataforma | Mecanismo | Localização |
| --- | --- | --- |
| Linux | unit do systemd | `/etc/systemd/system/<name>.service` |
| macOS | daemon do launchd | `/Library/LaunchDaemons/io.cloudapp.<name>.plist` |
| Windows | Windows Service | gerenciado via `services.msc` / `sc.exe` |

O serviço simplesmente executa `vmflow` sob o supervisor da plataforma. No Linux e no macOS, o supervisor envia `SIGTERM`; no Windows, o daemon detecta o Service Control Manager e reporta o estado. Como o SCM não tem stdout, os logs usam `C:\ProgramData\vmflow\logs\vmflow.log` por padrão.

## Ações

| Ação | Descrição |
| --- | --- |
| `install` | Valida a configuração, cria ou atualiza a unit/plist/Windows Service, **habilita** e **inicia** imediatamente. Repetir o comando atualiza e reinicia o serviço existente. Requer root no Linux/macOS, administrador no Windows. |
| `uninstall` | Interrompe e remove o serviço. Os arquivos de configuração e de log são mantidos no lugar. |
| `status` | Exibe o status atual do serviço. |

## Flags

| Flag | Padrão | Descrição |
| --- | --- | --- |
| `-config` | caminho da plataforma¹ | Caminho da configuração do serviço. Ela deve ser válida e estar em local protegido pertencente a root/admin. |
| `-user` | `root` _(systemd)_ | Executa a unit como este usuário; criado como usuário de sistema se não existir. Somente Linux. |
| `-log-file` | padrão da plataforma | Sobrescreve o destino dos logs. Linux usa stdout/journald, macOS caminhos do launchd e Windows `C:\ProgramData\vmflow\logs\vmflow.log`. |
| `--control-port` | valor da configuração | Sobrescreve a porta local de gerenciamento; o host continua `127.0.0.1`. |
| `--extra-arg` | _(nenhum)_ | Adiciona uma futura flag como `--extra-arg=-flag=value`; pode ser repetido. Flags atuais devem usar suas opções dedicadas. |
| `-binary` | executável atual | Caminho para o binário do vmflow. Para `install`, deve ser um **caminho absoluto** pertencente a root/admin em um local confiável. |

¹ Caminhos padrão de configuração: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## Exemplos

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. opcionalmente altere a porta de gerenciamento loopback
sudo vmflow service install --control-port 19100

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## Notas de segurança

- Para `install`, o binário e a configuração devem resolver para caminhos absolutos pertencentes a root/admin em locais confiáveis. A configuração é analisada antes de alterar o serviço.
- O listener de gerenciamento sempre usa `127.0.0.1`; o acesso remoto usa um túnel SSH.

Para uma remoção completa (serviço + binário + configuração + logs + certificados), use [`vmflow uninstall`](./uninstall).
