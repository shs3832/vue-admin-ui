import type { ActivityLogsQuery } from './types'
const baseUrl = `${import.meta.env.VITE_APP_API_URL}/api`
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
  const response = await fetch(`${baseUrl}/activity-logs?${queryString}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response
}
