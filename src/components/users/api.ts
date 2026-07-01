import type { UsersQuery } from './types'

export const fetchUsersApi = async (accessToken: string, query: UsersQuery) => {
  const params = new URLSearchParams()
  if (query.keyword) {
    params.set('keyword', query.keyword)
  }
  if (query.role) {
    params.set('role', query.role)
  }
  if (query.status) {
    params.set('status', query.status)
  }

  params.set('page', String(query.page))
  params.set('limit', String(query.limit))
  const queryString = params.toString()
  const url = queryString
    ? `${import.meta.env.VITE_APP_API_URL}/api/users?${queryString}`
    : `${import.meta.env.VITE_APP_API_URL}/api/users`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response
}
