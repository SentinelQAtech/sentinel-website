export interface BugsPage<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function normalizeBugsResponse<T>(payload: unknown): BugsPage<T> {
  if (Array.isArray(payload)) {
    return {
      data: payload as T[],
      total: payload.length,
      page: 1,
      limit: 20,
      totalPages: payload.length > 0 ? 1 : 0
    }
  }

  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    const response = payload as Record<string, unknown> & { data: T[] }
    const total = finiteNumber(response.total, response.data.length)
    const limit = finiteNumber(response.limit, 20)

    return {
      data: response.data,
      total,
      page: finiteNumber(response.page, 1),
      limit,
      totalPages: finiteNumber(
        response.totalPages,
        total === 0 ? 0 : Math.ceil(total / limit)
      )
    }
  }

  throw new Error('Formato invalido na resposta de Bugs.')
}

export function getBugsLoadErrorMessage(error: unknown): string {
  const candidate = error as {
    message?: string
    response?: { status?: number }
  } | null
  const status = candidate?.response?.status

  if (status === 401) {
    return 'Sua sessao expirou. Entre novamente para carregar os bugs.'
  }
  if (status === 403) {
    return 'Sua conta nao tem permissao para visualizar os bugs.'
  }
  if (typeof status === 'number' && status >= 500) {
    return `A API de Bugs respondeu com erro (${status}).`
  }
  if (candidate?.message === 'Network Error') {
    return 'Nao foi possivel conectar a API de Bugs.'
  }
  if (candidate?.message === 'Formato invalido na resposta de Bugs.') {
    return 'A API de Bugs retornou uma resposta invalida.'
  }

  return 'Nao foi possivel carregar os bugs.'
}
