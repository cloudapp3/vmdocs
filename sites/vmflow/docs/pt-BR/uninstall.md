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
| Arquivos de configuração | A configuração padrão da plataforma (veja [`service`](./service)) e a configuração ao lado do binário pertencente ao instalador. Uma configuração ao lado pertencente ao usuário é preservada. |
| Certificados TLS / ACME externos | Certificados e chaves fora do armazenamento do vmflow são preservados. |
| Diretórios de log | ex. `/var/log/vmflow` (Linux/macOS), `C:\ProgramData\vmflow\logs` (Windows). |
| Cache de autoatualização | O diretório de cache do atualizador. |
| Binário do vmflow | O executável em execução, removido por último. |

::: warning Instalações por gerenciador de pacotes
Se o binário pertence a um gerenciador de pacotes (`dpkg` / `rpm`), o `uninstall` exibe um aviso e recomenda `apt remove` / `yum remove`, pois excluir o arquivo diretamente deixa o banco de dados de pacotes desatualizado. Ele ainda prossegue se você confirmar.
:::

Caminhos protegidos (raízes do sistema, seu diretório home) nunca são removidos.

## Instalações gerenciadas pelo instalador

Para uma instalação de usuário criada pelo `install.sh`, prefira a desinstalação no nível do instalador:

```bash
curl -fsSL https://raw.githubusercontent.com/cloudapp3/vmflow/main/install.sh \
  | bash -s -- --uninstall
```

Ela delega para `vmflow uninstall` quando disponível e usa uma limpeza via shell para um binário antigo ou ausente. Após a remoção bem-sucedida do binário, também remove de `.zshrc`, `.bashrc` ou `.profile` o bloco PATH exato pertencente ao instalador. Linhas PATH semelhantes criadas pelo usuário, arquivos de inicialização com link simbólico e arquivos não graváveis não são alterados.

Use `sudo bash -s -- --uninstall` apenas para uma instalação do sistema pertencente ao root. Passe `--dir PATH` junto com `--uninstall` ao remover um diretório personalizado escolhido explicitamente.

## Exemplos

```bash
# preview only
vmflow uninstall --dry-run

# full teardown (will prompt to confirm)
sudo vmflow uninstall
```
