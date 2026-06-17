import assert from 'node:assert/strict'
import test from 'node:test'
import { getBugsLoadErrorMessage, normalizeBugsResponse } from './bugs-contract'

test('normalizes a bare empty array as the first empty page', () => {
  assert.deepEqual(normalizeBugsResponse([]), {
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })
})

test('normalizes a wrapped empty array and preserves valid metadata', () => {
  assert.deepEqual(
    normalizeBugsResponse({
      data: [],
      total: 0,
      page: 2,
      limit: 50,
      totalPages: 0
    }),
    {
      data: [],
      total: 0,
      page: 2,
      limit: 50,
      totalPages: 0
    }
  )
})

test('rejects an invalid bugs payload instead of hiding the contract failure', () => {
  assert.throws(
    () => normalizeBugsResponse({ bugs: [] }),
    /Formato invalido na resposta de Bugs/
  )
})

test('describes authentication and network failures explicitly', () => {
  assert.equal(
    getBugsLoadErrorMessage({ response: { status: 401 } }),
    'Sua sessao expirou. Entre novamente para carregar os bugs.'
  )
  assert.equal(
    getBugsLoadErrorMessage({ message: 'Network Error' }),
    'Nao foi possivel conectar a API de Bugs.'
  )
})
