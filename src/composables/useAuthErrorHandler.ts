import { useAuthStore } from '@/stores/auth'
import { isApiError } from '@/types/api'
import { useRouter } from 'vue-router'

export const useAuthErrorHandler = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const handleAuthError = (error: unknown) => {
    if (!isApiError(error)) return false
    if (error.status !== 401) return false
    authStore.clearAuth()
    router.push({ name: 'login' })
    return true
  }

  return {
    handleAuthError,
  }
}
