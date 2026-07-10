import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from './client'
import { ApiError } from '@/types/api'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('apiClient', () => {
  it('정상 JSON 응답을 반환한다', async () => {
    const responseData = {
      data: {
        id: 1,
        name: '테스트상품',
      },
    }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
    const result = await apiClient<typeof responseData>('/test')
    expect(result).toEqual(responseData)
  })

  it('204 응답은 undefined를 반환한다', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    )
    const result = await apiClient('/test')
    expect(result).toBeUndefined()
  })

  it('실패 응답은 ApiError를 발생시킨다', async () => {
    const errorData = {
      message: '요청 값이 올바르지 않습니다.',
    }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(errorData), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    await expect(apiClient('/test')).rejects.toBeInstanceOf(ApiError)
  })

  it('실패 응답 정보를 ApiError에 보존한다', async () => {
    const errorData = {
      message: '입력값을 확인해주세요.',
      errors: {
        'body.name': '상품명은 필수입니다.',
      },
      fieldErrors: {
        name: '상품명은 필수입니다.',
      },
    }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(errorData), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
    await expect(apiClient('/test')).rejects.toMatchObject({
      status: 400,
      message: errorData.message,
      errors: errorData.errors,
      fieldErrors: errorData.fieldErrors,
    })
  })

  it('access token을 Authorization header로 전달한다', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    )

    await apiClient('/test', {
      accessToken: 'test-token',
    })

    expect(fetchMock).toHaveBeenCalledOnce()

    const requestOptions = fetchMock.mock.calls[0]?.[1]
    const headers = new Headers(requestOptions?.headers)

    expect(headers.get('Authorization')).toBe('Bearer test-token')
  })

  it('JSON body와 요청 옵션을 fetch에 전달한다', async () => {
    const requestBody = {
      status: 'hidden',
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    )

    await apiClient('/test', {
      method: 'PATCH',
      body: requestBody,
    })

    const requestOptions = fetchMock.mock.calls[0]?.[1]
    const headers = new Headers(requestOptions?.headers)

    expect(requestOptions?.method).toBe('PATCH')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(requestOptions?.body).toBe(JSON.stringify(requestBody))
  })

  it('FormData body는 Content-Type을 직접 설정하지 않고 전달한다', async () => {
    const formData = new FormData()
    formData.append('file', 'test-file')

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 204,
      }),
    )

    await apiClient('/test', {
      method: 'POST',
      body: formData,
    })

    const requestOptions = fetchMock.mock.calls[0]?.[1]
    const headers = new Headers(requestOptions?.headers)

    expect(requestOptions?.body).toBe(formData)
    expect(headers.has('Content-Type')).toBe(false)
  })
})
