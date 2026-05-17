# Sentinel QA Sync — Chrome Extension

Captura cards QA visíveis em boards Jira e sincroniza com o Sentinel Core.

**Sem tokens Jira. Sem autenticação. Sem dados de senha.**  
Lê apenas o que já está visível na tela.

---

## Como instalar (modo desenvolvedor)

1. Abra o Chrome → `chrome://extensions/`
2. Ative **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `sentinel-extension/`
5. O ícone aparece na barra do Chrome

---

## Como usar

1. Configure a extensão: clique no ícone → botão ⚙️
   - **Sentinel URL**: URL do seu Sentinel online (ex: `https://meusentinel.vercel.app`)
   - **Sync Token** (opcional): valor de `QA_SYNC_TOKEN` no `.env` do Sentinel
2. Abra um board Jira com colunas "QA", "Testing" ou "Ready for QA" visíveis
3. Clique no ícone da extensão → **Sincronizar cards QA**
4. No Sentinel → QA Importer → aba **Extensão** → **Pull da Extensão**

---

## Colunas detectadas automaticamente

A extensão captura colunas cujo nome contém:

| Keyword | Exemplos |
|---------|---------|
| `qa` | READY QA, IN QA, QA Review |
| `test` | TESTING QA, In Testing |
| `review` | Code Review, QA Review |
| `blocked` | Blocked, Bloqueado |
| `homolog` | Homologação |
| `validat` | Validation |

---

## Dados capturados por card

| Campo | Fonte no DOM |
|-------|-------------|
| `issueKey` | Link `/browse/XXX-000` |
| `title` | Texto do card (excluindo meta) |
| `status` | Nome da coluna |
| `priority` | Atributo `alt`/`aria-label` do ícone |
| `assignee` | `alt` do avatar |
| `link` | URL completa do Jira issue |
| `notes` | Labels/epics coloridos |

---

## Variável de ambiente no Sentinel

Para proteger a rota `/api/qa-import`, defina no `.env`:

```
QA_SYNC_TOKEN=sua-chave-secreta-aqui
```

Configure o mesmo valor no campo **Sync Token** da extensão.

Se `QA_SYNC_TOKEN` não estiver definido, a rota aceita qualquer requisição.

---

## Estrutura de arquivos

```
sentinel-extension/
├── manifest.json       — Manifest V3
├── content-script.js   — Lê o DOM do board Jira
├── background.js       — Service worker mínimo
├── popup.html          — Interface da extensão
├── popup.js            — Lógica do popup
├── popup.css           — Estilos (tema Sentinel)
└── README.md
```

---

## Compatibilidade

- Jira Software (team-managed / next-gen boards)
- Jira Software (classic boards)
- Atlassian Cloud (`*.atlassian.net`)
- Chrome 114+ (Manifest V3)
