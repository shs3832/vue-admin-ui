export type ApiErrorResponse = {
  message: string
  errors?: Record<string, string>
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}
