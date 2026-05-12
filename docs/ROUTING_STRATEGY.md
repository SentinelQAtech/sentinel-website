# Routing strategy - sentinelqa.tech

Objetivo:

```text
sentinelqa.tech              Site publico Sentinel Tech - QA
sentinelqa.tech/core         Sentinel Core
sentinelqa.tech/learning     Sentinel Learning
sentinelqa.tech/extension    Sentinel Extension
app.sentinelqa.tech          Redirect para sentinelqa.tech/core
```

## Estrategia recomendada

Usar Vercel Multi-Zones:

- Um projeto Vercel para o site publico, servindo `apps/website`.
- Um projeto Vercel para o Sentinel Core, servindo `apps/web` com `NEXT_PUBLIC_BASE_PATH=/core`.
- Um projeto Vercel para o Learning, servindo `apps/learning` com `NEXT_PUBLIC_BASE_PATH=/learning` quando ele for preparado para base path.
- A extensao fica versionada em `apps/extension`; a rota `/extension` deve ser uma pagina publica de download/instrucoes.

## Sentinel Core

O app `apps/web` ja suporta base path via variavel:

```text
NEXT_PUBLIC_BASE_PATH=/core
```

No projeto Vercel do Core:

```text
Root Directory: apps/web
Build Command: npm run build
Output Directory: .next
Environment Variable: NEXT_PUBLIC_BASE_PATH=/core
```

## Site publico

O projeto Vercel do site publico deve receber:

```text
Domain: sentinelqa.tech
Domain: www.sentinelqa.tech
Domain: app.sentinelqa.tech
```

Regras:

- `sentinelqa.tech` serve o site publico.
- `sentinelqa.tech/core/:path*` reescreve para a origem do projeto Sentinel Core.
- `app.sentinelqa.tech/:path*` redireciona para `https://sentinelqa.tech/core/:path*`.

## Ordem de ativacao

1. Criar/ajustar projeto Vercel do Sentinel Core.
2. Definir `NEXT_PUBLIC_BASE_PATH=/core`.
3. Validar URL direta do Core em `/core`.
4. Criar/ajustar projeto Vercel do site publico.
5. Apontar `sentinelqa.tech` e `www.sentinelqa.tech` para o site publico.
6. Configurar rewrite `/core/:path*` para o projeto Core.
7. Configurar redirect de `app.sentinelqa.tech` para `sentinelqa.tech/core`.

## Observacao

Nao devemos mover as rotas internas do Core manualmente para uma pasta `/core`. O `basePath` do Next resolve isso no build e reduz o risco de quebrar imports, links e rotas.
