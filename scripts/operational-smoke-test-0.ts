type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface ApiErrorBody {
  message?: string | string[]
  error?: string
  statusCode?: number
}

interface Client {
  id: string
  name: string
  shortName: string
  status: string
  color: string
}

interface Project {
  id: string
  name: string
  clientName: string | null
}

interface Sprint {
  id: string
  name: string
  projectId: string
}

interface QAItem {
  id: string
  title: string
  sentToDaily: boolean
  dailyStatus: string | null
  workflowState: string
}

interface Bug {
  id: string
  bugId: string
  title: string
}

interface Paginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface SmokeResult {
  clientCreated: boolean
  projectCreated: boolean
  sprintCreated: boolean
  qaItemsCreated: number
  dailyItemsVisible: number
  boardItemsVisible: number
  doingWorkflowState: string
  blockedWorkflowState: string
  doneWorkflowState: string
  persistenceAfterRefreshEquivalent: boolean
  bugsEndpointLoaded: boolean
  manualUiValidationRequired: boolean
  createdIds: {
    userEmail: string
    clientId?: string
    projectId?: string
    sprintId?: string
    qaItemIds: string[]
    bugId?: string
  }
}

const API_BASE_URL = (process.env.SENTINEL_API_URL ?? 'http://localhost:3001/api/v1').replace(/\/$/, '')
const DAILY_DATE = process.env.SENTINEL_SMOKE_DATE ?? new Date().toISOString().slice(0, 10)
const RUN_ID = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)

const smokeUser = {
  email: `s0-smoke-${RUN_ID}@sentinel.local`,
  username: `s0smoke${RUN_ID}`,
  name: 'S0 Operational Smoke',
  password: 'S0Smoke123!',
}

const qaTitles = [
  'S0 QA Item — Login validation',
  'S0 QA Item — Dashboard smoke',
  'S0 QA Item — Board sync validation',
]

async function request<T>(method: HttpMethod, path: string, token?: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let details: ApiErrorBody | string = await response.text()
    try {
      details = JSON.parse(String(details)) as ApiErrorBody
    } catch {
      // Keep plain text details.
    }
    throw new Error(`${method} ${path} failed with ${response.status}: ${JSON.stringify(details)}`)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

async function authRegister() {
  return request<AuthTokens>('POST', '/auth/register', undefined, smokeUser)
}

async function authLogin() {
  return request<AuthTokens>('POST', '/auth/login', undefined, {
    email: smokeUser.email,
    password: smokeUser.password,
  })
}

function byId<T extends { id: string }>(items: T[], id: string) {
  return items.some(item => item.id === id)
}

async function runSmoke(): Promise<SmokeResult> {
  const auth = await authRegister()
  const token = auth.accessToken

  const client = await request<Client>('POST', '/clients', token, {
    name: 'S0 Client — Operational Smoke',
    shortName: 'S0',
    status: 'active',
    startedAt: DAILY_DATE,
    country: 'Brasil',
    color: '#14b8a6',
    notes: `Operational smoke test run ${RUN_ID}`,
  })

  const project = await request<Project>('POST', '/projects', token, {
    name: 'S0 Project — QA Flow',
    description: `Operational smoke test project ${RUN_ID}`,
    priority: 'HIGH',
    clientName: client.name,
    coverColor: client.color,
    tags: ['s0-smoke', RUN_ID],
  })

  const sprint = await request<Sprint>('POST', '/sprints', token, {
    name: 'S0 Sprint — Daily Board Validation',
    goal: `Validate Daily and Board sync for smoke run ${RUN_ID}`,
    status: 'PLANNING',
    startDate: DAILY_DATE,
    endDate: DAILY_DATE,
    capacity: 12,
    projectId: project.id,
  })

  const qaItems: QAItem[] = []
  for (const [index, title] of qaTitles.entries()) {
    qaItems.push(await request<QAItem>('POST', '/qa-items', token, {
      title,
      clientName: client.name,
      projectId: project.id,
      sprintId: sprint.id,
      source: 'manual',
      externalKey: `S0-${RUN_ID}-${index + 1}`,
      priority: index === 0 ? 'High' : index === 1 ? 'Medium' : 'Critical',
      category: 'Other',
      status: 'Ready for QA',
      workflowState: 'inbox',
      notes: `Created by operational smoke test ${RUN_ID}`,
      metadata: { smokeTest: 'S0', runId: RUN_ID },
    }))
  }

  const dailyItems = []
  for (const item of qaItems) {
    dailyItems.push(await request<QAItem>('POST', `/qa-items/${item.id}/send-to-daily`, token, {
      dailyDate: DAILY_DATE,
    }))
  }

  const doing = await request<QAItem>('PATCH', `/qa-items/${dailyItems[0].id}/daily-status`, token, {
    dailyStatus: 'doing',
  })
  const blocked = await request<QAItem>('PATCH', `/qa-items/${dailyItems[1].id}/daily-status`, token, {
    dailyStatus: 'blocked',
  })
  const done = await request<QAItem>('PATCH', `/qa-items/${dailyItems[2].id}/daily-status`, token, {
    dailyStatus: 'done',
  })

  const bug = await request<Bug>('POST', '/bugs', token, {
    title: 'S0 Bug — Blocked validation evidence',
    description: `Bug evidence created by operational smoke test ${RUN_ID}.`,
    severity: 'HIGH',
    priority: 'HIGH',
    projectId: project.id,
    sprintId: sprint.id,
    environment: 'Operational smoke test',
    stepsToReproduce: 'Run S0 operational smoke test and inspect blocked QA item.',
    expectedBehavior: 'Blocked QA item has supporting evidence.',
    actualBehavior: 'Bug was created and linked to the smoke project.',
    tags: ['s0-smoke', RUN_ID],
  })

  const clients = await request<Client[]>('GET', '/clients?activeOnly=true', token)
  const projects = await request<Project[]>('GET', '/projects', token)
  const sprints = await request<Sprint[]>('GET', `/sprints?projectId=${project.id}`, token)
  const dailyVisible = await request<QAItem[]>('GET', `/qa-items?sentToDaily=true&dailyDate=${DAILY_DATE}`, token)
  const boardVisible = await request<QAItem[]>('GET', '/qa-items', token)
  const bugs = await request<Paginated<Bug>>('GET', '/bugs', token)

  const relogin = await authLogin()
  const reloginToken = relogin.accessToken
  const persistedItems = await Promise.all(
    dailyItems.map(item => request<QAItem>('GET', `/qa-items/${item.id}`, reloginToken)),
  )
  const persistedStates = new Map(persistedItems.map(item => [item.id, item.workflowState]))

  const qaItemIds = qaItems.map(item => item.id)
  const dailyItemsVisible = dailyVisible.filter(item => qaItemIds.includes(item.id)).length
  const boardItemsVisible = boardVisible.filter(item => qaItemIds.includes(item.id)).length

  return {
    clientCreated: byId(clients, client.id),
    projectCreated: byId(projects, project.id),
    sprintCreated: byId(sprints, sprint.id),
    qaItemsCreated: qaItems.length,
    dailyItemsVisible,
    boardItemsVisible,
    doingWorkflowState: doing.workflowState,
    blockedWorkflowState: blocked.workflowState,
    doneWorkflowState: done.workflowState,
    persistenceAfterRefreshEquivalent:
      persistedStates.get(doing.id) === 'in_testing' &&
      persistedStates.get(blocked.id) === 'blocked' &&
      persistedStates.get(done.id) === 'done',
    bugsEndpointLoaded: Array.isArray(bugs.data) && bugs.data.some(item => item.id === bug.id),
    manualUiValidationRequired: true,
    createdIds: {
      userEmail: smokeUser.email,
      clientId: client.id,
      projectId: project.id,
      sprintId: sprint.id,
      qaItemIds,
      bugId: bug.id,
    },
  }
}

runSmoke()
  .then(result => {
    console.log(JSON.stringify(result, null, 2))
    const passed =
      result.clientCreated &&
      result.projectCreated &&
      result.sprintCreated &&
      result.qaItemsCreated === 3 &&
      result.dailyItemsVisible === 3 &&
      result.boardItemsVisible === 3 &&
      result.doingWorkflowState === 'in_testing' &&
      result.blockedWorkflowState === 'blocked' &&
      result.doneWorkflowState === 'done' &&
      result.persistenceAfterRefreshEquivalent &&
      result.bugsEndpointLoaded

    if (!passed) process.exitCode = 1
  })
  .catch(error => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
