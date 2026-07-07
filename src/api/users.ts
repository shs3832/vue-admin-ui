import {
  type IUsersResponse,
  type CreateUserForm,
  type UpdateUserForm,
  type UsersQuery,
  type IUserResponse,
} from '@/types/users'
import { apiClient } from './client'

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
  const url = queryString ? `/users?${queryString}` : `/users`
  return apiClient<IUsersResponse>(url, { accessToken })
}

export const createUserApi = async (accessToken: string, payload: CreateUserForm) => {
  return apiClient<IUserResponse>(`/users`, { method: 'POST', accessToken, body: payload })
}

export const getUserApi = async (accessToken: string, userId: number) => {
  return apiClient<IUserResponse>(`/users/${userId}`, { accessToken })
}

export const updateUserApi = async (
  accessToken: string,
  payload: UpdateUserForm,
  userId: number,
) => {
  return apiClient<IUserResponse>(`/users/${userId}`, { method: 'PUT', accessToken, body: payload })
}

export const deleteUserApi = async (accessToken: string, userId: number) => {
  const url = `/users/${userId}`
  return apiClient<void>(url, { method: 'DELETE', accessToken })
}
