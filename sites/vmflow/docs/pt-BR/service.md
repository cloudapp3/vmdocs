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

O serviço simplesmente executa `vmflow daemon` sob o supervisor da plataforma. No Linux e no macOS, o supervisor envia `SIGTERM` para interrompê-lo; no Windows, o daemon detecta o Service Control Manager na inicialização e reporta o estado por conta própria (nenhum stdout está disponível, então `-log-file` é obrigatório).

## Ações

| Ação | Descrição |
| --- | --- |
| `install` | Gera a unit/plist (ou registra o Windows Service), **habilita** e **inicia** imediatamente. Requer root no Linux/macOS, administrador no Windows. |
| `uninstall` | Interrompe e remove o serviço. Os arquivos de configuração e de log são mantidos no lugar. |
| `status` | Exibe o status atual do serviço. |

## Flags

| Flag | Padrão | Descrição |
| --- | --- | --- |
| `-config` | caminho da plataforma¹ | Caminho do arquivo de configuração com o qual o serviço é executado. A configuração já deve existir. |
| `-user` | `root` _(systemd)_ | Executa a unit como este usuário; criado como usuário de sistema se não existir. Somente Linux. |
| `-log-file` | _(stdout)_ | Redireciona os logs do daemon para cá. Passado como `-log-file` no Linux/Windows; define os caminhos de captura do launchd no macOS. Efetivamente **obrigatório no Windows**. |
| `-extra-args` | _(nenhum)_ | Flags extras adicionadas literalmente à linha de comando do daemon, ex. `"-control-listen 0.0.0.0:19090"`. |
| `-binary` | executável atual | Caminho para o binário do vmflow. Para `install`, deve ser um **caminho absoluto** pertencente a root/admin em um local confiável. |

¹ Caminhos padrão de configuração: Linux `/etc/vmflow/config.yaml`, macOS `/usr/local/etc/vmflow/config.yaml`, Windows `C:\ProgramData\vmflow\config.yaml`.

## Exemplos

```bash
# 1. install a config at the default system path, then register the service
sudo vmflow service install

# 2. point the service at a specific config and run it as a dedicated user
sudo vmflow service install -config /etc/vmflow/config.yaml -user vmflow

# 3. bind the control API off-loopback (auth/mTLS still required — see Deployment)
sudo vmflow service install -extra-args "-control-listen 0.0.0.0:19090"

# 4. check / remove
vmflow service status
sudo vmflow service uninstall
```

## Notas de segurança

- Para `install`, o binário deve resolver para um caminho absoluto pertencente a root/admin em um local de instalação confiável; caso contrário, a instalação é recusada. Isso impede que um usuário menos privilegiado troque o binário após uma instalação privilegiada.
- Expor a control API fora do loopback ainda está sujeito à [verificação de segurança na inicialização](./daemon#startup-safety) do daemon — habilite `auth` ou mTLS, ou o serviço entrará em crash-loop.

Para uma remoção completa (serviço + binário + configuração + logs + certificados), use [`vmflow uninstall`](./uninstall).
