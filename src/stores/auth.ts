import { fetchMeApi } from '@/api/auth'
import type { AuthUser } from '@/types/auth'
import { defineStore } from 'pinia'

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
        this.accessToken = accessToken
        this.user = response.data
      } catch (error) {
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
