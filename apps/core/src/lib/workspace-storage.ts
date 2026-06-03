import { createJSONStorage, type StateStorage } from 'zustand/middleware'

const AUTH_STORE_KEY = 'sentinel-core-auth'
const WORKSPACE_PREFIX = 'sentinel-core-workspace'
const LEGACY_OWNER_KEY = 'sentinel-core-workspace:legacy-owner'

function safeParse(value: string | null): unknown {
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function sanitizeOwner(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
}

export function getWorkspaceOwnerId(storage: Storage = window.localStorage) {
  const auth = safeParse(storage.getItem(AUTH_STORE_KEY)) as {
    state?: { user?: { id?: string; email?: string; username?: string } | null }
  } | null

  const user = auth?.state?.user
  const owner = user?.id || user?.email || user?.username
  return sanitizeOwner(owner || 'anonymous')
}

export function getWorkspaceStorageKey(baseKey: string, storage: Storage = window.localStorage) {
  return `${WORKSPACE_PREFIX}:${getWorkspaceOwnerId(storage)}:${baseKey}`
}

export function canUseLegacyWorkspace(storage: Storage = window.localStorage) {
  const ownerId = getWorkspaceOwnerId(storage)
  const legacyOwner = storage.getItem(LEGACY_OWNER_KEY)
  if (!legacyOwner) {
    storage.setItem(LEGACY_OWNER_KEY, ownerId)
    return true
  }
  return legacyOwner === ownerId
}

export function createUserWorkspaceStorage(): ReturnType<typeof createJSONStorage> {
  const storage: StateStorage = {
    getItem: (name) => {
      if (typeof window === 'undefined') return null
      const scopedName = getWorkspaceStorageKey(name, window.localStorage)
      const scopedValue = window.localStorage.getItem(scopedName)
      if (scopedValue !== null) return scopedValue

      const legacyValue = canUseLegacyWorkspace(window.localStorage)
        ? window.localStorage.getItem(name)
        : null
      if (legacyValue !== null) {
        window.localStorage.setItem(scopedName, legacyValue)
      }
      return legacyValue
    },
    setItem: (name, value) => {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(getWorkspaceStorageKey(name, window.localStorage), value)
    },
    removeItem: (name) => {
      if (typeof window === 'undefined') return
      window.localStorage.removeItem(getWorkspaceStorageKey(name, window.localStorage))
    },
  }

  return createJSONStorage(() => storage)
}
