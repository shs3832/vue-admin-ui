import type { NotificationsQuery, NotificationsResponse } from '@/types/notifications'
import { apiClient } from './client'
export const fetchNotificationsApi = async (
  accessToken: string,
  query: NotificationsQuery = { page: 1, limit: 10 },
) => {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('limit', String(query.limit))

  if (query.keyword) {
    params.set('keyword', query.keyword)
  }

  // true, false판별이아니라 불리언값인지 아닌지 판단해 파라미터로 넣어주기위해 typeof 사용
  if (typeof query.isRead === 'boolean') {
    params.set('isRead', String(query.isRead))
  }

  const queryString = params.toString()

  return apiClient<NotificationsResponse>(`/notifications?${queryString}`, { accessToken })
}
