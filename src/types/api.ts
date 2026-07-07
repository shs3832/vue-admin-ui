export type ApiErrorResponse = {
  message: string
  errors?: Record<string, string>
  fieldErrors?: Record<string, string>
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 함수로 작성하는 건 별도로 동작하는 객체를 만드는 느낌이고,
// 클래스로 작성한 건 기존 Error에 API 에러 정보를 더해주는 느낌이라 function 대신 class 문법으로 작성
// 백엔드 API 실패를 프론트에서 다루기 쉬운 형태로 표현하는 전용 에러
export class ApiError extends Error {
  // HTTP 상태 코드: 400, 401, 403, 500 등
  status: number

  // 백엔드 원본 errors. 예: { "body.email": "..." } 또는 { email: "..." }
  errors?: Record<string, string>

  // input name과 바로 매핑하기 좋은 필드별 에러
  fieldErrors?: Record<string, string>

  constructor({
    status,
    message,
    errors,
    fieldErrors,
  }: {
    status: number
    message: string
    errors?: Record<string, string>
    fieldErrors?: Record<string, string>
  }) {
    // ApiError는 Error를 상속하므로, 먼저 부모 Error에 message를 전달해 기본 에러 객체를 초기화한다.
    super(message)

    // catch에서 어떤 종류의 에러인지 구분하기 위한 이름
    this.name = 'ApiError'

    // API 에러 처리에 필요한 추가 정보
    this.status = status
    this.errors = errors
    this.fieldErrors = fieldErrors
  }
}

// catch에서 unknown error가 ApiError인지 안전하게 확인하는 함수
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError
}
