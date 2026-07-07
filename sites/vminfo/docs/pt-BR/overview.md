---
title: Visão geral
description: O que o vminfo faz e quais métricas do host ele coleta.
---

# Visão geral

O vminfo é um kit de ferramentas multiplataforma de informações de tempo de execução do host para diagnósticos locais rápidos.

## O que ele oferece

- **TUI** — um painel de terminal em tela cheia
- **Saída JSON** — instantâneos e fluxos contínuos amigáveis para scripts
- **Painel web** — uma interface leve no navegador com endpoints REST e WebSocket
- **Biblioteca Go** — APIs importáveis de coleta de métricas e APIs de TUI embutido

## Métricas coletadas

O vminfo coleta:

- uso de CPU, uso por núcleo, frequência da CPU
- uso de memória e swap
- uso de disco e E/S de disco
- totais de rede, velocidades, contagens TCP/UDP
- distribuição de estados TCP (`ESTABLISHED` / `TIME_WAIT` / `SYN_RECV` / …) e uso de conntrack (Linux)
- tráfego, erros e descartes por interface
- listas de processos e metadados de processos
- leituras de temperatura
- tempo de atividade e metadados do host

## Tipos Go públicos

- `StaticInfo`
- `RuntimeStats`
- `Snapshot`
- `ProcessInfo`
- `AppMetadata`

## Pontos de entrada comuns

- `vminfo`
- `vminfo info`
- `vminfo summary`
- `vminfo watch`
- `vminfo --web`
- `vminfo ps`
- `vminfo kill <pid>`
- `vminfo net dns | port | ping | ip`
- `vminfo update`

## Casos de uso ideais

O vminfo é uma boa opção quando você quer:

- um único binário para inspeção rápida do host
- uma interface de terminal legível para trabalho interativo
- JSON para scripts, CI ou automação
- um painel no navegador sem executar uma pilha de monitoramento
- uma biblioteca Go que você possa embutir em outra CLI
