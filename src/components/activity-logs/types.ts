export type ActivityLogItem = {
  id: number
  actor: string
  action: string
  target: string
  createdAt: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ActivityLogsResponse = {
  items: ActivityLogItem[]
  pagination: PaginationMeta
}

export type ActivityLogsQuery = {
  page: number
  limit: number
  keyword?: string
}

export type ApiErrorResponse = {
  message: string
  errors?: Record<string, string>
}
