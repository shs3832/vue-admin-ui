import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from './client'
import { ApiError } from '@/types/api'

// 테스트 대상인 apiClient는 실제 코드를 실행하고, 외부 네트워크 경계인 fetch만 mock으로 교체한다.
// 기본 읽기 순서: 가짜 Response 준비(Arrange) -> apiClient 실행(Act) -> 반환값/요청 정보 검증(Assert).
afterEach(() => {
  // spyOn으로 교체한 전역 fetch가 다른 테스트에 남지 않도록 원본 함수로 복구한다.
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

    // mock.calls는 [호출 횟수][함수 인자] 구조다. fetch의 두 번째 인자가 request options다.
    const requestOptions = fetchMock.mock.calls[0]?.[1]
    // headers 옵션은 여러 형태가 가능하므로 Headers 객체로 정규화한 뒤 값을 읽는다.
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

    // FormData는 JSON.stringify하지 않고 원본을 전달하며, multipart boundary는 브라우저가 설정한다.
    expect(requestOptions?.body).toBe(formData)
    expect(headers.has('Content-Type')).toBe(false)
  })
})
