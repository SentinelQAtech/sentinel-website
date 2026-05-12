# Deploy Vercel - SentinelQATech

## Estado atual

Projeto Vercel criado:

`sentinel-website`

Deploy manual validado:

`https://sentinel-website-rho.vercel.app`

Dominios adicionados:

- `sentinelqa.tech`
- `www.sentinelqa.tech`

Pendente:

- Liberar o Vercel GitHub App para acessar `SentinelQAtech/sentinel-website`.
- Conectar o projeto Vercel ao repositorio para deploy automatico.
- Aguardar propagacao DNS dos nameservers da Namecheap.
- Separar o site publico na raiz e o Sentinel Core em `/core`.

## Estrutura de rotas desejada

```text
sentinelqa.tech              Site publico
sentinelqa.tech/core         Sentinel Core
sentinelqa.tech/learning     Sentinel Learning
sentinelqa.tech/extension    Sentinel Extension
app.sentinelqa.tech          Redirect para sentinelqa.tech/core
```

Mais detalhes: [ROUTING_STRATEGY.md](ROUTING_STRATEGY.md).

## Build atual

O root `vercel.json` aponta para o Sentinel Core web atual:

```json
{
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build --workspace @sentinel-core/web",
  "outputDirectory": "apps/web/.next"
}
```

Quando a separacao final for ativada, o site publico deve ser o projeto da raiz do dominio e o Core deve ser publicado como zona em `/core` com:

```text
NEXT_PUBLIC_BASE_PATH=/core
```

## Comandos uteis

Usar no PowerShell:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npx.cmd vercel whoami
npx.cmd vercel domains inspect sentinelqa.tech --scope castilho-raphael-5448s-projects
npx.cmd vercel domains inspect www.sentinelqa.tech --scope castilho-raphael-5448s-projects
```

Deploy manual:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npx.cmd vercel --prod --scope castilho-raphael-5448s-projects
```

## Quando liberar o GitHub App

1. Abrir o projeto `sentinel-website` no Vercel.
2. Entrar em Settings > Git.
3. Conectar `SentinelQAtech/sentinel-website`.
4. Confirmar branch de producao: `main`.
5. Validar que o build command continua:

```text
npm run build --workspace @sentinel-core/web
```

6. Fazer um commit pequeno para testar deploy automatico.

## Observacao importante

Enquanto o DNS propaga, o dominio pode alternar entre erro e sucesso. O prazo comum e de minutos a algumas horas, mas o provedor informa ate 48 horas.
