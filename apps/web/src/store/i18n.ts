'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Locale = 'pt-BR' | 'en-US'

type Dictionary = Record<string, string>

const dictionaries: Record<Locale, Dictionary> = {
  'pt-BR': {
    overview: 'VISÃO GERAL',
    workspace: 'TRABALHO',
    management: 'GESTÃO',
    analytics: 'ANÁLISES',
    dashboard: 'Dashboard',
    daily: 'Daily',
    calendar: 'Calendário',
    projects: 'Projetos',
    board: 'Board',
    sprints: 'Sprints',
    bugs: 'Bugs',
    team: 'Time',
    clients: 'Clientes',
    qaImporter: 'QA Importer',
    reports: 'Relatórios',
    notifications: 'Notificações',
    settings: 'Configurações',
    create: 'Criar',
    myProfile: 'Meu perfil',
    logout: 'Sair',
    clientsTitle: 'Clientes',
    clientsSubtitle: 'Base de clientes usada no Daily, projetos e rotinas de QA.',
    searchClient: 'Buscar cliente...',
    actionMap: 'Mapa de atuação',
    todayMeetings: 'Reuniões de Hoje',
    agenda: 'Agenda',
    noMeetingsToday: 'Sem reuniões hoje',
    nextMeeting: 'Próxima',
    total: 'total',
    dailyTitle: 'Daily Command Center',
    dailyTodayHint: 'Planeje, priorize e acompanhe o trabalho de hoje.',
    dailyHistoryHint: 'Consulta histórica da Daily selecionada.',
    generateTemplate: 'Gerar Template',
    meeting: 'Reunião',
    task: 'Tarefa',
    history: 'Histórico',
    previousDaily: 'Daily anterior',
    nextDaily: 'Próxima Daily',
    today: 'Hoje',
    byClient: 'Por Cliente',
    byPriority: 'Por Prioridade',
  },
  'en-US': {
    overview: 'OVERVIEW',
    workspace: 'WORKSPACE',
    management: 'MANAGEMENT',
    analytics: 'ANALYTICS',
    dashboard: 'Dashboard',
    daily: 'Daily',
    calendar: 'Calendar',
    projects: 'Projects',
    board: 'Board',
    sprints: 'Sprints',
    bugs: 'Bugs',
    team: 'Team',
    clients: 'Clients',
    qaImporter: 'QA Importer',
    reports: 'Reports',
    notifications: 'Notifications',
    settings: 'Settings',
    create: 'Create',
    myProfile: 'My profile',
    logout: 'Log out',
    clientsTitle: 'Clients',
    clientsSubtitle: 'Client base used across Daily, projects and QA routines.',
    searchClient: 'Search client...',
    actionMap: 'Coverage map',
    todayMeetings: "Today's Meetings",
    agenda: 'Agenda',
    noMeetingsToday: 'No meetings today',
    nextMeeting: 'Next',
    total: 'total',
    dailyTitle: 'Daily Command Center',
    dailyTodayHint: 'Plan, prioritize and track today’s work.',
    dailyHistoryHint: 'Viewing the selected Daily history.',
    generateTemplate: 'Generate Template',
    meeting: 'Meeting',
    task: 'Task',
    history: 'History',
    previousDaily: 'Previous Daily',
    nextDaily: 'Next Daily',
    today: 'Today',
    byClient: 'By Client',
    byPriority: 'By Priority',
  },
}

interface I18nState {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'pt-BR',
      setLocale: locale => set({ locale }),
      t: key => dictionaries[get().locale][key] ?? dictionaries['pt-BR'][key] ?? key,
    }),
    { name: 'spm-locale' }
  )
)

export const LANGUAGE_OPTIONS: { locale: Locale; flag: string; label: string }[] = [
  { locale: 'pt-BR', flag: '🇧🇷', label: 'Português - BR' },
  { locale: 'en-US', flag: '🇺🇸', label: 'English - USA' },
]
