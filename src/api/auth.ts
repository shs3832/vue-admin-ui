import {
  type RefreshResponse,
  type LoginPayload,
  type LoginResponse,
  type MeResponse,
} from '@/types/auth'
import { apiClient } from './client'

export const fetchMeApi = async (accessToken: string) => {
  return apiClient<MeResponse>(`/auth/me`, { accessToken })
}

export const loginApi = async (payload: LoginPayload) => {
  return apiClient<LoginResponse>(`/auth/login`, {
    method: 'POST',
    body: payload,
    credentials: 'include',
  })
}

export const refreshTokenApi = async () => {
  return apiClient<RefreshResponse>(`/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
}
