'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type ClientStatus = 'active' | 'paused' | 'finished'

export interface Client {
  id: string
  name: string
  shortName: string
  status: ClientStatus
  startedAt: string
  finishedAt?: string
  country?: string
  contactName?: string
  contactEmail?: string
  jiraUrl?: string
  notes?: string
  color: string
  createdAt: string
  updatedAt: string
}

interface ApiClient {
  id: string
  name: string
  shortName: string
  status: string
  startedAt: string
  finishedAt: string | null
  country: string | null
  contactName: string | null
  contactEmail: string | null
  jiraUrl: string | null
  notes: string | null
  color: string
  createdAt: string
  updatedAt: string
}

export interface ClientInput {
  name: string
  shortName?: string
  status?: ClientStatus
  startedAt?: string
  finishedAt?: string
  country?: string
  contactName?: string
  contactEmail?: string
  jiraUrl?: string
  notes?: string
  color?: string
}

export const clientKeys = {
  all: ['clients'] as const,
  active: ['clients', 'active'] as const,
}

function mapClient(client: ApiClient): Client {
  return {
    id: client.id,
    name: client.name,
    shortName: client.shortName,
    status: (client.status || 'active') as ClientStatus,
    startedAt: client.startedAt.slice(0, 10),
    finishedAt: client.finishedAt?.slice(0, 10),
    country: client.country ?? undefined,
    contactName: client.contactName ?? undefined,
    contactEmail: client.contactEmail ?? undefined,
    jiraUrl: client.jiraUrl ?? undefined,
    notes: client.notes ?? undefined,
    color: client.color,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  }
}

function invalidateClients(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: clientKeys.all })
  queryClient.invalidateQueries({ queryKey: clientKeys.active })
}

export function useClients() {
  return useQuery({
    queryKey: clientKeys.all,
    queryFn: async () => {
      const { data } = await api.get<ApiClient[]>('/clients')
      return data.map(mapClient)
    },
  })
}

export function useActiveClients() {
  return useQuery({
    queryKey: clientKeys.active,
    queryFn: async () => {
      const { data } = await api.get<ApiClient[]>('/clients?activeOnly=true')
      return data.map(mapClient)
    },
  })
}

export function useClientOptions() {
  const query = useActiveClients()
  const options = useMemo(
    () => (query.data ?? []).map(client => ({
      id: client.id,
      label: client.name,
      value: client.name,
      shortName: client.shortName || client.name.slice(0, 3).toUpperCase(),
      color: client.color || '#6366f1',
    })),
    [query.data]
  )
  return { ...query, options }
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ClientInput) => {
      const { data } = await api.post<ApiClient>('/clients', input)
      return mapClient(data)
    },
    onSuccess: () => invalidateClients(queryClient),
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ClientInput }) => {
      const { data } = await api.patch<ApiClient>(`/clients/${id}`, updates)
      return mapClient(data)
    },
    onSuccess: () => invalidateClients(queryClient),
  })
}

export function useFinishClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<ApiClient>(`/clients/${id}/finish`)
      return mapClient(data)
    },
    onSuccess: () => invalidateClients(queryClient),
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/clients/${id}`)
    },
    onSuccess: () => invalidateClients(queryClient),
  })
}
