import { PrismaClient, Role, ProjectStatus, Priority, TaskStatus, BugSeverity, BugStatus, SprintStatus, NotificationType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const PASSWORD = 'senha123'
const NOW = new Date()
const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000

function daysAgo(n: number): Date {
  return new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000)
}

function daysFromNow(n: number): Date {
  return new Date(NOW.getTime() + n * 24 * 60 * 60 * 1000)
}

async function main() {
  console.log('🌱 Seeding database...')

  const passwordHash = await bcrypt.hash(PASSWORD, 10)

  // ── Users ──────────────────────────────────────────────────────────────────
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user-raphael',
        email: 'Castilho_raphael@hotmail.com',
        username: 'raphacastilho',
        name: 'Raphael Castilho',
        role: Role.ADMIN,
        passwordHash,
        isActive: true,
        lastSeen: NOW,
        createdAt: daysAgo(60),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-antonio',
        email: 'antonio@sentinel.tech',
        username: 'antoniosilva',
        name: 'Antonio Silva',
        role: Role.ADMIN,
        passwordHash,
        isActive: true,
        lastSeen: NOW,
        createdAt: daysAgo(60),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-maria',
        email: 'maria@sentinel.tech',
        username: 'mariasantos',
        name: 'Maria Santos',
        role: Role.QA_ENGINEER,
        passwordHash,
        isActive: true,
        lastSeen: daysAgo(1),
        createdAt: daysAgo(45),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-joao',
        email: 'joao@sentinel.tech',
        username: 'joaopereira',
        name: 'João Pereira',
        role: Role.DEVELOPER,
        passwordHash,
        isActive: true,
        lastSeen: daysAgo(2),
        createdAt: daysAgo(30),
      },
    }),
    prisma.user.create({
      data: {
        id: 'user-ana',
        email: 'ana@sentinel.tech',
        username: 'anacosta',
        name: 'Ana Costa',
        role: Role.PROJECT_MANAGER,
        passwordHash,
        isActive: true,
        lastSeen: daysAgo(1),
        createdAt: daysAgo(30),
      },
    }),
  ])

  console.log(`  ✓ ${users.length} users created`)

  // ── Projects ───────────────────────────────────────────────────────────────
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        id: 'proj-sentinel-core',
        name: 'Sentinel Core',
        description: 'Plataforma interna de operações de QA — gestão de projetos, bugs, sprints e times.',
        status: ProjectStatus.ACTIVE,
        priority: Priority.CRITICAL,
        startDate: daysAgo(60),
        progress: 65,
        tags: ['internal', 'platform', 'qa'],
        clientName: 'Sentinel Tech',
        coverColor: '#6366f1',
        ownerId: 'user-raphael',
      },
    }),
    prisma.project.create({
      data: {
        id: 'proj-portal-uol',
        name: 'Portal UOL',
        description: 'Testes de regressão e validação de qualidade para o portal UOL — seções de notícias, esportes e entretenimento.',
        status: ProjectStatus.ACTIVE,
        priority: Priority.HIGH,
        startDate: daysAgo(45),
        progress: 40,
        tags: ['client', 'portal', 'regression'],
        clientName: 'UOL',
        coverColor: '#ef4444',
        ownerId: 'user-antonio',
      },
    }),
    prisma.project.create({
      data: {
        id: 'proj-ecommerce-concepta',
        name: 'E-commerce Concepta',
        description: 'Validação de fluxos de compra, checkout e pagamento para plataforma de e-commerce.',
        status: ProjectStatus.ACTIVE,
        priority: Priority.MEDIUM,
        startDate: daysAgo(30),
        progress: 25,
        tags: ['client', 'ecommerce', 'checkout'],
        clientName: 'Concepta',
        coverColor: '#3b82f6',
        ownerId: 'user-ana',
      },
    }),
  ])

  console.log(`  ✓ ${projects.length} projects created`)

  // ── Project Members ────────────────────────────────────────────────────────
  await Promise.all([
    prisma.projectMember.create({ data: { projectId: 'proj-sentinel-core', userId: 'user-raphael', role: Role.ADMIN } }),
    prisma.projectMember.create({ data: { projectId: 'proj-sentinel-core', userId: 'user-antonio', role: Role.ADMIN } }),
    prisma.projectMember.create({ data: { projectId: 'proj-sentinel-core', userId: 'user-maria', role: Role.QA_ENGINEER } }),
    prisma.projectMember.create({ data: { projectId: 'proj-sentinel-core', userId: 'user-joao', role: Role.DEVELOPER } }),
    prisma.projectMember.create({ data: { projectId: 'proj-sentinel-core', userId: 'user-ana', role: Role.PROJECT_MANAGER } }),
    prisma.projectMember.create({ data: { projectId: 'proj-portal-uol', userId: 'user-antonio', role: Role.ADMIN } }),
    prisma.projectMember.create({ data: { projectId: 'proj-portal-uol', userId: 'user-maria', role: Role.QA_ENGINEER } }),
    prisma.projectMember.create({ data: { projectId: 'proj-portal-uol', userId: 'user-joao', role: Role.DEVELOPER } }),
    prisma.projectMember.create({ data: { projectId: 'proj-ecommerce-concepta', userId: 'user-ana', role: Role.PROJECT_MANAGER } }),
    prisma.projectMember.create({ data: { projectId: 'proj-ecommerce-concepta', userId: 'user-maria', role: Role.QA_ENGINEER } }),
    prisma.projectMember.create({ data: { projectId: 'proj-ecommerce-concepta', userId: 'user-joao', role: Role.DEVELOPER } }),
  ])

  // ── Sprints ────────────────────────────────────────────────────────────────
  await Promise.all([
    // Sentinel Core — Sprint 1 (completed) e Sprint 2 (active)
    prisma.sprint.create({
      data: {
        id: 'sprint-core-1',
        name: 'Sprint 1 — Fundação',
        goal: 'Estabelecer base da plataforma — CRUD de projetos, autenticação e dashboard inicial.',
        status: SprintStatus.COMPLETED,
        startDate: daysAgo(45),
        endDate: daysAgo(31),
        velocity: 85,
        capacity: 100,
        projectId: 'proj-sentinel-core',
        members: {
          create: [
            { userId: 'user-raphael' },
            { userId: 'user-antonio' },
            { userId: 'user-maria' },
          ],
        },
      },
    }),
    prisma.sprint.create({
      data: {
        id: 'sprint-core-2',
        name: 'Sprint 2 — QA Flow',
        goal: 'Implementar fluxo completo de QA — board Kanban, bugs, relatórios e integração com API.',
        status: SprintStatus.ACTIVE,
        startDate: daysAgo(14),
        endDate: daysFromNow(14),
        velocity: 0,
        capacity: 90,
        projectId: 'proj-sentinel-core',
        members: {
          create: [
            { userId: 'user-raphael' },
            { userId: 'user-antonio' },
            { userId: 'user-maria' },
            { userId: 'user-joao' },
            { userId: 'user-ana' },
          ],
        },
      },
    }),
    // Portal UOL
    prisma.sprint.create({
      data: {
        id: 'sprint-uol-1',
        name: 'Sprint UOL 1 — Regressão Inicial',
        goal: 'Executar bateria de testes de regressão nas seções principais do portal.',
        status: SprintStatus.ACTIVE,
        startDate: daysAgo(7),
        endDate: daysFromNow(21),
        velocity: 0,
        capacity: 80,
        projectId: 'proj-portal-uol',
        members: {
          create: [
            { userId: 'user-maria' },
            { userId: 'user-joao' },
          ],
        },
      },
    }),
    // E-commerce Concepta
    prisma.sprint.create({
      data: {
        id: 'sprint-concepta-1',
        name: 'Sprint Concepta 1 — Checkout',
        goal: 'Validar fluxo completo de checkout — carrinho, pagamento e confirmação.',
        status: SprintStatus.PLANNING,
        startDate: daysFromNow(7),
        endDate: daysFromNow(35),
        projectId: 'proj-ecommerce-concepta',
        members: {
          create: [
            { userId: 'user-maria' },
            { userId: 'user-joao' },
          ],
        },
      },
    }),
  ])

  console.log('  ✓ Sprints created')

  // ── Tasks ──────────────────────────────────────────────────────────────────
  const taskData = [
    // Sentinel Core tasks
    { id: 'task-core-1',  title: 'Criar schema do banco de dados',                status: TaskStatus.DONE,        projectId: 'proj-sentinel-core', sprintId: 'sprint-core-1', assigneeId: 'user-antonio', creatorId: 'user-raphael', priority: Priority.CRITICAL, order: 1, storyPoints: 8 },
    { id: 'task-core-2',  title: 'Implementar autenticação JWT',                  status: TaskStatus.DONE,        projectId: 'proj-sentinel-core', sprintId: 'sprint-core-1', assigneeId: 'user-antonio', creatorId: 'user-raphael', priority: Priority.CRITICAL, order: 2, storyPoints: 13 },
    { id: 'task-core-3',  title: 'CRUD de projetos',                              status: TaskStatus.DONE,        projectId: 'proj-sentinel-core', sprintId: 'sprint-core-1', assigneeId: 'user-joao',    creatorId: 'user-antonio', priority: Priority.HIGH,    order: 3, storyPoints: 8 },
    { id: 'task-core-4',  title: 'Dashboard com métricas',                        status: TaskStatus.DONE,        projectId: 'proj-sentinel-core', sprintId: 'sprint-core-1', assigneeId: 'user-joao',    creatorId: 'user-antonio', priority: Priority.HIGH,    order: 4, storyPoints: 5 },
    { id: 'task-core-5',  title: 'Board Kanban drag-and-drop',                    status: TaskStatus.IN_PROGRESS, projectId: 'proj-sentinel-core', sprintId: 'sprint-core-2', assigneeId: 'user-joao',    creatorId: 'user-antonio', priority: Priority.HIGH,    order: 5, storyPoints: 8 },
    { id: 'task-core-6',  title: 'Integração com API de bugs',                    status: TaskStatus.TODO,        projectId: 'proj-sentinel-core', sprintId: 'sprint-core-2', assigneeId: 'user-maria',   creatorId: 'user-antonio', priority: Priority.HIGH,    order: 6, storyPoints: 5 },
    { id: 'task-core-7',  title: 'Relatórios de qualidade',                       status: TaskStatus.QA_TESTING,  projectId: 'proj-sentinel-core', sprintId: 'sprint-core-2', assigneeId: 'user-maria',   creatorId: 'user-ana',     priority: Priority.MEDIUM,  order: 7, storyPoints: 3 },
    { id: 'task-core-8',  title: 'Notificações em tempo real',                    status: TaskStatus.BACKLOG,     projectId: 'proj-sentinel-core', sprintId: 'sprint-core-2', assigneeId: 'user-joao',    creatorId: 'user-ana',     priority: Priority.MEDIUM,  order: 8, storyPoints: 8 },

    // Portal UOL tasks
    { id: 'task-uol-1',   title: 'Mapear seções do portal',                       status: TaskStatus.DONE,        projectId: 'proj-portal-uol',    sprintId: 'sprint-uol-1', assigneeId: 'user-maria',   creatorId: 'user-antonio', priority: Priority.HIGH,    order: 1, storyPoints: 3 },
    { id: 'task-uol-2',   title: 'Scripts de teste de regressão — home',          status: TaskStatus.IN_PROGRESS, projectId: 'proj-portal-uol',    sprintId: 'sprint-uol-1', assigneeId: 'user-maria',   creatorId: 'user-antonio', priority: Priority.HIGH,    order: 2, storyPoints: 8 },
    { id: 'task-uol-3',   title: 'Testes de performance — seção de esportes',     status: TaskStatus.TODO,        projectId: 'proj-portal-uol',    sprintId: 'sprint-uol-1', assigneeId: 'user-joao',    creatorId: 'user-antonio', priority: Priority.MEDIUM,  order: 3, storyPoints: 5 },
    { id: 'task-uol-4',   title: 'Validar responsividade mobile',                 status: TaskStatus.BACKLOG,     projectId: 'proj-portal-uol',    sprintId: 'sprint-uol-1', assigneeId: 'user-maria',   creatorId: 'user-antonio', priority: Priority.MEDIUM,  order: 4, storyPoints: 5 },

    // Concepta tasks
    { id: 'task-concepta-1', title: 'Mapear fluxo de checkout',                   status: TaskStatus.DONE,        projectId: 'proj-ecommerce-concepta', creatorId: 'user-ana', priority: Priority.HIGH,    order: 1, storyPoints: 3 },
    { id: 'task-concepta-2', title: 'Validar cálculo de frete',                   status: TaskStatus.BACKLOG,     projectId: 'proj-ecommerce-concepta', creatorId: 'user-ana', priority: Priority.HIGH,    order: 2, storyPoints: 5 },
    { id: 'task-concepta-3', title: 'Testar integração com gateway de pagamento', status: TaskStatus.BACKLOG,     projectId: 'proj-ecommerce-concepta', creatorId: 'user-ana', priority: Priority.CRITICAL, order: 3, storyPoints: 13 },
  ]

  for (const t of taskData) {
    await prisma.task.create({ data: t })
  }
  console.log(`  ✓ ${taskData.length} tasks created`)

  // ── Bugs ───────────────────────────────────────────────────────────────────
  const nowISO = NOW.toISOString()

  const bugData = [
    // Sentinel Core bugs
    { id: 'bug-core-1',  bugId: 'BUG-001', title: 'Erro ao salvar projeto sem descrição',                   severity: BugSeverity.MEDIUM,  status: BugStatus.RESOLVED,   projectId: 'proj-sentinel-core', sprintId: 'sprint-core-1', reporterId: 'user-maria',   assigneeId: 'user-joao',    resolvedAt: daysAgo(20).toISOString(), buildVersion: 'v0.1.0' },
    { id: 'bug-core-2',  bugId: 'BUG-002', title: 'Dashboard não carrega métricas do sprint',              severity: BugSeverity.HIGH,    status: BugStatus.IN_PROGRESS, projectId: 'proj-sentinel-core', sprintId: 'sprint-core-2', reporterId: 'user-ana',     assigneeId: 'user-joao',    buildVersion: 'v0.2.0' },
    { id: 'bug-core-3',  bugId: 'BUG-003', title: 'Modal de criação de bug não fecha ao salvar',           severity: BugSeverity.LOW,     status: BugStatus.OPEN,       projectId: 'proj-sentinel-core', sprintId: 'sprint-core-2', reporterId: 'user-maria',   assigneeId: undefined,      buildVersion: 'v0.2.0' },
    { id: 'bug-core-4',  bugId: 'BUG-004', title: 'Filtro por status no board retorna resultados errados', severity: BugSeverity.CRITICAL, status: BugStatus.IN_REVIEW,  projectId: 'proj-sentinel-core', sprintId: 'sprint-core-2', reporterId: 'user-antonio',  assigneeId: 'user-maria',   buildVersion: 'v0.2.1' },
    { id: 'bug-core-5',  bugId: 'BUG-005', title: 'Gráfico de tendências não atualiza após novo bug',      severity: BugSeverity.MEDIUM,  status: BugStatus.OPEN,       projectId: 'proj-sentinel-core', sprintId: 'sprint-core-2', reporterId: 'user-raphael',  assigneeId: undefined,      buildVersion: 'v0.2.1' },
    { id: 'bug-core-6',  bugId: 'BUG-006', title: 'Timeout na conexão WebSocket após 5 minutos',           severity: BugSeverity.HIGH,    status: BugStatus.IN_PROGRESS, projectId: 'proj-sentinel-core', reporterId: 'user-joao',    assigneeId: 'user-antonio', buildVersion: 'v0.2.0' },

    // Portal UOL bugs
    { id: 'bug-uol-1',   bugId: 'UOL-001', title: 'Carrossel de notícias não avança no Safari',            severity: BugSeverity.HIGH,    status: BugStatus.OPEN,       projectId: 'proj-portal-uol',    sprintId: 'sprint-uol-1', reporterId: 'user-maria',   assigneeId: 'user-joao',    buildVersion: 'v3.2.1' },
    { id: 'bug-uol-2',   bugId: 'UOL-002', title: 'Busca não retorna resultados para termos acentuados',   severity: BugSeverity.MEDIUM,  status: BugStatus.IN_PROGRESS, projectId: 'proj-portal-uol',    sprintId: 'sprint-uol-1', reporterId: 'user-antonio',  assigneeId: 'user-joao',    buildVersion: 'v3.2.1' },
    { id: 'bug-uol-3',   bugId: 'UOL-003', title: 'Vídeo incorporado não reproduz em mobile',              severity: BugSeverity.CRITICAL, status: BugStatus.OPEN,       projectId: 'proj-portal-uol',    sprintId: 'sprint-uol-1', reporterId: 'user-maria',   assigneeId: undefined,      buildVersion: 'v3.2.0' },
    { id: 'bug-uol-4',   bugId: 'UOL-004', title: 'Menu hamburguer não abre em resolução < 768px',         severity: BugSeverity.HIGH,    status: BugStatus.IN_REVIEW,  projectId: 'proj-portal-uol',    sprintId: 'sprint-uol-1', reporterId: 'user-maria',   assigneeId: 'user-joao',    buildVersion: 'v3.2.0' },
    { id: 'bug-uol-5',   bugId: 'UOL-005', title: 'Anúncio overlay cobre conteúdo principal',              severity: BugSeverity.MEDIUM,  status: BugStatus.WONT_FIX,   projectId: 'proj-portal-uol',    reporterId: 'user-antonio',  assigneeId: undefined,      buildVersion: 'v3.2.1' },

    // E-commerce Concepta bugs
    { id: 'bug-concepta-1', bugId: 'CON-001', title: 'Carrinho não persiste itens ao logar',                severity: BugSeverity.CRITICAL, status: BugStatus.OPEN,       projectId: 'proj-ecommerce-concepta', reporterId: 'user-maria', assigneeId: undefined,    buildVersion: 'v1.0.0' },
    { id: 'bug-concepta-2', bugId: 'CON-002', title: 'Cupom de desconto expirado ainda é aceito',           severity: BugSeverity.HIGH,    status: BugStatus.OPEN,       projectId: 'proj-ecommerce-concepta', reporterId: 'user-ana',   assigneeId: 'user-joao',    buildVersion: 'v1.0.0' },
    { id: 'bug-concepta-3', bugId: 'CON-003', title: 'Erro 500 ao finalizar compra com boleto',             severity: BugSeverity.CRITICAL, status: BugStatus.IN_PROGRESS, projectId: 'proj-ecommerce-concepta', reporterId: 'user-maria', assigneeId: 'user-joao',    buildVersion: 'v1.0.1' },
    { id: 'bug-concepta-4', bugId: 'CON-004', title: 'Imagens dos produtos não carregam no catálogo',       severity: BugSeverity.HIGH,    status: BugStatus.RESOLVED,   projectId: 'proj-ecommerce-concepta', reporterId: 'user-maria', assigneeId: 'user-joao',    resolvedAt: daysAgo(1).toISOString(), buildVersion: 'v1.0.1' },
    { id: 'bug-concepta-5', bugId: 'CON-005', title: 'Tela de confirmação não exibe valor total',           severity: BugSeverity.MEDIUM,  status: BugStatus.CLOSED,     projectId: 'proj-ecommerce-concepta', reporterId: 'user-ana',   assigneeId: 'user-joao',    resolvedAt: daysAgo(2).toISOString(), buildVersion: 'v1.0.1' },
  ]

  for (const b of bugData) {
    await prisma.bug.create({
      data: {
        id: b.id,
        bugId: b.bugId,
        title: b.title,
        description: buildBugDescription(b.title, b.buildVersion),
        severity: b.severity,
        priority: b.severity === BugSeverity.CRITICAL ? Priority.CRITICAL : b.severity === BugSeverity.HIGH ? Priority.HIGH : Priority.MEDIUM,
        status: b.status,
        environment: b.buildVersion,
        stepsToReproduce: `1. Acessar a aplicação\n2. Navegar até a funcionalidade afetada\n3. Realizar a ação descrita\n4. Observar o comportamento inesperado`,
        expectedBehavior: 'O sistema deve funcionar conforme especificado nos requisitos funcionais.',
        actualBehavior: 'O sistema apresenta comportamento divergente do esperado, conforme descrito no título do bug.',
        browserInfo: 'Chrome 125 / Firefox 126 / Safari 17.5',
        osInfo: 'Windows 11 / macOS Sonoma',
        tags: b.severity === BugSeverity.CRITICAL ? ['regression', 'critical', 'p0'] : b.severity === BugSeverity.HIGH ? ['regression', 'high'] : ['minor'],
        projectId: b.projectId,
        assigneeId: b.assigneeId || null,
        reporterId: b.reporterId,
        sprintId: b.sprintId || null,
        resolvedAt: b.resolvedAt ? new Date(b.resolvedAt) : null,
      },
    })
  }
  console.log(`  ✓ ${bugData.length} bugs created`)

  // ── Comments ───────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.comment.create({ data: { content: 'Bug confirmado. Estou reproduzindo em ambiente de staging.',                            authorId: 'user-joao',    bugId: 'bug-core-1' } }),
    prisma.comment.create({ data: { content: 'Corrigido no PR #142. Aguardando deploy em produção.',                                  authorId: 'user-joao',    bugId: 'bug-core-1' } }),
    prisma.comment.create({ data: { content: 'Testando em homologação. Issue parece estar relacionada ao cache do SWR.',              authorId: 'user-maria',   bugId: 'bug-core-2' } }),
    prisma.comment.create({ data: { content: '@joao consegue replicar esse bug em produção?',                                         authorId: 'user-raphael', bugId: 'bug-core-4' } }),
    prisma.comment.create({ data: { content: 'Sim, reproduzi em produção com os passos descritos.',                                   authorId: 'user-joao',    bugId: 'bug-core-4' } }),
    prisma.comment.create({ data: { content: 'Reportado pelo cliente via e-mail. Priorizar correção.',                                authorId: 'user-ana',     bugId: 'bug-uol-3' } }),
    prisma.comment.create({ data: { content: 'Issue conhecida do Safari 17. Estamos aplicando polyfill.',                             authorId: 'user-joao',    bugId: 'bug-uol-1' } }),
    prisma.comment.create({ data: { content: 'Time deu like, mas cliente disse que é comportamento esperado do ad server.',           authorId: 'user-antonio', bugId: 'bug-uol-5' } }),
    prisma.comment.create({ data: { content: 'Pagamento com boleto falha apenas em ambiente de produção. Logs no Sentry.',            authorId: 'user-maria',   bugId: 'bug-concepta-3' } }),
    prisma.comment.create({ data: { content: 'Corrigido. Era um problema de CORS no CDN de imagens.',                                authorId: 'user-joao',    bugId: 'bug-concepta-4' } }),
    prisma.comment.create({ data: { content: 'Validado em produção. Bug fechado.',                                                    authorId: 'user-maria',   bugId: 'bug-concepta-5' } }),
    prisma.comment.create({ data: { content: 'Task finalizada — pronto para code review.',                                            authorId: 'user-joao',    taskId: 'task-core-1', projectId: 'proj-sentinel-core' } }),
    prisma.comment.create({ data: { content: 'Review feito. Apenas um ajuste no nome da variável.',                                  authorId: 'user-antonio', taskId: 'task-core-1', projectId: 'proj-sentinel-core' } }),
    prisma.comment.create({ data: { content: 'Vamos quebrar essa task em subtarefas menores para o próximo sprint.',                  authorId: 'user-ana',     taskId: 'task-core-8', projectId: 'proj-sentinel-core' } }),
  ])

  console.log('  ✓ Comments created')

  // ── Activity Logs ──────────────────────────────────────────────────────────
  await Promise.all([
    prisma.activityLog.create({ data: { action: 'CREATE', entityType: 'project', entityId: 'proj-sentinel-core', description: 'Projeto Sentinel Core criado', userId: 'user-raphael' } }),
    prisma.activityLog.create({ data: { action: 'CREATE', entityType: 'project', entityId: 'proj-portal-uol', description: 'Projeto Portal UOL criado', userId: 'user-antonio' } }),
    prisma.activityLog.create({ data: { action: 'CREATE', entityType: 'project', entityId: 'proj-ecommerce-concepta', description: 'Projeto E-commerce Concepta criado', userId: 'user-ana' } }),
    prisma.activityLog.create({ data: { action: 'UPDATE', entityType: 'bug', entityId: 'bug-core-1', description: 'Bug BUG-001 resolvido', userId: 'user-joao', bugId: 'bug-core-1' } }),
    prisma.activityLog.create({ data: { action: 'UPDATE', entityType: 'bug', entityId: 'bug-core-4', description: 'Bug BUG-004 movido para IN_REVIEW', userId: 'user-maria', bugId: 'bug-core-4' } }),
    prisma.activityLog.create({ data: { action: 'CREATE', entityType: 'sprint', entityId: 'sprint-core-2', description: 'Sprint 2 — QA Flow iniciada', userId: 'user-raphael' } }),
    prisma.activityLog.create({ data: { action: 'UPDATE', entityType: 'task', entityId: 'task-core-5', description: 'Task "Board Kanban drag-and-drop" iniciada', userId: 'user-joao', taskId: 'task-core-5' } }),
    prisma.activityLog.create({ data: { action: 'UPDATE', entityType: 'bug', entityId: 'bug-concepta-3', description: 'Bug CON-003 em andamento', userId: 'user-maria', bugId: 'bug-concepta-3' } }),
    prisma.activityLog.create({ data: { action: 'ASSIGN', entityType: 'bug', entityId: 'bug-uol-3', description: 'Bug UOL-003 atribuído a João Pereira', userId: 'user-ana', bugId: 'bug-uol-3' } }),
    prisma.activityLog.create({ data: { action: 'COMMENT', entityType: 'bug', entityId: 'bug-concepta-4', description: 'Maria comentou em CON-004', userId: 'user-maria', bugId: 'bug-concepta-4' } }),
  ])

  console.log('  ✓ Activity logs created')

  // ── Notifications ──────────────────────────────────────────────────────────
  await Promise.all([
    prisma.notification.create({ data: { type: NotificationType.BUG_CREATED,  title: 'Novo bug crítico',     message: 'BUG-004 foi reportado como crítico no Sentinel Core.',     link: '/core/bugs/bug-core-4',   userId: 'user-raphael' } }),
    prisma.notification.create({ data: { type: NotificationType.ASSIGNMENT,   title: 'Bug atribuído a você', message: 'BUG-003 foi atribuído a você no Sentinel Core.',             link: '/core/bugs/bug-core-3',   userId: 'user-maria' } }),
    prisma.notification.create({ data: { type: NotificationType.STATUS_CHANGE, title: 'Bug resolvido',        message: 'CON-004 foi marcado como resolvido.',                        link: '/core/bugs/bug-concepta-4', userId: 'user-ana' } }),
    prisma.notification.create({ data: { type: NotificationType.SPRINT_START,  title: 'Sprint iniciada',      message: 'Sprint 2 — QA Flow está ativa no Sentinel Core.',             link: '/core/sprints/sprint-core-2', userId: 'user-antonio' } }),
    prisma.notification.create({ data: { type: NotificationType.MENTION,       title: 'Menção em comentário', message: '@joao foi mencionado por Raphael no bug BUG-004.',            link: '/core/bugs/bug-core-4',   userId: 'user-joao' } }),
    prisma.notification.create({ data: { type: NotificationType.COMMENT,       title: 'Novo comentário',      message: 'Antonio comentou no bug UOL-005.',                           link: '/core/bugs/bug-uol-5',    userId: 'user-maria' } }),
    prisma.notification.create({ data: { type: NotificationType.DEADLINE,      title: 'Prazo próximo',        message: 'A Sprint UOL 1 termina em 3 dias.',                          link: '/core/sprints/sprint-uol-1', userId: 'user-maria' } }),
    prisma.notification.create({ data: { type: NotificationType.BUG_CREATED,   title: 'Bug reportado',        message: 'CON-003 — Erro 500 ao finalizar compra com boleto.',          link: '/core/bugs/bug-concepta-3', userId: 'user-joao' } }),
  ])

  console.log('  ✓ Notifications created')
  console.log('')
  console.log('✅ Seed completed successfully!')
}

function buildBugDescription(title: string, buildVersion?: string): string {
  return [
    `## ${title}`,
    '',
    buildVersion ? `**Versão:** ${buildVersion}` : '',
    '',
    '### Descrição',
    'Durante os testes de QA, foi identificado um comportamento inesperado na funcionalidade descrita.',
    'O impacto varia conforme o contexto de uso, podendo afetar a experiência do usuário e a integridade dos dados.',
    '',
    '### Ambiente',
    '- Navegadores: Chrome 125, Firefox 126, Safari 17.5',
    '- Sistema: Windows 11, macOS Sonoma',
    '- Resolução: 1920x1080, 1366x768, 375x667',
    '',
    '### Informações Adicionais',
    'Logs e screenshots anexados ao ticket. O comportamento foi reproduzido em 3 de 5 tentativas.',
  ].filter(Boolean).join('\n')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
