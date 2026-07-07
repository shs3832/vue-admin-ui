<template>
  <div class="flex min-h-screen items-center justify-center bg-bg-page px-4">
    <div class="w-full max-w-sm rounded-lg border border-border bg-bg-surface p-6 shadow-sm">
      <div class="mb-6">
        <p class="text-sm font-medium text-primary">Vue Admin UI</p>
        <h2 class="mt-2 text-2xl font-bold text-text-primary">로그인</h2>
        <p class="mt-1 text-sm text-text-secondary">관리자 계정으로 로그인합니다.</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-text-secondary">
            이메일
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            autocomplete="email"
            class="w-full rounded-md border border-border-strong px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-text-secondary">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            v-model="password"
            autocomplete="current-password"
            class="w-full rounded-md border border-border-strong px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="비밀번호 입력"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <p v-if="errorMessage" class="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { loginApi } from '@/api/auth'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { isApiError } from '@/types/api'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const authStore = useAuthStore()
const handleSubmit = async () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = '이메일이나 패스워드를 입력하세요'
    return
  }

  isSubmitting.value = true

  try {
    const response = await loginApi({ email: email.value, password: password.value })
    authStore.setAuth(response.data.accessToken, response.data.user)
    router.push(`/dashboard`)
  } catch (error) {
    if (isApiError(error)) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '로그인 중 에러가 발생했습니다.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
