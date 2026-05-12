# DNS - sentinelqa.tech

## Configuracao feita na Namecheap

Nameservers customizados:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Depois de salvar, a Namecheap informa que a propagacao pode levar ate 48 horas.

## Como verificar

PowerShell:

```powershell
nslookup -type=NS sentinelqa.tech
nslookup sentinelqa.tech
nslookup www.sentinelqa.tech
```

Resultado esperado para NS:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## Validacao pela Vercel

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npx.cmd vercel domains inspect sentinelqa.tech --scope castilho-raphael-5448s-projects
npx.cmd vercel domains inspect www.sentinelqa.tech --scope castilho-raphael-5448s-projects
```

## Recomendacao de dominios

| Dominio | Uso |
| --- | --- |
| `sentinelqa.tech` | Site institucional publico |
| `www.sentinelqa.tech` | Alias do site institucional |
| `app.sentinelqa.tech` | Sentinel Core |
| `learning.sentinelqa.tech` | Sentinel Learning |
| `extension.sentinelqa.tech` | Documentacao/download da extensao |

## Evitar

- Nao configurar redirect de dominio na Namecheap quando estiver usando Vercel DNS.
- Nao misturar nameservers Namecheap BasicDNS com records manuais da Vercel.
- Nao criar dominios duplicados em varios projetos Vercel.
