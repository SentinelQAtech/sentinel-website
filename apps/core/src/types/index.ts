// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'QA_ANALYST' | 'QA_ENGINEER' | 'DEVELOPER' | 'CLIENT_VIEWER'

export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED'

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'QA_TESTING' | 'REVIEW' | 'DONE'

export type BugSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type BugStatus = 'OPEN' | 'IN_PROGRESS' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED' | 'WONT_FIX'

export type SprintStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export type NotificationType =
  | 'MENTION' | 'COMMENT' | 'STATUS_CHANGE' | 'ASSIGNMENT'
  | 'DEADLINE' | 'BUG_CREATED' | 'SPRINT_START'

// ─── Models ───────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  username: string
  name: string
  avatar?: string
  role: Role
  isActive: boolean
  lastSeen?: string
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  priority: Priority
  startDate?: string
  endDate?: string
  progress: number
  tags: string[]
  clientName?: string
  coverColor: string
  ownerId: string
  owner: User
  members: ProjectMember[]
  _count?: {
    tasks: number
    bugs: number
    sprints: number
  }
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: Role
  user: User
  joinedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  storyPoints?: number
  dueDate?: string
  order: number
  tags: string[]
  projectId: string
  sprintId?: string
  assigneeId?: string
  creatorId: string
  parentId?: string
  assignee?: User
  creator: User
  subtasks?: Task[]
  comments?: Comment[]
  attachments?: Attachment[]
  createdAt: string
  updatedAt: string
}

export interface Bug {
  id: string
  bugId: string
  title: string
  description: string
  severity: BugSeverity
  priority: Priority
  status: BugStatus
  environment?: string
  stepsToReproduce?: string
  expectedBehavior?: string
  actualBehavior?: string
  browserInfo?: string
  osInfo?: string
  buildVersion?: string
  tags: string[]
  projectId: string
  assigneeId?: string
  reporterId: string
  sprintId?: string
  assignee?: User
  reporter: User
  project: Project
  comments?: Comment[]
  attachments?: Attachment[]
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Sprint {
  id: string
  name: string
  goal?: string
  status: SprintStatus
  startDate: string
  endDate: string
  velocity?: number
  capacity?: number
  projectId: string
  tasks?: Task[]
  bugs?: Bug[]
  _count?: {
    tasks: number
    bugs: number
  }
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  author: User
  taskId?: string
  bugId?: string
  projectId?: string
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  createdAt: string
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  link?: string
  userId: string
  createdAt: string
}

export interface ActivityLog {
  id: string
  action: string
  entityType: string
  entityId: string
  description: string
  metadata?: Record<string, unknown>
  userId: string
  user: User
  createdAt: string
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  user: User
  tokens: AuthTokens
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  openBugs: number
  criticalBugs: number
  tasksCompleted: number
  tasksPending: number
  activeSprints: number
  teamMembers: number
}

export interface BugTrendPoint {
  date: string
  opened: number
  closed: number
}

export interface SprintVelocity {
  sprintName: string
  planned: number
  completed: number
}
