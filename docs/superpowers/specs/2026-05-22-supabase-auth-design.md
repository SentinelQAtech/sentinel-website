# Supabase Auth — Design Spec

**Data:** 2026-05-22  
**Scope:** Autenticação do Sentinel Core (apps/core + apps/api)  
**Status:** Aprovado para implementação

---

## Contexto

O Sentinel Core é uma ferramenta interna de QA. Atualmente usa mock auth via Zustand + localStorage (sem backend real). O objetivo é substituir por Supabase Auth com verificação server-side, eliminando os riscos do localStorage e centralizando a gestão de usuários.

**Projeto Supabase:** SENTINEL_Core (já criado)

---

## Decisões arquiteturais

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Auth provider | Supabase | Familiaridade do time, admin via dashboard, sem backend próprio de auth |
| Integração Next.js | `@supabase/ssr` com middleware server-side | HTTP-only cookies, proteção antes de renderizar |
| Integração NestJS | Verificação via Supabase JWKS | Zero infraestrutura de auth própria, reutiliza JWT do Supabase |
| Armazenamento de roles | `user_metadata` no Supabase | Viaja no JWT, sem query extra por request |
| Registro de usuários | Desativado — admin cria via Supabase Dashboard | Ferramenta interna, sem auto-cadastro |
| Primeiro acesso | Senha temporária + force_password_change obrigatória | Mais controle, mais seguro |

---

## Fluxo de usuários

### Criação de conta (admin)
1. Admin acessa Supabase Dashboard → Authentication → Users → "Invite user"
2. Define email + senha temporária
3. Em `user_metadata` adiciona:
   ```json
   {
     "role": "QA_ANALYST",
     "force_password_change": true
   }
   ```
4. Comunica email + senha temporária ao usuário por canal seguro

### Primeiro acesso
1. Usuário acessa `/core` → middleware redireciona para `/login`
2. Faz login com email + senha temporária
3. Supabase valida → sessão salva em HTTP-only cookie
4. Middleware detecta `force_password_change: true` no `user_metadata`
5. Redireciona para `/change-password` — bloqueado de acessar qualquer outra rota
6. Usuário define nova senha
7. Sistema atualiza `force_password_change: false` via Supabase Admin API
8. Redireciona para `/dashboard`

### Login normal
1. Usuário acessa `/login`, entra com credenciais
2. Supabase valida → HTTP-only cookie com access + refresh token
3. Middleware verifica cookie no servidor → libera dashboard
4. Access token dura 1h, refresh automático transparente

### Esqueci minha senha
1. Usuário clica "Forgot password" no login
2. Digita email → Supabase envia link de reset
3. Clica no link → abre `/change-password?type=recovery` com token na URL
4. Define nova senha → redirecionado para `/login`

### Request autenticado ao NestJS
```
Browser → Authorization: Bearer <supabase_access_token>
  └─ NestJS JwtStrategy valida via Supabase JWKS
     └─ Extrai { sub, email, role } do JWT
        └─ JwtAuthGuard libera ou rejeita endpoint
```

---

## Roles disponíveis

Definidas em `user_metadata.role` no Supabase:

| Role | Descrição |
|------|-----------|
| `ADMIN` | Acesso total |
| `PROJECT_MANAGER` | Gerencia projetos e sprints |
| `QA_ANALYST` | Testes, bugs, relatórios |
| `QA_ENGINEER` | Automação e execução |
| `DEVELOPER` | Visualização de bugs e tasks |
| `CLIENT_VIEWER` | Somente leitura |

---

## Mudanças no Core (apps/core)

### Novos arquivos
| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/lib/supabase/client.ts` | Cliente Supabase para browser (singleton) |
| `src/lib/supabase/server.ts` | Cliente Supabase para Server Components e Server Actions |
| `src/app/(auth)/change-password/page.tsx` | Tela de troca de senha (primeiro acesso + recovery) |

### Arquivos modificados
| Arquivo | Mudança |
|---------|---------|
| `src/middleware.ts` | Passa a verificar sessão Supabase em todas as rotas `/core/*`; redireciona para `/login` se não autenticado; redireciona para `/change-password` se `force_password_change: true` |
| `src/app/(auth)/login/page.tsx` | Conecta ao Supabase (`signInWithPassword`); remove dependência do mock-auth e Zustand |
| `src/app/(auth)/forgot-password/page.tsx` | Conecta ao Supabase (`resetPasswordForEmail`); remove mock |
| `src/app/(dashboard)/layout.tsx` | Remove verificação client-side de auth (passa para middleware) |

### Arquivos removidos
| Arquivo | Motivo |
|---------|--------|
| `src/app/(auth)/register/page.tsx` | Ferramenta interna — sem auto-cadastro |
| `src/store/auth.ts` | Substituído pela sessão Supabase |
| `src/lib/mock-auth.ts` | Substituído pela auth real |

### Variáveis de ambiente (apps/core/.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # apenas server-side
```

---

## Mudanças no API (apps/api)

### Arquivos modificados
| Arquivo | Mudança |
|---------|---------|
| `src/modules/auth/strategies/jwt.strategy.ts` | Verifica JWT via Supabase JWKS em vez de `JWT_SECRET` local; extrai `role` de `user_metadata` |
| `src/modules/auth/auth.module.ts` | Remove `PassportModule` local strategy; mantém JWT strategy |

### Arquivos removidos
| Arquivo | Motivo |
|---------|--------|
| `src/modules/auth/guards/local-auth.guard.ts` | Supabase faz o login — LocalGuard não é mais usado |
| `src/modules/auth/strategies/local.strategy.ts` | Idem |

### Métodos removidos do AuthService
- `login()` — Supabase cuida disso
- `register()` — sem auto-cadastro
- `refreshTokens()` — Supabase cuida disso
- `logout()` — Supabase cuida disso (client-side `signOut`)

### Rotas removidas do AuthController
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me` — substituído pela sessão Supabase no Core

### O que permanece intacto
- `JwtAuthGuard` em todos os controllers de negócio
- Todos os módulos: bugs, projetos, sprints, tasks, reports, notifications
- Prisma schema e banco de dados
- ThrottlerGuard e rate limiting

### Variáveis de ambiente (apps/api/.env)
```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_JWT_SECRET=<jwt-secret-from-supabase-dashboard>
```

> O `SUPABASE_JWT_SECRET` é encontrado em: Supabase Dashboard → Project Settings → API → JWT Secret. Ele substitui o `JWT_SECRET` atual.

---

## Pacotes necessários

### apps/core
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### apps/api
```bash
npm install jwks-rsa  # para verificar JWT via JWKS endpoint
```

---

## O que NÃO muda

- Design visual das telas de login e forgot-password (UI permanece igual)
- Toda a lógica de negócio do NestJS
- Prisma schema
- Deploy no Vercel
- Rate limiting e security headers já configurados
