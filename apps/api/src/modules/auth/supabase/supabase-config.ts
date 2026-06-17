interface SupabaseServerEnv {
  SUPABASE_SERVICE_ROLE_KEY?: string
  SUPABASE_PUBLISHABLE_KEY?: string
}

export function resolveSupabaseServerKey(
  env: SupabaseServerEnv
): string | undefined {
  return env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_PUBLISHABLE_KEY
}
