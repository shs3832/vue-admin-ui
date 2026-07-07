import type { ActivityLogsQuery, ActivityLogsResponse } from '@/types/activityLogs'
import { apiClient } from './client'
export const fetchActivityLogsApi = async (
  accessToken: string,
  query: ActivityLogsQuery = { page: 1, limit: 10 },
) => {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('limit', String(query.limit))

  if (query.keyword) {
    params.set('keyword', query.keyword)
  }

  const queryString = params.toString()

  return apiClient<ActivityLogsResponse>(`/activity-logs?${queryString}`, { accessToken })
}
