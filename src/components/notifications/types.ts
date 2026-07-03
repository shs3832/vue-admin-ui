export type NotificationType = 'info' | 'warning' | 'error' | 'success'

export type NotificationItem = {
  id: number
  userId: number
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}
export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type NotificationsResponse = {
  items: NotificationItem[]
  pagination: PaginationMeta
}

export type NotificationsQuery = {
  page: number
  limit: number
  keyword?: string
  isRead?: boolean
}

export type ApiErrorResponse = {
  message: string
  errors?: Record<string, string>
}

export type NotificationTypeLabels = Record<NotificationType, string>
