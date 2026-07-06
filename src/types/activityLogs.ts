import type { PaginationMeta } from './api'

export type ActivityLogItem = {
  id: number
  actor: string
  action: string
  target: string
  createdAt: string
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
