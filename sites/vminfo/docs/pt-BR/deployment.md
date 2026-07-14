---
title: Implantação
description: Execute o painel web do vminfo com segurança localmente, por túnel SSH ou atrás de um proxy reverso HTTPS.
---

# Implantação

`vminfo --web` é um painel leve para um único host. Ele não precisa de banco de dados e não é uma plataforma central de monitoramento. Mantenha o servidor HTTP embutido dentro de um limite confiável.

## Painel apenas local

A configuração padrão e mais segura não precisa de autenticação:

```bash
vminfo --web
```

O serviço escuta em `127.0.0.1:20021`. Abra `http://127.0.0.1:20021` na mesma máquina ou verifique a API:

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
```

Sem autenticação, apenas cabeçalhos Host com `localhost` ou IP de loopback são aceitos, bloqueando DNS rebinding.

## Acesso remoto por SSH

Para administração individual, mantenha o listener em loopback e crie um túnel:

```bash
# No servidor
vminfo --web

# Na estação de trabalho
ssh -L 20021:127.0.0.1:20021 user@server
```

Depois abra `http://127.0.0.1:20021` na estação. A porta do painel não fica publicada na rede do servidor.

## Acesso por proxy reverso HTTPS

Para uma URL persistente, mantenha o vminfo em loopback e use um proxy HTTPS no mesmo host:

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token
```

`--token` sem valor gera um token aleatório e uma URL pronta para abrir. Um valor fixo também pode ser informado:

```bash
vminfo --web --bind 127.0.0.1 --port 20021 --token "$VMINFO_WEB_TOKEN"
```

O proxy deve terminar TLS, encaminhar para `127.0.0.1:20021`, preservar `Host`, definir
`X-Forwarded-Proto: https`, aceitar upgrades WebSocket em `/ws` e manter painel e API na mesma origem.

O primeiro acesso válido a `/?token=...` grava um cookie `HttpOnly`,
`SameSite=Lax` e redireciona para uma URL sem o token. Quando a requisição é reconhecida como HTTPS, o cookie também recebe `Secure`.

::: warning Segurança de transporte
O servidor embutido usa HTTP. O token controla acesso, mas não criptografa o tráfego. Não exponha a porta diretamente à Internet; use proxy HTTPS ou túnel SSH.
:::

## Bind direto em rede privada

Qualquer bind fora de loopback exige token:

```bash
vminfo --web --bind 0.0.0.0 --port 20021 --token
```

Sem `--token`, o vminfo falha ao iniciar. Restrinja as origens no firewall e lembre que a conexão continua sendo HTTP sem criptografia.

## Proteções de navegador e API

- Requisições REST e WebSocket com `Origin` devem coincidir em scheme, host e porta
- `Access-Control-Allow-Origin: *` não é retornado
- Com token, páginas, `/api/v1/*` e `/ws` exigem token ou cookie
- Clientes nativos sem `Origin` continuam compatíveis
- Diagnósticos de rede validam JSON, tamanho, número de testes e timeout

## Supervisão do processo

Use o supervisor já adotado no host, como systemd, launchd ou runtime de contêiner. Execute como usuário não root quando possível, reinicie após falhas e envie `SIGTERM` ao parar. O vminfo não instala uma definição de serviço.

## Verificação

```bash
curl -fsS http://127.0.0.1:20021/api/v1/health
curl -fsS "http://127.0.0.1:20021/api/v1/health?token=$VMINFO_WEB_TOKEN"
```

Não existe um endpoint público de health separado. Com autenticação, `/api/v1/health` também é protegido.

## Relacionado

- [Painel web](/pt-BR/web-dashboard)
- [HTTP API](/pt-BR/api)
- [Instalação](/pt-BR/installation)
- [Comando update](/pt-BR/update)
