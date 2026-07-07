---
title: Suporte de plataformas
description: Quais recursos funcionam no Linux, macOS e Windows.
---

# Suporte de plataformas

| Recurso | Linux | macOS | Windows |
| --- | --- | --- | --- |
| `summary` / `watch` | ✅ | ✅ | ✅ |
| TUI | ✅ | ✅ | ✅ |
| Painel web | ✅ | ✅ | ✅ |
| `ps` / `kill` | ✅ | ⚠️ stub | ⚠️ stub |
| `update --check` | ✅ | ✅ | ✅ |
| Instalação com `update` | ✅ | ✅ | ⚠️ somente verificação |

Observações:

- A TUI requer um TTY real.
- `ps` e `kill` são exclusivos do Linux por design.
- Builds que não são do Linux mantêm stubs não suportados para os recursos de processos.
- O Windows pode verificar atualizações, mas a auto-substituição não é suportada.
