import { fetchMeApi } from '@/api/auth'
import { defineStore } from 'pinia'

type AuthUser = {
  email: string
  id: number
  name: string
  role: string
  status: string
}

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

        if (!response.ok) {
          this.clearAuth()
          return
        }

        const data = await response.json()
        this.accessToken = accessToken
        this.user = data.data
      } catch (error) {
        this.clearAuth()
        console.log(error)
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
