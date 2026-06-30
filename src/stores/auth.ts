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
        this.accessToken = ''
        this.user = null
        this.isCheckingAuth = false
        return
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          this.accessToken = ''
          this.user = null
          localStorage.removeItem('accessToken')
          return
        }

        const data = await response.json()
        this.accessToken = accessToken
        this.user = data.data
      } catch (error) {
        this.accessToken = ''
        this.user = null
        localStorage.removeItem('accessToken')
        console.log(error)
      } finally {
        this.isCheckingAuth = false
      }
    },

    logout() {
      this.accessToken = ''
      this.user = null
      localStorage.removeItem('accessToken')
    },
  },
})
