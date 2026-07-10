---
title: vmflow uninstall
description: Desinstalação do vmflow em um único comando — remove o serviço, binário, configuração, logs, certificados e o cache de atualização.
---

# vmflow uninstall

```bash
vmflow uninstall [--dry-run]
```

Aliases: `vmflow remove`, `vmflow rm`.

Realiza a remoção completa de uma instalação do vmflow. Ele executa um fluxo de **plano → confirmação → execução**:

1. **Plano** — inspeciona o sistema e lista tudo o que seria removido.
2. **Confirmação** — exibe o prompt `[y/N]` (omitido com `--dry-run` ou quando não há nada a remover).
3. **Execução** — remove os itens em ordem, tolerando caminhos já ausentes para que o comando seja idempotente.

## Flags

| Flag | Padrão | Descrição |
| --- | --- | --- |
| `--dry-run` | `false` | Exibe o plano de remoção sem remover nada. |

## O que remove

Os itens são removidos nesta ordem (o serviço primeiro, o binário em execução por último, para que um daemon ainda supervisionado seja encerrado antes que seu executável seja excluído):

| Item | Observações |
| --- | --- |
| Serviço nativo | Interrompe e remove a unit do systemd / plist do launchd / Windows Service. |
| Arquivo de configuração | A configuração padrão da plataforma (veja [`service`](./service)), se presente. |
| Certificados TLS / ACME | Caminhos de certificado e chave **referenciados pela configuração** (`control_tls`, diretórios de cache ACME/cert). |
| Diretórios de log | ex. `/var/log/vmflow` (Linux/macOS), `C:\ProgramData\vmflow\logs` (Windows). |
| Cache de autoatualização | O diretório de cache do atualizador. |
| Binário do vmflow | O executável em execução, removido por último. |

::: warning Instalações por gerenciador de pacotes
Se o binário pertence a um gerenciador de pacotes (`dpkg` / `rpm`), o `uninstall` exibe um aviso e recomenda `apt remove` / `yum remove`, pois excluir o arquivo diretamente deixa o banco de dados de pacotes desatualizado. Ele ainda prossegue se você confirmar.
:::

Caminhos protegidos (raízes do sistema, seu diretório home) nunca são removidos.

## Exemplos

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
