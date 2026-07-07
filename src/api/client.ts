import { ApiError, type ApiErrorResponse } from '@/types/api'

const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api`

export const apiClient = async <T>(path: string, options: ApiClientOptions = {}) => {
  const headers = new Headers()

  const body = options.body
  let requestBody: BodyInit | undefined
  if (body !== undefined) {
    if (body instanceof FormData) {
      requestBody = body
    } else {
      requestBody = JSON.stringify(body)
    }
  }
  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`)
  }
  if (body !== undefined && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: requestBody,
    credentials: options.credentials,
  })

  if (response.status === 204) return undefined as T

  const responseData = await response.json()
  if (!response.ok) {
    const errorData = responseData as ApiErrorResponse

    throw new ApiError({
      status: response.status,
      message: errorData.message || '요청 처리에 실패했습니다.',
      errors: errorData.errors,
      fieldErrors: errorData.fieldErrors,
    })
  }
  return responseData as T
}

type ApiClientOptions = {
  method?: string
  accessToken?: string
  body?: unknown
  credentials?: RequestCredentials
}
