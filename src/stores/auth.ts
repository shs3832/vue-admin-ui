import { fetchMeApi, refreshTokenApi } from '@/api/auth'
import type { AuthUser } from '@/types/auth'
import { defineStore } from 'pinia'
import { isApiError } from '@/types/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({ accessToken: '', user: null as AuthUser | null, isCheckingAuth: false }),
  getters: {
    isLoggedIn: (state) => Boolean(state.accessToken),
  },
  actions: {
    setAuth(accessToken: string, user: AuthUser) {
      this.accessToken = accessToken
      this.user = user
      localStorage.setItem('accessToken', accessToken)
    },
    async checkAuth() {
      this.isCheckingAuth = true
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        this.clearAuth()
        this.isCheckingAuth = false
        return
      }
      try {
        const response = await fetchMeApi(accessToken)
        this.setAuth(accessToken, response.data)
      } catch (error) {
        if (isApiError(error) && error.status === 401) {
          try {
            const refreshResponse = await refreshTokenApi()
            this.setAuth(refreshResponse.data.accessToken, refreshResponse.data.user)
            return
          } catch {
            this.clearAuth()
            return
          }
        }
        this.clearAuth()
      } finally {
        this.isCheckingAuth = false
      }
    },

    logout() {
      this.clearAuth()
    },

    clearAuth() {
      this.accessToken = ''
      this.user = null
      localStorage.removeItem('accessToken')
    },
  },
})
