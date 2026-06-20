# Daily Integration Recovery Design

## Objetivo

Restabelecer o Daily como fonte operacional do dia, garantindo que sessoes Supabase restauradas recuperem o JWT interno, que QA Items sejam enviados ao Daily com feedback real e que Calendar e Daily compartilhem `daily_meetings` como fonte unica para reunioes.

## Causas raiz

1. O Core restaura o usuario pelo Supabase, mas nao valida nem recompõe o JWT interno da API. Logs production mostraram `GET/POST /api/v1/qa-items` retornando 401 enquanto a UI permanecia autenticada.
2. As acoes de QA anunciam sucesso antes da mutation ou nao apresentam erro visivel.
3. Calendar persiste reunioes apenas em `localStorage`, enquanto Daily le exclusivamente `/daily/meetings`.

## Desenho

### Sessao restaurada

Ao carregar uma sessao Supabase, o Core valida o JWT interno existente em `/auth/me`. Se estiver ausente ou invalido, usa o access token Supabase em `/auth/supabase`, persiste os novos tokens internos e confirma o usuario em `/auth/me`. Se a recomposicao falhar, a sessao nao e considerada operacional.

### QA para Daily

As acoes aguardam `mutateAsync`/callbacks reais. Sucesso e exibido somente depois da resposta 2xx; erros usam `getApiErrorMessage` e toast visivel. A invalidacao continua usando o prefixo `qaItemKeys.lists()`, atualizando Inbox e cockpit Daily.

### Calendar e Daily

`daily_meetings` passa a ser a unica fonte de reunioes. Calendar le `useDailyMeetings`, converte reunioes da API para sua apresentacao e grava novas reunioes por `useCreateDailyMeeting`. Eventos nao-reuniao permanecem no store atual.

### Migracao one-time

Na primeira abertura autenticada do Calendar:

- considerar apenas eventos locais `meeting` com data de hoje em diante;
- deduplicar por titulo normalizado, data e horario;
- criar somente reunioes ausentes na API;
- nao apagar eventos locais;
- gravar uma chave de conclusao por usuario/workspace somente apos todas as criacoes terminarem com sucesso;
- manter a migracao pendente e apresentar/logar erro se qualquer criacao falhar.

## Validacao

- testes puros para identidade/deduplicacao e selecao de eventos futuros;
- teste da recomposicao do JWT com dependencias injetadas;
- type-check e build do Core;
- smoke no Core publico com `RECOVERY-SPRINT-01-QA-DAILY-TEST` e `RECOVERY-SPRINT-01-CALENDAR-MEETING-TEST`;
- confirmar persistencia apos reload e limpeza final na API/banco.

## Fora de escopo

- Sprint 02;
- novo modelo de reunioes;
- migracao de eventos antigos ou nao-reuniao;
- exclusao do `localStorage` legado;
- redesenho das telas.
