# Deploy Vercel - Sentinel Tech - QA

## Estado definido

O repositorio oficial continua sendo:

```text
SentinelQAtech/sentinel-website
```

A estrutura correta usa dois projetos Vercel principais:

```text
sentinel-website  -> apps/website
sentinel-core     -> apps/core
```

Nao fazer deploy pela raiz do monorepo. A raiz nao possui `vercel.json` propositalmente, para evitar publicar o projeto errado.

## Projeto publico: sentinel-website

Configuracao no Vercel:

```text
Project: sentinel-website
Git Repository: SentinelQAtech/sentinel-website
Production Branch: main
Root Directory: apps/website
Build Command: npm run build
Output Directory: .
```

Dominios:

```text
sentinelqa.tech
www.sentinelqa.tech
app.sentinelqa.tech
```

Responsabilidades:

- Servir a landing page publica.
- Servir `/extension` como pagina publica simples.
- Redirecionar `/learning` para `https://learning.sentinelqa.tech/`.
- Redirecionar `app.sentinelqa.tech` para `sentinelqa.tech/core/dashboard`.
- Reescrever `/core/*` para o projeto `sentinel-core`.

O arquivo de configuracao deste projeto fica em:

```text
apps/website/vercel.json
```

## Projeto interno: sentinel-core

Configuracao no Vercel:

```text
Project: sentinel-core
Git Repository: SentinelQAtech/sentinel-website
Production Branch: main
Root Directory: apps/core
Framework: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

Environment Variables:

```text
NEXT_PUBLIC_BASE_PATH=/core
```

O arquivo de configuracao deste projeto fica em:

```text
apps/core/vercel.json
```

## Rotas esperadas

```text
https://sentinelqa.tech                    -> site publico
https://sentinelqa.tech/core               -> redirect para /core/dashboard
https://sentinelqa.tech/core/dashboard     -> Sentinel Core
https://learning.sentinelqa.tech/          -> Sentinel Learning
https://sentinelqa.tech/learning/          -> redirect para learning.sentinelqa.tech
https://sentinelqa.tech/extension/         -> Sentinel Extension
https://app.sentinelqa.tech                -> redirect para /core/dashboard
```

## Deploy manual, se necessario

Site publico:

```powershell
cd D:\DEV\01_COMPANIES\SentinelQAtech\sentinel-website\apps\website
npx.cmd vercel --prod
```

Core:

```powershell
cd D:\DEV\01_COMPANIES\SentinelQAtech\sentinel-website\apps\core
npx.cmd vercel --prod
```

## Validacao antes de deploy

Na raiz do repo:

```powershell
cd D:\DEV\01_COMPANIES\SentinelQAtech\sentinel-website
npm.cmd run build --workspace @sentinel/website
npm.cmd run build:core
npm.cmd run build:api
```

Depois do deploy, validar:

```powershell
curl.exe -k -I https://sentinelqa.tech
curl.exe -k -I https://sentinelqa.tech/core
curl.exe -k -I https://sentinelqa.tech/core/dashboard
curl.exe -k -I https://learning.sentinelqa.tech/
curl.exe -k -I https://sentinelqa.tech/learning/
curl.exe -k -I https://sentinelqa.tech/extension/
curl.exe -k -I https://app.sentinelqa.tech
```
