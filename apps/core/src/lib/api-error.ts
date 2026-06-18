export function getApiErrorMessage(
  error: unknown,
  fallback = 'Nao foi possivel salvar. Tente novamente.'
): string {
  const candidate = error as {
    message?: string
    response?: { data?: { message?: string | string[] } }
  } | null
  const responseMessage = candidate?.response?.data?.message

  if (Array.isArray(responseMessage)) return responseMessage.join(' ')
  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage
  }
  if (candidate?.message === 'Network Error') {
    return 'Nao foi possivel conectar a API. Verifique a conexao e tente novamente.'
  }
  return fallback
}
